import {
  ArrowsRightLeftIcon,
  InformationCircleIcon,
} from "@heroicons/react/20/solid";

import type { Stage } from "../stage-sidebar";
import { StageMetaBar } from "./meta-bar";

// TODO: render the evaluated condition expression and the chosen edge once
// `ConditionalHandler` emits a `conditional.evaluated` event with that data.
// Right now the handler is a passthrough — engine-level edge selection is the
// only signal — so we only have notes/duration to display.

export function ConditionalDecision({ stage }: { stage: Stage }) {
  return (
    <div className="space-y-6 pl-3 pr-4 pt-2 sm:pr-6 lg:pr-8">
      <StageMetaBar stage={stage} />

      <section className="rounded-lg bg-panel p-5 outline-1 -outline-offset-1 outline-line">
        <div className="flex items-center gap-2 text-xs text-fg-muted">
          <ArrowsRightLeftIcon className="size-4" aria-hidden="true" />
          <span className="font-medium uppercase tracking-wider">Decision</span>
        </div>
        <p className="mt-2 text-sm text-fg-2">
          The conditional <span className="font-mono text-fg">{stage.nodeId}</span>{" "}
          evaluated and the workflow continued along its chosen edge.
        </p>
        <p className="mt-3 inline-flex items-start gap-1.5 text-xs text-fg-muted">
          <InformationCircleIcon
            className="mt-px size-3.5 shrink-0"
            aria-hidden="true"
          />
          The condition expression and chosen edge aren't surfaced yet — open
          the Debug tab to inspect raw events, or follow the next stage in the
          sidebar to see which branch was taken.
        </p>
      </section>
    </div>
  );
}
