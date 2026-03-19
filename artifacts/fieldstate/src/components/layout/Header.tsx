import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useStore } from "@/store";
import { navigation } from "@/data/content";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const { navState, setNavState, ceremonialMode, toggleCeremonial } = useStore();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileNav = () => {
    setNavState(navState === 'mobile-open' ? 'mobile-closed' : 'mobile-open');
  };

  return (
    <>
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-500 border-b border-transparent",
          scrolled ? "glass-panel py-4 border-border/50" : "bg-transparent py-6"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl tracking-widest text-foreground hover:text-primary transition-colors">
            FIELDSTATE
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link 
                key={item.path} 
                href={item.path}
                className={cn(
                  "text-sm uppercase tracking-widest transition-colors duration-300",
                  location === item.path 
                    ? "text-primary border-b border-primary pb-1" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
            
            <button 
              onClick={toggleCeremonial}
              className="w-4 h-4 rounded-full border border-muted-foreground hover:border-primary transition-colors flex items-center justify-center relative group"
              aria-label="Toggle Ceremonial Mode"
            >
              {ceremonialMode && <span className="w-2 h-2 bg-primary rounded-full absolute" />}
            </button>
          </nav>

          {/* Mobile Nav Toggle */}
          <button 
            className="md:hidden text-foreground p-2"
            onClick={toggleMobileNav}
          >
            {navState === 'mobile-open' ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {navState === 'mobile-open' && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-30 bg-background/95 backdrop-blur-xl pt-24 px-6 flex flex-col"
          >
            <nav className="flex flex-col space-y-6 mt-12">
              {navigation.map((item) => (
                <Link 
                  key={item.path} 
                  href={item.path}
                  onClick={() => setNavState('mobile-closed')}
                  className={cn(
                    "text-3xl font-serif tracking-widest",
                    location === item.path ? "text-primary" : "text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              
              <div className="pt-8 flex items-center space-x-4">
                <span className="text-sm uppercase tracking-widest text-muted-foreground">Ceremonial Mode</span>
                <button 
                  onClick={toggleCeremonial}
                  className="w-6 h-6 rounded-full border border-muted-foreground flex items-center justify-center relative"
                >
                  {ceremonialMode && <span className="w-3 h-3 bg-primary rounded-full absolute" />}
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
