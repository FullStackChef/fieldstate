import { useEffect } from "react";
import { Reveal } from "@/components/layout/Reveal";

export default function Mythos() {
  useEffect(() => {
    document.title = "Mythos | FieldState";
  }, []);

  return (
    <div className="pt-32 pb-24 max-w-3xl mx-auto px-6">
      <Reveal>
        <h1 className="text-5xl font-serif mb-8 text-foreground">The Mythos</h1>
        <div className="h-px w-full bg-border mb-16" />
      </Reveal>

      <div className="space-y-16 text-lg text-muted-foreground leading-loose font-serif">
        <Reveal delay={0.2}>
          <p className="first-letter:text-6xl first-letter:font-bold first-letter:text-primary first-letter:mr-3 first-letter:float-left">
            We exist at the intersection of utility and ceremony. In an era obsessed with frictionless engagement, we introduce deliberate pacing. The modern web is a landscape of noise; we build structures of profound silence.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="my-12 relative w-full h-64 overflow-hidden border border-border">
            <img 
              src={`${import.meta.env.BASE_URL}images/mythos-bg.png`} 
              alt="Architectural fragment" 
              className="w-full h-full object-cover grayscale opacity-50"
            />
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <h2 className="text-2xl text-foreground mb-6">The Architecture of Intent</h2>
          <p>
            When every tool looks the same, functions the same, and demands the same rapid, mindless interaction, meaning is lost. A tool should require presence. It should ask something of the user before giving something in return.
          </p>
          <p className="mt-6">
            FieldState is not a design agency. We are structural narratologists. We determine the exact sequence of events required to transform a casual observer into a devoted participant.
          </p>
        </Reveal>

        <Reveal delay={0.5}>
          <blockquote className="border-l-2 border-primary pl-6 py-2 my-12 text-2xl text-foreground italic">
            "Friction is not a failure of design; it is the genesis of value."
          </blockquote>
        </Reveal>
      </div>
    </div>
  );
}
