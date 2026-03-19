import { Link } from "wouter";
import { Reveal } from "@/components/layout/Reveal";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 noise-bg">
      <Reveal>
        <h1 className="text-8xl font-serif text-primary mb-4">404</h1>
        <h2 className="text-2xl font-serif text-foreground mb-8">Void State Reached</h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-12">
          The requested coordinate does not exist within the FieldState architecture. You have drifted out of bounds.
        </p>
        <Link href="/">
          <Button variant="outline">Return to Core</Button>
        </Link>
      </Reveal>
    </div>
  );
}
