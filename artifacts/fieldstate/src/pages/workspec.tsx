import { useEffect } from "react";
import { Reveal } from "@/components/layout/Reveal";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/store";

export default function WorkSpec() {
  const setSummonState = useStore(state => state.setSummonState);

  useEffect(() => {
    document.title = "WorkSpec | FieldState";
  }, []);

  return (
    <div className="pt-32 pb-24 max-w-4xl mx-auto px-6">
      <Reveal>
        <h1 className="text-5xl font-serif mb-8 text-foreground">WorkSpec Framework</h1>
        <div className="h-px w-full bg-primary/30 mb-16" />
      </Reveal>

      <div className="space-y-12">
        <Reveal delay={0.2}>
          <h2 className="text-2xl font-serif text-primary mb-4">The Flagship System</h2>
          <p className="text-muted-foreground leading-relaxed">
            WorkSpec is not a product; it is a rigid framework for executing high-stakes creative labor. It standardizes the unstandardizable. It provides a common syntax for disparate disciplines to converge on a single objective.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16">
          <Reveal delay={0.3}>
            <div className="border border-border p-6">
              <h3 className="text-sm uppercase tracking-widest text-foreground mb-4">Syntax Definition</h3>
              <p className="text-sm text-muted-foreground">Establishes the absolute terminology for the project phase, eliminating semantic ambiguity.</p>
            </div>
          </Reveal>
          <Reveal delay={0.4}>
            <div className="border border-border p-6">
              <h3 className="text-sm uppercase tracking-widest text-foreground mb-4">State Boundaries</h3>
              <p className="text-sm text-muted-foreground">Defines exactly what is in scope, mathematically derived from the initial intent.</p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.5}>
          <div className="bg-secondary p-12 text-center border border-border mt-24">
            <h2 className="text-3xl font-serif mb-6 text-foreground">Initiate Integration</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              WorkSpec is deployed exclusively for clients operating at the bleeding edge of their respective domains.
            </p>
            <Button size="lg" onClick={() => setSummonState('open')}>
              Summon WorkSpec Lead
            </Button>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
