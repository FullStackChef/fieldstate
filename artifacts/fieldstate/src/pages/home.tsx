import { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "@/components/layout/Reveal";
import { Button } from "@/components/ui/Button";
import { statements } from "@/data/content";

export default function Home() {
  const [statementIndex, setStatementIndex] = useState(0);

  useEffect(() => {
    document.title = "FieldState | Narrative Architecture";
    
    const interval = setInterval(() => {
      setStatementIndex((prev) => (prev + 1) % statements.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen pt-32">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex flex-col items-center justify-center text-center px-4 noise-bg">
        {/* Abstract Background Image using generated image */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
           <img 
             src={`${import.meta.env.BASE_URL}images/hero-abstract.png`} 
             alt="Atmospheric texture" 
             className="w-full h-full object-cover"
           />
        </div>

        <div className="z-10 w-full max-w-4xl mx-auto">
          <Reveal>
            <h2 className="text-primary tracking-widest uppercase text-sm mb-6">State 001</h2>
          </Reveal>
          
          <div className="h-32 sm:h-40 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.h1
                key={statementIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl sm:text-5xl md:text-7xl font-serif text-foreground text-balance"
              >
                {statements[statementIndex]}
              </motion.h1>
            </AnimatePresence>
          </div>

          <Reveal delay={0.4} className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/mythos">
              <Button size="lg" className="w-full sm:w-auto">Enter the Mythos</Button>
            </Link>
            <Link href="/forge">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">See the Forge</Button>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Principles Section */}
      <section className="py-32 px-6 lg:px-12 max-w-7xl mx-auto border-t border-border mt-12">
        <Reveal>
          <h2 className="text-3xl font-serif mb-16 text-center">Core Principles</h2>
        </Reveal>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { num: "01", title: "Narrative Supremacy", desc: "Every interface tells a story. We ensure it's the right one." },
            { num: "02", title: "Intentional Friction", desc: "Speed is a tool, not a religion. Sometimes slowing down is the feature." },
            { num: "03", title: "Absolute Purity", desc: "Removing the extraneous until only the essential remains." }
          ].map((principle, idx) => (
            <Reveal key={idx} delay={0.2 * idx}>
              <div className="flex flex-col space-y-4">
                <span className="text-primary font-mono text-sm">{principle.num}</span>
                <h3 className="text-xl font-serif">{principle.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{principle.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
