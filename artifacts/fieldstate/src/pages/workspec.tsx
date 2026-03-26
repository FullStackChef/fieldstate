import { workspecCapabilities } from "@/data/content";
import { usePageMeta } from "@/hooks/use-page-meta";

export default function WorkSpec() {
  usePageMeta(
    "WorkSpec | Fieldstate",
    "WorkSpec is the upstream clarity engine Riley builds underneath the conversation.",
  );

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 pt-28 sm:px-6 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-[0.55fr_0.45fr] lg:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-primary">WorkSpec</p>
          <h1 className="mt-3 text-5xl font-serif leading-tight text-foreground">The upstream clarity engine.</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-foreground/90">
            WorkSpec is what Riley is building underneath the conversation. It turns dialogue into structure, ambiguity into decisions, and thinking into architecture.
          </p>
        </div>
        <div className="rounded-[1.75rem] border border-border bg-card p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-primary">Core line</p>
          <p className="mt-3 text-2xl font-serif text-foreground">Without structure, AI accelerates chaos. With structure, it accelerates delivery.</p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-[1.75rem] border border-border bg-card p-6">
          <p className="text-xs uppercase tracking-[0.28em] text-primary">Riley and WorkSpec</p>
          <p className="mt-4 text-lg leading-8 text-foreground">
            Riley is the interface. WorkSpec is the system. The conversation becomes the spec.
          </p>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            Instead of collecting a brief and hoping it survives, WorkSpec forms in public. Goals, actors, constraints, and ambiguities are visible while the system is being defined.
          </p>
        </article>
        <article className="rounded-[1.75rem] border border-border bg-card p-6">
          <p className="text-xs uppercase tracking-[0.28em] text-primary">Philosophy</p>
          <ul className="mt-4 space-y-4 text-sm leading-7 text-foreground">
            <li>Structure before sprint.</li>
            <li>Specs should live.</li>
            <li>Traceability creates trust.</li>
            <li>LLMs need architecture more than they need enthusiasm.</li>
          </ul>
        </article>
      </section>

      <section className="rounded-[1.75rem] border border-border bg-card p-6">
        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-primary">Capabilities</p>
            <h2 className="mt-3 text-3xl font-serif text-foreground">WorkSpec constrains the build before the build runs away.</h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-muted-foreground">
            Code generation is not the hard part anymore. The hard part is making sure the generated system still reflects what matters.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {workspecCapabilities.map((item) => (
            <div key={item} className="rounded-3xl border border-border/70 bg-background p-4 text-sm leading-7 text-foreground">
              {item}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
