import { useEffect, useState } from "react";
import { Reveal } from "@/components/layout/Reveal";
import { filterStatements } from "@/data/content";
import { Button } from "@/components/ui/Button";
import { useSubmitLead } from "@/hooks/use-leads";

export default function NotForClients() {
  const { submit, isPending, isSuccess, error } = useSubmitLead();
  const [formData, setFormData] = useState({ email: "", message: "", honeypot: "" });

  useEffect(() => {
    document.title = "Not For Clients | FieldState";
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit({
      source: 'not-for-clients',
      ...formData,
      route: '/not-for-clients'
    });
  };

  return (
    <div className="pt-32 pb-24 max-w-4xl mx-auto px-6">
      <Reveal>
        <h1 className="text-5xl font-serif mb-16 text-foreground text-center">Anti-Portfolio</h1>
      </Reveal>

      <div className="mb-24 space-y-4">
        {filterStatements.map((stmt, idx) => (
          <Reveal key={idx} delay={0.1 * idx}>
            <div className="text-2xl md:text-4xl font-serif text-muted-foreground hover:text-destructive transition-colors text-center">
              {stmt}
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.5}>
        <div className="bg-card border border-border p-8 md:p-12 max-w-2xl mx-auto">
          <h3 className="text-xl font-serif text-foreground mb-6 text-center">Still here? State your case.</h3>
          
          {isSuccess ? (
            <p className="text-primary text-center">Anomaly logged. We will review your deviation.</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <input type="text" className="hidden" name="honeypot" value={formData.honeypot} onChange={e => setFormData(p => ({...p, honeypot: e.target.value}))} />
              
              <div>
                <input 
                  type="email" 
                  required
                  placeholder="Email"
                  value={formData.email}
                  onChange={e => setFormData(p => ({...p, email: e.target.value}))}
                  className="w-full bg-secondary border border-border px-4 py-3 focus:outline-none focus:border-primary text-foreground text-center"
                />
              </div>
              <div>
                <textarea 
                  required
                  placeholder="What are you building that defies these filters?"
                  rows={4}
                  value={formData.message}
                  onChange={e => setFormData(p => ({...p, message: e.target.value}))}
                  className="w-full bg-secondary border border-border px-4 py-3 focus:outline-none focus:border-primary text-foreground text-center resize-none"
                />
              </div>
              {error && <p className="text-destructive text-sm text-center">{error}</p>}
              <Button type="submit" variant="outline" className="w-full" disabled={isPending}>
                {isPending ? "..." : "Submit Deviation"}
              </Button>
            </form>
          )}
        </div>
      </Reveal>
    </div>
  );
}
