import { useState } from "react";
import { Link, useLocation } from "wouter";
import { navigation } from "@/data/content";
import { cn } from "@/lib/utils";

export function Header() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <Link href="/" className="text-lg font-semibold tracking-[0.32em] text-foreground transition hover:text-primary">
            FIELDSTATE
          </Link>
          <p className="mt-1 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Clarity before code.</p>
        </div>

        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="rounded-full border border-border px-3 py-2 text-xs uppercase tracking-[0.22em] text-muted-foreground md:hidden"
        >
          Menu
        </button>

        <nav className="hidden items-center gap-3 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "rounded-full border px-4 py-2 text-xs uppercase tracking-[0.24em] transition",
                location === item.path
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border text-muted-foreground hover:border-primary hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {open && (
        <nav className="border-t border-border px-4 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            {navigation.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-2xl border px-4 py-3 text-xs uppercase tracking-[0.24em] transition",
                  location === item.path
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border text-muted-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
