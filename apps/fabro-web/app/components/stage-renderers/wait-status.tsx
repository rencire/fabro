import { ClockIcon, PauseCircleIcon } from "@heroicons/react/20/solid";

import type { Stage } from "../stage-sidebar";
import { ACTIVE_STAGE_STATES } from "../../lib/stage-sidebar";
import { useTickingNow } from "../../lib/time";
import { StageMetaBar } from "./meta-bar";

function formatElapsed(startedAt: string | null): string {
  if (!startedAt) return "—";
  const startMs = Date.parse(startedAt);
  if (Number.isNaN(startMs)) return "—";
  const totalSecs = Math.max(0, Math.floor((Date.now() - startMs) / 1000));
  const hours = Math.floor(totalSecs / 3600);
  const minutes = Math.floor((totalSecs % 3600) / 60);
  const seconds = totalSecs % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

export function WaitStatus({ stage }: { stage: Stage }) {
  const isActive = ACTIVE_STAGE_STATES.has(stage.status);
  // Tick every second while waiting so the clock keeps moving.
  useTickingNow(isActive);
  const elapsed = formatElapsed(stage.startedAt);

  return (
    <div className="space-y-6 pl-3 pr-4 pt-2 sm:pr-6 lg:pr-8">
      <StageMetaBar stage={stage} />

      <section className="rounded-lg bg-panel p-6 outline-1 -outline-offset-1 outline-line">
        <div className="flex items-center gap-3">
          {isActive ? (
            <PauseCircleIcon className="size-6 text-amber" aria-hidden="true" />
          ) : (
            <ClockIcon className="size-6 text-fg-muted" aria-hidden="true" />
          )}
          <div>
            <p className="text-sm font-medium text-fg">
              {isActive ? "Waiting" : "Wait complete"}
            </p>
            <p className="mt-0.5 text-xs text-fg-muted">
              {isActive
                ? "The workflow will resume automatically when the configured duration elapses."
                : `Held for ${stage.duration} before continuing.`}
            </p>
          </div>
          <div className="ml-auto text-right">
            <div className="text-[10px] font-medium uppercase tracking-wider text-fg-muted">
              {isActive ? "Elapsed" : "Total"}
            </div>
            <div className="font-mono text-2xl tabular-nums text-fg">
              {isActive ? elapsed : stage.duration}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
