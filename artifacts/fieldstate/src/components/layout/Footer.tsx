import { Link } from "wouter";
import { navigation } from "@/data/content";

export function Footer() {
  return (
    <footer className="border-t border-border mt-32 py-16 bg-card">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="font-serif text-3xl tracking-widest text-foreground block mb-4">
            FIELDSTATE
          </Link>
          <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
            A narrative-driven creative agency specializing in systems of deep resonance and deliberate pacing.
          </p>
        </div>
        
        <div>
          <h4 className="text-xs uppercase tracking-widest text-foreground mb-6 border-b border-border pb-2">Index</h4>
          <ul className="space-y-3">
            {navigation.slice(0, 4).map(item => (
              <li key={item.path}>
                <Link href={item.path} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="text-xs uppercase tracking-widest text-foreground mb-6 border-b border-border pb-2">Connect</h4>
          <ul className="space-y-3">
             <li>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/not-for-clients" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Not For Clients
              </Link>
            </li>
            <li>
              <Link href="/summon" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Summon
              </Link>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} FieldState. All rights reserved.</p>
        <p className="mt-2 md:mt-0 uppercase tracking-widest">State 001</p>
      </div>
    </footer>
  );
}
