import { Send } from "lucide-react";
import { RileyWorkspace } from "@/components/riley/RileyWorkspace";
import { homeProof } from "@/data/content";
import { usePageMeta } from "@/hooks/use-page-meta";

const processSteps = [
  "You talk to Riley.",
  "Riley structures the problem.",
  "WorkSpec begins to form.",
  "Fieldstate engages if the stakes justify it.",
];

export default function Home() {
  usePageMeta(
    "Fieldstate | Structure before code",
    "Fieldstate is an AI-native interface for turning ambiguity into architecture. Riley is the front door. WorkSpec is the structure underneath it.",
  );

  return (
    <div className="pb-10 pt-20">
      <section>
        <div className="relative isolate overflow-hidden py-[62px]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-[-14%] left-1/2 w-screen -translate-x-1/2 bg-[radial-gradient(circle_at_82%_42%,rgba(255,198,84,0.24),rgba(255,198,84,0.1)_18%,rgba(255,198,84,0)_42%)]"
          />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,2fr)] lg:items-stretch">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.34em] text-primary">State 001</p>
                <h1 className="max-w-4xl text-5xl font-serif leading-tight text-foreground sm:text-6xl">Structure before code.</h1>
                <p className="max-w-2xl text-lg leading-8 text-foreground/90">
                  Most teams move faster than they understand. We fix that.
                </p>
                <div className="max-w-2xl pt-3">
                  <div className="relative">
                  <textarea
                    id="hero-conversation"
                    rows={3}
                    autoFocus
                    placeholder="How can we help? Start with what you're trying to build."
                    className="w-full resize-none rounded-[1.5rem] border border-border bg-card/80 px-4 py-4 pr-14 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary"
                  />
                  <button
                    type="button"
                    aria-label="Send"
                    className="absolute bottom-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/80 text-muted-foreground transition hover:text-foreground"
                  >
                    <Send size={16} />
                  </button>
                  </div>
                </div>
              </div>
              <div className="h-full space-y-4 rounded-[1.75rem] border border-white/12 bg-black/40 p-5 shadow-[0_32px_120px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
                <p className="text-sm uppercase tracking-[0.24em] text-primary">The shift</p>
                <p className="text-[2rem] leading-tight font-serif text-foreground xl:text-[2.2rem]">
                  Code got cheaper. Mistakes didn&apos;t.
                </p>
                <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
                  LLMs accelerate output. They do not create understanding. If your structure is weak, AI just helps you fail faster.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Riley stays available in code, but is hidden from the current home layout. */}
        <div className="mx-auto hidden max-w-7xl px-4 sm:px-6 lg:px-8">
          <RileyWorkspace />
        </div>
      </section>

      <div className="mx-auto mt-8 max-w-7xl space-y-16 px-4 sm:px-6 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[1.75rem] border border-border bg-card p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-primary">The bottleneck</p>
            <h2 className="mt-3 text-3xl font-serif text-foreground">The bottleneck isn&apos;t building anymore. It&apos;s knowing what to build.</h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
            If the system isn&apos;t clear, everything built on top of it drifts. Drift is expensive and AI just accelerates the problem.
          </p>
          </div>
          <div className="rounded-[1.75rem] border border-border bg-card p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-primary">Fieldstate</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Not</p>
                <ul className="mt-3 space-y-3 text-sm text-foreground">
                  <li>Not a dev shop</li>
                  <li>Not an agency</li>
                  <li>Not a health company</li>
                </ul>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Is</p>
                <ul className="mt-3 space-y-3 text-sm text-foreground">
                  <li>System definition</li>
                  <li>Architectural thinking</li>
                  <li>AI-aligned planning</li>
                </ul>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">Clarity before code. Always.</p>
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-border bg-card p-6">
          <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-primary">How it works</p>
              <h2 className="mt-3 text-3xl font-serif text-foreground">Interaction first. Structure second. Engagement last.</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-muted-foreground">
              Riley moves the problem toward definition. WorkSpec keeps the structure. Fieldstate steps in when the complexity, stakes, and ambiguity warrant it.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {processSteps.map((step, index) => (
              <div key={step} className="rounded-3xl border border-border/70 bg-background p-4">
                <p className="text-[10px] uppercase tracking-[0.24em] text-primary">0{index + 1}</p>
                <p className="mt-3 text-sm leading-7 text-foreground">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-primary">Proof</p>
            <h2 className="mt-3 text-3xl font-serif text-foreground">If you can&apos;t explain your system, you can&apos;t build it.</h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {homeProof.map((item) => (
              <article key={item.system} className="rounded-[1.75rem] border border-border bg-card p-6">
                <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">System</p>
                <p className="mt-2 text-xl font-serif text-foreground">{item.system}</p>
                <p className="mt-5 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Intervention</p>
                <p className="mt-2 text-sm leading-7 text-foreground">{item.intervention}</p>
                <p className="mt-5 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Result</p>
                <p className="mt-2 text-sm leading-7 text-foreground">{item.result}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
