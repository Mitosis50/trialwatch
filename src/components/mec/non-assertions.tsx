import { MANDATORY_NON_ASSERTIONS, NON_ASSERTION_LABELS } from "@/lib/mec/types";

export function NonAssertions({ compact = false }: { compact?: boolean }) {
  return (
    <section className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5">
      <h2 className="font-display text-lg tracking-tight">This receipt does not establish</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Mandatory non-assertions. An empty or weakened set is a verification failure.
      </p>
      <ul className={compact ? "mt-3 grid gap-1 text-sm" : "mt-4 grid gap-2 sm:grid-cols-2"}>
        {MANDATORY_NON_ASSERTIONS.map((code) => (
          <li key={code} className="flex gap-2 text-sm leading-snug">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
            <span>{NON_ASSERTION_LABELS[code]}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
