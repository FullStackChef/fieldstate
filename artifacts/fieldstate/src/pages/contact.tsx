import { useEffect, useState } from "react";
import { Reveal } from "@/components/layout/Reveal";
import { Button } from "@/components/ui/Button";
import { useSubmitLead } from "@/hooks/use-leads";

export default function Contact() {
  const { submit, isPending, isSuccess, error } = useSubmitLead();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    inquiryType: "general",
    message: "",
    honeypot: ""
  });

  useEffect(() => {
    document.title = "Contact | FieldState";
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit({
      source: 'contact',
      ...formData,
      route: '/contact'
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="pt-32 pb-24 max-w-3xl mx-auto px-6">
      <Reveal>
        <h1 className="text-5xl font-serif mb-4 text-foreground">Contact</h1>
        <p className="text-muted-foreground mb-16">
          Establish a direct channel. Standard response latency is 48 hours.
        </p>
      </Reveal>

      <Reveal delay={0.2}>
        {isSuccess ? (
          <div className="border border-primary/50 bg-primary/5 p-8 text-center">
            <h3 className="text-2xl font-serif text-primary mb-4">Transmission Successful</h3>
            <p className="text-muted-foreground">Your coordinates have been logged. We will initiate contact shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Honeypot */}
            <input 
              type="text" 
              name="honeypot" 
              value={formData.honeypot} 
              onChange={handleChange} 
              className="hidden" 
              tabIndex={-1} 
              autoComplete="off" 
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-muted-foreground block">Designation</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-secondary border border-border px-4 py-3 focus:outline-none focus:border-primary text-foreground"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-muted-foreground block">Email Vector *</label>
                <input 
                  type="email" 
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-secondary border border-border px-4 py-3 focus:outline-none focus:border-primary text-foreground"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-muted-foreground block">Intent Classification</label>
              <select 
                name="inquiryType"
                value={formData.inquiryType}
                onChange={handleChange}
                className="w-full bg-secondary border border-border px-4 py-3 focus:outline-none focus:border-primary text-foreground appearance-none"
              >
                <option value="general">General Inquiry</option>
                <option value="project">Project Commission</option>
                <option value="media">Media / Press</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-muted-foreground block">Transmission Body *</label>
              <textarea 
                name="message"
                required
                rows={6}
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-secondary border border-border px-4 py-3 focus:outline-none focus:border-primary text-foreground resize-none"
              />
            </div>

            {error && <p className="text-destructive text-sm">{error}</p>}

            <Button type="submit" size="lg" disabled={isPending} className="w-full">
              {isPending ? "Transmitting..." : "Initialize Channel"}
            </Button>
          </form>
        )}
      </Reveal>
    </div>
  );
}
