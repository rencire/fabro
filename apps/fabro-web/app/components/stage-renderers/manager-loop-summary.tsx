import {
  ArrowPathRoundedSquareIcon,
  InformationCircleIcon,
} from "@heroicons/react/20/solid";

import type { Stage } from "../stage-sidebar";
import { StageMetaBar } from "./meta-bar";

// TODO: render an iterations list once the manager-loop handler emits cycle
// boundary events (e.g. `manager_loop.cycle.started/completed`). Today the
// child workflow's events flow on the parent run's stream without a marker
// linking them back to this stage.

export function ManagerLoopSummary({
  stage,
  notes,
}: {
  stage: Stage;
  notes: string | null;
}) {
  const cycleHint = notes ?? null;

  return (
    <div className="space-y-6 pl-3 pr-4 sm:pr-6 lg:pr-8">
      <StageMetaBar stage={stage} />

      <section className="rounded-lg bg-panel p-5 outline-1 -outline-offset-1 outline-line">
        <div className="flex items-center gap-2 text-xs">
          <ArrowPathRoundedSquareIcon className="size-4 text-teal-500" aria-hidden="true" />
          <span className="font-medium uppercase tracking-wider text-fg-muted">
            Manager loop
          </span>
        </div>
        <p className="mt-2 text-sm text-fg-2">
          <span className="font-mono text-fg">{stage.nodeId}</span> ran a nested
          workflow until its stop condition was satisfied.
        </p>
        {cycleHint && (
          <p className="mt-3 rounded-md bg-overlay-strong px-3 py-2 font-mono text-xs text-fg-3">
            {cycleHint}
          </p>
        )}
        <p className="mt-3 inline-flex items-start gap-1.5 text-xs text-fg-muted">
          <InformationCircleIcon
            className="mt-px size-3.5 shrink-0"
            aria-hidden="true"
          />
          Per-iteration progress isn't broken out yet — open the Debug tab to
          inspect raw events from the child workflow.
        </p>
      </section>
    </div>
  );
}
