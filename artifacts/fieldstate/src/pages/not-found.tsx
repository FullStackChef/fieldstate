import { Link } from "wouter";
import { usePageMeta } from "@/hooks/use-page-meta";

export default function NotFound() {
  usePageMeta("Fieldstate | Not found", "The route you asked for is outside the current system boundary.");

  return (
    <div className="mx-auto max-w-7xl px-4 pt-28 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-border bg-card p-8 text-center">
      <p className="text-xs uppercase tracking-[0.32em] text-primary">Outside the boundary</p>
      <h1 className="mt-4 text-4xl font-serif text-foreground">That route does not exist in the current system.</h1>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
        Go back to the interface. The useful work starts there.
      </p>
      <Link href="/" className="mt-6 inline-flex rounded-full border border-primary bg-primary px-5 py-3 text-sm font-medium text-primary-foreground">
        Return home
      </Link>
      </div>
    </div>
  );
}
