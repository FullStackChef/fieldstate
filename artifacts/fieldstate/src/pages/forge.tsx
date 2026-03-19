import { useEffect, useState } from "react";
import { Reveal } from "@/components/layout/Reveal";
import { artifacts } from "@/data/content";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

export default function Forge() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    document.title = "The Forge | FieldState";
  }, []);

  return (
    <div className="pt-32 pb-24 max-w-5xl mx-auto px-6 relative">
      {/* Background element */}
      <div className="fixed right-0 top-0 w-1/3 h-screen opacity-10 pointer-events-none z-[-1] mask-image-linear-left">
        <img 
          src={`${import.meta.env.BASE_URL}images/forge-bg.png`} 
          alt="Forge atmosphere" 
          className="w-full h-full object-cover mix-blend-screen"
        />
      </div>

      <Reveal>
        <h1 className="text-5xl font-serif mb-4 text-foreground">The Forge</h1>
        <p className="text-muted-foreground max-w-xl mb-16">
          Artifacts currently maintained, deployed, or under construction within the FieldState infrastructure.
        </p>
      </Reveal>

      <div className="space-y-4">
        {artifacts.map((artifact, idx) => {
          const isExpanded = expandedId === artifact.id;
          
          return (
            <Reveal key={artifact.id} delay={0.1 * idx}>
              <div 
                className={`border transition-colors duration-300 bg-card ${
                  isExpanded ? 'border-primary' : 'border-border hover:border-muted-foreground'
                }`}
              >
                <button 
                  onClick={() => setExpandedId(isExpanded ? null : artifact.id)}
                  className="w-full p-6 flex items-center justify-between focus:outline-none"
                >
                  <div className="flex items-center space-x-6">
                    <span className="text-2xl font-serif text-primary opacity-70 w-8 text-center">
                      {artifact.icon}
                    </span>
                    <h2 className="text-xl font-serif text-foreground">{artifact.name}</h2>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <span className={`text-xs uppercase tracking-widest px-2 py-1 border ${
                      artifact.status === 'live' ? 'text-green-500 border-green-500/30' :
                      artifact.status === 'building' ? 'text-primary border-primary/30' :
                      'text-muted-foreground border-border'
                    }`}>
                      {artifact.status}
                    </span>
                    <span className="text-muted-foreground">
                      {isExpanded ? <Minus size={16} /> : <Plus size={16} />}
                    </span>
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 border-t border-border/50 mt-2 flex flex-col md:flex-row gap-8">
                        <div className="flex-1">
                          <p className="text-muted-foreground leading-relaxed">
                            {artifact.description}
                          </p>
                        </div>
                        <div className="w-full md:w-48 flex-shrink-0">
                          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Lead Builder</div>
                          <div className="font-serif text-foreground">{artifact.builderRef}</div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
