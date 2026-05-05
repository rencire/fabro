use anyhow::Result;
use chrono::{DateTime, Utc};
use fabro_api::types;
use fabro_util::printer::Printer;

use crate::args::{SystemRepairArgs, SystemRepairCommand, SystemRepairRunsArgs};
use crate::command_context::CommandContext;
use crate::shared::print_json_pretty;

pub(super) async fn repair_command(
    args: &SystemRepairArgs,
    base_ctx: &CommandContext,
) -> Result<()> {
    match &args.command {
        SystemRepairCommand::Runs(args) => repair_runs_command(args, base_ctx).await,
    }
}

async fn repair_runs_command(args: &SystemRepairRunsArgs, base_ctx: &CommandContext) -> Result<()> {
    let ctx = base_ctx.with_connection(&args.connection)?;
    let server = ctx.server().await?;
    let response = server.get_system_repair_runs().await?;
    repair_runs_from(&response, ctx.json_output(), ctx.printer())
}

fn repair_runs_from(
    response: &types::SystemRepairRunsResponse,
    json_output: bool,
    printer: Printer,
) -> Result<()> {
    if json_output {
        print_json_pretty(response)?;
        return Ok(());
    }

    let runs = response.runs.as_slice();
    if runs.is_empty() {
        fabro_util::printout!(printer, "No run repair issues found.");
        return Ok(());
    }

    fabro_util::printout!(printer, "Unreadable runs:");
    for run in runs {
        fabro_util::printout!(
            printer,
            "  {}  {}  {}",
            run.run_id.as_deref().unwrap_or("-"),
            format_created_at(run.created_at.as_ref()),
            run.error.as_deref().unwrap_or("-"),
        );
    }

    fabro_util::printout!(printer, "");
    fabro_util::printout!(printer, "Delete with:");
    for run in runs {
        if let Some(run_id) = run.run_id.as_deref() {
            fabro_util::printout!(printer, "  fabro rm --force {run_id}");
        }
    }
    Ok(())
}

fn format_created_at(created_at: Option<&DateTime<Utc>>) -> String {
    created_at.map_or_else(|| "-".to_string(), DateTime::to_rfc3339)
}
