import { useMemo, useState } from "react";
import type { DialogueStep, WorkSpecDraft } from "@workspace/api-zod";
import { useRiley } from "@/hooks/use-riley";

const promptAnchors = [
  "What are you trying to build?",
  "Where is it unclear?",
  "What constraint keeps making this harder than it should be?",
];

const draftFields: Array<{ key: keyof WorkSpecDraft; label: string }> = [
  { key: "goal", label: "Goal" },
  { key: "problem", label: "Problem" },
  { key: "actors", label: "Actors" },
  { key: "system_components", label: "System components" },
  { key: "constraints", label: "Constraints" },
  { key: "ambiguities", label: "Open ambiguities" },
  { key: "decisions", label: "Locked decisions" },
];

type RileyWorkspaceState = {
  draft: WorkSpecDraft;
  error: string | null;
  fitLabel: string;
  history: DialogueStep[];
  input: string;
  isPending: boolean;
  onAnchorClick: (anchor: string) => Promise<void>;
  onInputChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => Promise<void>;
  updatedFields: string[];
};

function FieldBlock({
  active,
  label,
  value,
}: {
  active: boolean;
  label: string;
  value: string | string[];
}) {
  const hasValue = Array.isArray(value) ? value.length > 0 : Boolean(value);

  return (
    <div
      className={`rounded-3xl border p-4 transition-all duration-300 ${
        active ? "border-primary bg-primary/10 shadow-[0_0_0_1px_rgba(255,200,84,0.35)]" : "border-border bg-card"
      }`}
    >
      <div className="mb-2 flex items-center justify-between gap-4">
        <h3 className="text-xs uppercase tracking-[0.28em] text-muted-foreground">{label}</h3>
        <span className={`text-[10px] uppercase tracking-[0.24em] ${hasValue ? "text-primary" : "text-muted-foreground/60"}`}>
          {hasValue ? "locked" : "open"}
        </span>
      </div>
      {Array.isArray(value) ? (
        value.length > 0 ? (
          <ul className="space-y-2 text-sm leading-6 text-foreground">
            {value.map((item) => (
              <li key={item} className="rounded-2xl border border-border/60 bg-background px-3 py-2">
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Not structured yet.</p>
        )
      ) : hasValue ? (
        <p className="text-sm leading-6 text-foreground">{value}</p>
      ) : (
        <p className="text-sm text-muted-foreground">Not structured yet.</p>
      )}
    </div>
  );
}

function useRileyWorkspace(): RileyWorkspaceState {
  const { draft, error, fit, history, isPending, submit, updatedFields } = useRiley();
  const [input, setInput] = useState("");
  const fitLabel = useMemo(() => {
    if (fit === "qualified") return "Qualified";
    if (fit === "not-a-fit") return "Not a fit";
    return "Still structuring";
  }, [fit]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const next = input;
    setInput("");
    await submit(next);
  };

  return {
    draft,
    error,
    fitLabel,
    history,
    input,
    isPending,
    onAnchorClick: submit,
    onInputChange: setInput,
    onSubmit,
    updatedFields,
  };
}

function RileyConversation({
  error,
  fitLabel,
  history,
  input,
  isPending,
  onAnchorClick,
  onInputChange,
  onSubmit,
}: Omit<RileyWorkspaceState, "draft" | "updatedFields">) {
  return (
    <section className="rounded-[2rem] border border-border bg-card/80 p-4 shadow-[0_24px_120px_rgba(0,0,0,0.35)] backdrop-blur md:p-6 xl:p-8">
      <div className="mb-5 flex flex-col gap-3 border-b border-border pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-primary">Riley Interface</p>
          <h2 className="mt-2 max-w-2xl text-2xl font-serif text-foreground md:text-3xl">
            Enter the system. Speak plainly. Riley turns ambiguity into structure.
          </h2>
        </div>
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-muted-foreground">
          <span className="rounded-full border border-border px-3 py-2">{fitLabel}</span>
          <span className="rounded-full border border-border px-3 py-2">WorkSpec live</span>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-border bg-background p-4 md:p-5">
        <div className="mb-4 flex flex-wrap gap-2">
          {promptAnchors.map((anchor) => (
            <button
              key={anchor}
              type="button"
              onClick={() => onAnchorClick(anchor)}
              className="rounded-full border border-border px-3 py-2 text-left text-xs text-muted-foreground transition hover:border-primary hover:text-foreground"
            >
              {anchor}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {history.map((step) => (
            <div
              key={step.id}
              className={`max-w-3xl rounded-3xl border px-4 py-3 ${
                step.role === "riley"
                  ? "border-border bg-card text-foreground"
                  : "ml-auto border-primary/40 bg-primary/10 text-foreground"
              }`}
            >
              <p className="mb-2 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                {step.role === "riley" ? "Riley" : "Input"}
              </p>
              <p className="text-sm leading-7">{step.content}</p>
            </div>
          ))}

          {isPending && (
            <div className="rounded-3xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
              Riley is structuring the problem.
            </div>
          )}
        </div>

        <form onSubmit={onSubmit} className="mt-5 border-t border-border pt-5">
          <label htmlFor="riley-input" className="mb-2 block text-xs uppercase tracking-[0.26em] text-muted-foreground">
            State the system as it exists now.
          </label>
          <textarea
            id="riley-input"
            rows={4}
            value={input}
            onChange={(event) => onInputChange(event.target.value)}
            placeholder="Messy is fine. Abstraction is not."
            className="w-full rounded-[1.5rem] border border-border bg-card px-4 py-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary"
          />
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Riley will either reduce ambiguity or increase pressure on what is still unresolved.
            </p>
            <button
              type="submit"
              disabled={isPending || !input.trim()}
              className="inline-flex items-center justify-center rounded-full border border-primary bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Enter the system
            </button>
          </div>
          {error && <p className="mt-3 text-xs text-muted-foreground">Live API unavailable. Riley is using the local structural fallback.</p>}
        </form>
      </div>
    </section>
  );
}

function WorkSpecPanel({ draft, updatedFields }: Pick<RileyWorkspaceState, "draft" | "updatedFields">) {
  return (
    <section className="rounded-[2rem] border border-border bg-card/80 p-4 shadow-[0_24px_120px_rgba(0,0,0,0.25)] backdrop-blur md:p-6 xl:p-8">
      <div className="rounded-[1.75rem] border border-primary/20 bg-primary/5 p-4 md:p-5">
        <p className="text-xs uppercase tracking-[0.32em] text-primary">WorkSpec</p>
        <h3 className="mt-2 text-xl font-serif text-foreground">The conversation becomes the spec.</h3>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          WorkSpec is what Riley is building underneath the interaction. It locks goals, constraints, ambiguities, and decisions into a usable system model.
        </p>
      </div>

      <div className="mt-4 grid gap-4">
        {draftFields.map((field) => (
          <FieldBlock
            key={field.key}
            active={updatedFields.includes(field.key)}
            label={field.label}
            value={draft[field.key] as string | string[]}
          />
        ))}
      </div>

      <div className={`mt-4 rounded-3xl border p-4 ${updatedFields.includes("qualification_signals") ? "border-primary bg-primary/10" : "border-border bg-card"}`}>
        <h3 className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Qualification signals</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {Object.entries(draft.qualification_signals).map(([key, value]) => (
            <div key={key} className="rounded-2xl border border-border/60 bg-background px-3 py-3">
              <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{key.replaceAll("_", " ")}</p>
              <p className="mt-2 text-sm text-foreground">{value}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm leading-7 text-foreground">{draft.recommended_next_step}</p>
      </div>
    </section>
  );
}

export function RileyWorkspace() {
  const state = useRileyWorkspace();

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <RileyConversation
        error={state.error}
        fitLabel={state.fitLabel}
        history={state.history}
        input={state.input}
        isPending={state.isPending}
        onAnchorClick={state.onAnchorClick}
        onInputChange={state.onInputChange}
        onSubmit={state.onSubmit}
      />
      <WorkSpecPanel draft={state.draft} updatedFields={state.updatedFields} />
    </div>
  );
}

export { RileyConversation, WorkSpecPanel, useRileyWorkspace };
