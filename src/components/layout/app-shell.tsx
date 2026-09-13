import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { SealMark } from "@/components/brand/seal";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Overview" },
  { to: "/collection", label: "Collection" },
  { to: "/verify", label: "Verify" },
  { to: "/methods", label: "Methods" },
  { to: "/whitepaper", label: "White paper" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <a
        href="#main"
        className="absolute left-4 top-4 z-50 -translate-y-16 rounded-md bg-card px-3 py-2 text-sm shadow-[var(--shadow-border)] transition-transform duration-150 focus:translate-y-0 print-hidden"
      >
        Skip to content
      </a>
      <div className="border-b border-border bg-secondary text-center print-hidden">
        <p className="px-4 py-2 text-label uppercase tracking-label text-muted-foreground">
          Synthetic prototype — fictional trials. Not clinical advice. Reading needs no account.
        </p>
      </div>
      <header className="border-b border-foreground/80 print-hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-3 text-foreground no-underline">
            <SealMark className="size-8 shrink-0" />
            <span className="flex flex-col leading-none">
              <span className="font-display text-xl tracking-tight">TrialWatch</span>
              <span className="mt-1 text-label uppercase tracking-label text-muted-foreground">
                Medical Evidence Commons
              </span>
            </span>
          </Link>
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {NAV.map((item) => {
              const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm transition-colors duration-150",
                    active ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-md border border-border lg:hidden"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
        {open ? (
          <nav className="border-t border-border px-4 py-3 lg:hidden" aria-label="Mobile">
            <ul className="flex flex-col gap-1">
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="block rounded-md px-3 py-3 text-sm"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </header>
      <div id="main">{children}</div>
      <footer className="border-t border-border print-hidden">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground sm:px-6">
          <p>
            Release A · Commons draft receipts, not Proof of Fulfillment receipts. Inclusion is not
            truth. A completed review is not a treatment decision.
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-label uppercase tracking-label">
            <span>TrialWatch · designed for shared stewardship · no patient records</span>
            <Link to="/whitepaper" className="text-primary hover:underline">
              White paper
            </Link>
            <Link to="/methods" className="text-primary hover:underline">
              Methods
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
