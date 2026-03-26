import { Switch, Route, Router as WouterRouter } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

import Home from "@/pages/home";
import WorkSpec from "@/pages/workspec";
import Systems from "@/pages/systems";
import Proof from "@/pages/proof";
import NotFound from "@/pages/not-found";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pb-20">{children}</main>
      <Footer />
    </div>
  );
}

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/workspec" component={WorkSpec} />
        <Route path="/systems" component={Systems} />
        <Route path="/proof" component={Proof} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

export default function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Router />
    </WouterRouter>
  );
}
