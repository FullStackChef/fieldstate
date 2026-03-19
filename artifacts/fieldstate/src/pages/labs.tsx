import { useEffect, useState } from "react";
import { Reveal } from "@/components/layout/Reveal";
import { labProjects } from "@/data/content";
import { Button } from "@/components/ui/button";
import { useSubmitLead } from "@/hooks/use-leads";
import { usePageMeta } from "@/hooks/use-page-meta";

export default function Labs() {
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const { submit, isPending, isSuccess, error, reset } = useSubmitLead();

  usePageMeta("Labs | FieldState", "Experimental protocols and unstable artifacts from FieldState. Join waitlists for active lab projects.");

  const handleWaitlistSubmit = (e: React.FormEvent, projectId: string) => {
    e.preventDefault();
    if (!email) return;
    submit({
      source: 'labs-waitlist',
      email,
      message: `Waitlist request for project: ${projectId}`,
      route: '/labs',
      honeypot: ""
    });
  };

  return (
    <div className="pt-32 pb-24 max-w-6xl mx-auto px-6">
      <Reveal>
        <h1 className="text-5xl font-serif mb-4 text-foreground">Labs</h1>
        <p className="text-muted-foreground mb-16 max-w-xl">
          Experimental protocols and unstable artifacts. Access is highly restricted. Join waitlists for active iterations.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24">
        {labProjects.map((project, idx) => (
          <Reveal key={project.id} delay={0.1 * idx}>
            <div className="bg-card border border-border p-8 h-full flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-serif text-foreground">{project.name}</h3>
                <span className={`text-xs uppercase tracking-widest px-2 py-1 border ${
                  project.status === 'active' ? 'text-primary border-primary/50' :
                  project.status === 'paused' ? 'text-orange-500 border-orange-500/50' :
                  'text-muted-foreground border-border'
                }`}>
                  {project.status}
                </span>
              </div>
              <p className="text-muted-foreground mb-8 flex-1">
                {project.description}
              </p>
              
              {project.status === 'active' && (
                <div className="mt-auto">
                  {activeProject === project.id ? (
                    <form onSubmit={(e) => handleWaitlistSubmit(e, project.id)} className="flex space-x-2">
                      {/* Honeypot */}
                      <input type="text" name="website" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" aria-hidden="true" readOnly />
                      <input 
                        type="email" 
                        placeholder="Enter email..." 
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="bg-secondary border border-border px-4 py-2 flex-1 text-sm focus:outline-none focus:border-primary"
                      />
                      <Button type="submit" size="sm" disabled={isPending}>
                        {isPending ? '...' : 'Join'}
                      </Button>
                    </form>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => setActiveProject(project.id)}>
                      Request Access
                    </Button>
                  )}
                  {activeProject === project.id && isSuccess && <p className="text-green-500 text-xs mt-2">Recorded.</p>}
                  {activeProject === project.id && error && <p className="text-destructive text-xs mt-2">{error}</p>}
                </div>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
