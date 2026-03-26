import { systemLayers } from "@/data/content";
import { usePageMeta } from "@/hooks/use-page-meta";

export default function Systems() {
  usePageMeta(
    "Systems | Fieldstate",
    "Fieldstate defines systems across domains. Riley and WorkSpec are the front door into that upstream structure.",
  );

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 pt-28 sm:px-6 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-[0.6fr_0.4fr] lg:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-primary">Systems</p>
          <h1 className="mt-3 text-5xl font-serif leading-tight text-foreground">
            You are already touching the system layers the moment Riley starts structuring the problem.
          </h1>
        </div>
        <div className="rounded-[1.75rem] border border-border bg-card p-6 text-sm leading-7 text-muted-foreground">
          Fieldstate builds systems that sit above products. Riley exposes the interface. WorkSpec captures the structure. The rest of the architecture decides how that structure holds across meaning, people, and money.
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {systemLayers.map((layer) => (
          <article key={layer.name} className="rounded-[1.75rem] border border-border bg-card p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-primary">{layer.name}</p>
            <h2 className="mt-3 text-2xl font-serif text-foreground">{layer.line}</h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">{layer.description}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-[1.75rem] border border-border bg-card p-6">
          <p className="text-xs uppercase tracking-[0.28em] text-primary">Boundary</p>
          <h2 className="mt-3 text-3xl font-serif text-foreground">Fieldstate defines systems across domains.</h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            Some systems are built and operated elsewhere. Fieldstate&apos;s role is upstream — bringing clarity, structure, and architecture before anything is built.
          </p>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            That includes complex domains like health, where poor system definition has real consequences.
          </p>
        </article>

        <article className="rounded-[1.75rem] border border-border bg-card p-6">
          <p className="text-xs uppercase tracking-[0.28em] text-primary">Health</p>
          <h2 className="mt-3 text-3xl font-serif text-foreground">High-stakes domains still demand upstream clarity.</h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            Fieldstate is often involved in the planning and architectural definition of health systems, where clarity, safety, and structure are critical.
          </p>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            Execution and operation may sit outside Fieldstate. The definition does not.
          </p>
        </article>
      </section>
    </div>
  );
}
