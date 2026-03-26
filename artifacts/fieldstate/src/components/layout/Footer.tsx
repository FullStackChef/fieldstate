export function Footer() {
  return (
    <footer className="border-t border-border/80 bg-background/95">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 text-sm text-muted-foreground sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Fieldstate is a system.</p>
          <p className="mt-3 max-w-xl leading-7">
            Fieldstate defines systems so AI and humans can build them correctly. Riley is the interface. WorkSpec is the structure underneath it.
          </p>
        </div>
        <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
          <p>Structure before code.</p>
          <p className="mt-2">A system you enter.</p>
        </div>
      </div>
    </footer>
  );
}
