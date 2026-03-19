import { useEffect } from "react";
import { useStore } from "@/store";
import { SummonPanel } from "@/components/summon/SummonPanel";
import { Reveal } from "@/components/layout/Reveal";
import { Button } from "@/components/ui/Button";

// This page renders the UI explanation of Summon and automatically opens the panel, 
// or provides a manual trigger if they closed it.
export default function SummonPage() {
  const { setSummonState, summonState } = useStore();

  useEffect(() => {
    document.title = "Summon | FieldState";
    // Auto-open on mount if closed
    if (summonState === 'closed') {
      setTimeout(() => setSummonState('open'), 500);
    }
  }, [summonState, setSummonState]);

  return (
    <div className="pt-32 pb-24 max-w-4xl mx-auto px-6 text-center min-h-[70vh] flex flex-col items-center justify-center">
      <Reveal>
        <h1 className="text-5xl font-serif mb-6 text-primary animate-pulse">Summoning Sequence Active</h1>
        <p className="text-muted-foreground max-w-md mx-auto mb-12">
          The panel should have materialized. If you aborted the sequence, you may re-initiate it below.
        </p>
        <Button size="lg" onClick={() => setSummonState('open')}>
          Re-Initiate Sequence
        </Button>
      </Reveal>
    </div>
  );
}
