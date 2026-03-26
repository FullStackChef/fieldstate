import { proofCases } from "@/data/content";
import { usePageMeta } from "@/hooks/use-page-meta";

export default function Proof() {
  usePageMeta(
    "Proof | Fieldstate",
    "Proof that Fieldstate turns ambiguity into structure and makes AI-assisted delivery reliable.",
  );

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 pt-28 sm:px-6 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-[0.58fr_0.42fr] lg:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-primary">Work / Proof</p>
          <h1 className="mt-3 text-5xl font-serif leading-tight text-foreground">Proof should show structure, not theatre.</h1>
        </div>
        <div className="rounded-[1.75rem] border border-border bg-card p-6 text-sm leading-7 text-muted-foreground">
          Every proof block here is a system, an intervention, and a structural result. If the work did not clarify ambiguity, impose constraints, or create traceability, it is not evidence.
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {proofCases.map((item) => (
          <article key={item.system} className="rounded-[1.75rem] border border-border bg-card p-6">
            <p className="text-[10px] uppercase tracking-[0.24em] text-primary">{item.emphasis}</p>
            <p className="mt-4 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">System</p>
            <h2 className="mt-2 text-2xl font-serif text-foreground">{item.system}</h2>
            <p className="mt-5 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Intervention</p>
            <p className="mt-2 text-sm leading-7 text-foreground">{item.intervention}</p>
            <p className="mt-5 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Result</p>
            <p className="mt-2 text-sm leading-7 text-foreground">{item.result}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
