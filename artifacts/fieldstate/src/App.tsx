import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { useStore } from "@/store";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { SummonPanel } from "@/components/summon/SummonPanel";

// Pages
import Home from "@/pages/home";
import Mythos from "@/pages/mythos";
import Builders from "@/pages/builders";
import Forge from "@/pages/forge";
import SparksAndLore from "@/pages/sparks-and-lore";
import About from "@/pages/about";
import Labs from "@/pages/labs";
import WorkSpec from "@/pages/workspec";
import Contact from "@/pages/contact";
import NotForClients from "@/pages/not-for-clients";
import SummonPage from "@/pages/summon-page";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Layout({ children }: { children: React.ReactNode }) {
  const setSummonState = useStore(state => state.setSummonState);
  
  return (
    <div className="min-h-screen flex flex-col">
      <CustomCursor />
      <Header />
      <main className="flex-grow z-10 relative">
        {children}
      </main>
      <Footer />
      <SummonPanel />
      
      {/* Floating Summon Trigger */}
      <button 
        onClick={() => setSummonState('open')}
        className="fixed bottom-8 right-8 z-40 bg-primary text-primary-foreground font-serif tracking-widest text-xs uppercase px-4 py-3 rounded-full shadow-2xl hover:scale-105 transition-transform"
      >
        Summon
      </button>
    </div>
  );
}

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/mythos" component={Mythos} />
        <Route path="/builders" component={Builders} />
        <Route path="/forge" component={Forge} />
        <Route path="/sparks-and-lore" component={SparksAndLore} />
        <Route path="/about" component={About} />
        <Route path="/labs" component={Labs} />
        <Route path="/workspec" component={WorkSpec} />
        <Route path="/contact" component={Contact} />
        <Route path="/not-for-clients" component={NotForClients} />
        <Route path="/summon" component={SummonPage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  const initCeremonial = useStore(state => state.initCeremonial);

  useEffect(() => {
    initCeremonial();
  }, [initCeremonial]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
