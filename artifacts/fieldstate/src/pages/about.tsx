import { Reveal } from "@/components/layout/Reveal";
import { usePageMeta } from "@/hooks/use-page-meta";

export default function About() {
  usePageMeta("About | FieldState", "Understand what FieldState is, how we operate, the forces behind our work, and the technology stack we build on.");

  return (
    <div className="pt-32 pb-24 max-w-4xl mx-auto px-6">
      <Reveal>
        <h1 className="text-5xl font-serif mb-16 text-foreground">About the System</h1>
      </Reveal>

      <div className="space-y-24">
        <Reveal delay={0.2}>
          <section>
            <h2 className="text-xs uppercase tracking-widest text-primary mb-6 border-b border-border pb-2">The Entity</h2>
            <div className="text-xl font-serif leading-relaxed text-foreground">
              <p className="mb-6">
                FieldState operates as a bounded environment for high-leverage conceptual engineering. We are not an agency in the traditional sense; we are a protocol for manifesting digital entities with actual gravity.
              </p>
              <p>
                Our thesis is simple: Most software is built to be ignored. We build software meant to be felt.
              </p>
            </div>
          </section>
        </Reveal>

        <Reveal delay={0.3}>
          <section>
            <h2 className="text-xs uppercase tracking-widest text-primary mb-6 border-b border-border pb-2">The Stack</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 text-muted-foreground">
              <li>Typescript / Absolute typed safety</li>
              <li>React / Component logic</li>
              <li>Zustand / State propagation</li>
              <li>Framer / Kinematic motion</li>
              <li>PostgreSQL / Deep memory</li>
              <li>Express / Routing layer</li>
            </ul>
          </section>
        </Reveal>
      </div>
    </div>
  );
}
