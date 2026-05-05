use fabro_test::{fabro_snapshot, test_context};
use httpmock::MockServer;
use serde_json::Value;

#[test]
fn help() {
    let context = test_context!();
    let mut cmd = context.command();
    cmd.args(["system", "repair", "runs", "--help"]);
    fabro_snapshot!(context.filters(), cmd, @"
    success: true
    exit_code: 0
    ----- stdout -----
    List runs that cannot be loaded from durable storage

    Usage: fabro system repair runs [OPTIONS]

    Options:
          --json                       Output as JSON [env: FABRO_JSON=]
          --storage-dir <STORAGE_DIR>  Local storage directory (default: ~/.fabro/storage) [env: FABRO_STORAGE_DIR=]
          --debug                      Enable DEBUG-level logging (default is INFO) [env: FABRO_DEBUG=]
          --server <SERVER>            Fabro server target: http(s) URL or absolute Unix socket path [env: FABRO_SERVER=]
          --no-upgrade-check           Disable automatic upgrade check [env: FABRO_NO_UPGRADE_CHECK=true]
          --quiet                      Suppress non-essential output [env: FABRO_QUIET=]
          --verbose                    Enable verbose output [env: FABRO_VERBOSE=]
      -h, --help                       Print help
    ----- stderr -----
    ");
}

#[test]
fn system_repair_runs_reports_unreadable_runs() {
    let context = test_context!();
    let server = MockServer::start();
    let mock = server.mock(|when, then| {
        when.method("GET").path("/api/v1/system/repair/runs");
        then.status(200)
            .header("Content-Type", "application/json")
            .body(
                serde_json::json!({
                    "runs": [{
                        "run_id": "01KQT1TNZ0QXK0QHP10G0V5X84",
                        "created_at": "2026-05-05T20:46:33Z",
                        "error": "Serialization error: missing field `integrations`",
                    }],
                    "total_count": 1,
                })
                .to_string(),
            );
    });
    context.set_http_target(&server.base_url());

    let output = context
        .command()
        .args(["system", "repair", "runs"])
        .output()
        .expect("command should run");

    assert!(output.status.success(), "system repair runs failed");
    let stdout = String::from_utf8(output.stdout).expect("stdout should be valid UTF-8");
    assert!(stdout.contains("Unreadable runs:"), "{stdout}");
    assert!(stdout.contains("01KQT1TNZ0QXK0QHP10G0V5X84"), "{stdout}");
    assert!(stdout.contains("missing field `integrations`"), "{stdout}");
    assert!(
        stdout.contains("fabro rm --force 01KQT1TNZ0QXK0QHP10G0V5X84"),
        "{stdout}"
    );
    mock.assert();
}

#[test]
fn system_repair_runs_json_emits_api_response() {
    let context = test_context!();
    let server = MockServer::start();
    let mock = server.mock(|when, then| {
        when.method("GET").path("/api/v1/system/repair/runs");
        then.status(200)
            .header("Content-Type", "application/json")
            .body(
                serde_json::json!({
                    "runs": [{
                        "run_id": "01KQT1TNZ0QXK0QHP10G0V5X84",
                        "created_at": "2026-05-05T20:46:33Z",
                        "error": "Serialization error: missing field `integrations`",
                    }],
                    "total_count": 1,
                })
                .to_string(),
            );
    });
    context.set_http_target(&server.base_url());

    let output = context
        .command()
        .args(["--json", "system", "repair", "runs"])
        .output()
        .expect("command should run");

    assert!(output.status.success());
    let value: Value =
        serde_json::from_slice(&output.stdout).expect("system repair JSON should parse");
    assert_eq!(value["total_count"], 1);
    assert_eq!(value["runs"][0]["run_id"], "01KQT1TNZ0QXK0QHP10G0V5X84");
    mock.assert();
}

#[test]
fn system_repair_runs_reports_empty_state() {
    let context = test_context!();
    let server = MockServer::start();
    let mock = server.mock(|when, then| {
        when.method("GET").path("/api/v1/system/repair/runs");
        then.status(200)
            .header("Content-Type", "application/json")
            .body(serde_json::json!({ "runs": [], "total_count": 0 }).to_string());
    });
    context.set_http_target(&server.base_url());

    let output = context
        .command()
        .args(["system", "repair", "runs"])
        .output()
        .expect("command should run");

    assert!(output.status.success());
    let stdout = String::from_utf8(output.stdout).expect("stdout should be valid UTF-8");
    assert!(stdout.contains("No run repair issues found."), "{stdout}");
    mock.assert();
}
