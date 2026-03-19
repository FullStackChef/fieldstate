import { useEffect } from "react";
import { Reveal } from "@/components/layout/Reveal";
import { builders } from "@/data/content";

export default function Builders() {
  useEffect(() => {
    document.title = "Builders | FieldState";
  }, []);

  return (
    <div className="pt-32 pb-24 max-w-6xl mx-auto px-6">
      <Reveal>
        <h1 className="text-5xl font-serif mb-8 text-foreground text-center">The Builders</h1>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-24">
          The forces operating within FieldState. A convergence of distinct disciplines yielding unified systems.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {builders.map((builder, idx) => (
          <Reveal key={builder.id} delay={0.2 * idx}>
            <div className="bg-card border border-border p-8 h-full hover:border-primary/50 transition-colors group">
              <div className="text-4xl text-primary mb-8 font-mono opacity-50 group-hover:opacity-100 transition-opacity">
                {builder.glyph}
              </div>
              <h2 className="text-2xl font-serif text-foreground mb-2">{builder.name}</h2>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-6 border-b border-border pb-4">
                {builder.role}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {builder.description}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
