import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SealMark } from "@/components/brand/seal";
import { PAPER_META, PAPER_SECTIONS, PAPER_TOC } from "@/lib/whitepaper/content";
import type { Block } from "@/lib/whitepaper/types";
import { cn } from "@/lib/utils";

const TOKEN =
  /(\*\*[^*]+\*\*|`[^`]+`|\[\[[^\]|]+\|[^\]]+\]\]|\[[^\]]+\]\(https?:[^)]+\))/g;

function Rich({ text }: { text: string }) {
  const parts = text.split(TOKEN);
  return (
    <>
      {parts.map((part, i) => {
        if (!part) return null;
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code key={i} className="rounded-sm bg-secondary px-1 py-0.5 font-mono text-sm">
              {part.slice(1, -1)}
            </code>
          );
        }
        const intern = part.match(/^\[\[([^\]|]+)\|([^\]]+)\]\]$/);
        if (intern) {
          const [, target, label] = intern;
          return (
            <a key={i} href={target} className="text-primary underline-offset-4 hover:underline">
              {label}
            </a>
          );
        }
        const ext = part.match(/^\[([^\]]+)\]\((https?:[^)]+)\)$/);
        if (ext) {
          return (
            <a
              key={i}
              href={ext[2]}
              className="text-primary underline-offset-4 hover:underline"
              rel="noreferrer"
              target="_blank"
            >
              {ext[1]}
            </a>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

function PaperTable({
  caption,
  headers,
  rows,
}: {
  caption?: string;
  headers: string[];
  rows: string[][];
}) {
  return (
    <figure className="my-6 w-full min-w-0 max-w-full">
      {caption ? (
        <figcaption className="mb-2 text-label uppercase tracking-label text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
      <div className="w-full max-w-full overflow-x-auto rounded-xl bg-card shadow-[var(--shadow-border)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-label uppercase tracking-label text-muted-foreground">
            <tr>
              {headers.map((h) => (
                <th key={h} className="px-4 py-3 font-medium break-words">
                  <Rich text={h} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className="border-b border-border/70 align-top last:border-0">
                {row.map((cell, ci) => (
                  <td key={ci} className="px-4 py-3 leading-snug break-words">
                    <Rich text={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "lede":
      return (
        <p className="font-display text-xl leading-snug tracking-tight text-foreground sm:text-2xl">
          <Rich text={block.text} />
        </p>
      );
    case "p":
      return (
        <p className="leading-relaxed text-foreground/90">
          <Rich text={block.text} />
        </p>
      );
    case "h3":
      return <h3 className="mt-8 font-display text-xl tracking-tight">{block.text}</h3>;
    case "ul":
      return (
        <ul className="grid list-disc gap-2 pl-5 text-sm leading-relaxed marker:text-primary sm:text-base">
          {block.items.map((item) => (
            <li key={item}>
              <Rich text={item} />
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="grid list-decimal gap-2 pl-5 text-sm leading-relaxed marker:font-mono marker:text-sm marker:text-muted-foreground sm:text-base">
          {block.items.map((item) => (
            <li key={item}>
              <Rich text={item} />
            </li>
          ))}
        </ol>
      );
    case "table":
      return <PaperTable caption={block.caption} headers={block.headers} rows={block.rows} />;
    case "quote":
      return (
        <blockquote className="border-l-2 border-primary pl-5 font-display text-lg italic leading-snug tracking-tight">
          <Rich text={block.text} />
        </blockquote>
      );
    case "callout":
      return (
        <aside className="rounded-xl bg-accent p-5 text-accent-foreground shadow-[var(--shadow-border)]">
          {block.kicker ? (
            <p className="text-label uppercase tracking-label text-muted-foreground">{block.kicker}</p>
          ) : null}
          <p className="mt-1 font-display text-lg tracking-tight">{block.title}</p>
          <p className="mt-2 text-sm leading-relaxed">
            <Rich text={block.body} />
          </p>
        </aside>
      );
    case "code":
      return (
        <figure>
          {block.caption ? (
            <figcaption className="mb-2 text-label uppercase tracking-label text-muted-foreground">
              {block.caption}
            </figcaption>
          ) : null}
          <pre className="max-w-full overflow-x-auto rounded-xl bg-foreground px-4 py-4 font-mono text-xs leading-relaxed text-background">
            {block.text}
          </pre>
        </figure>
      );
    case "note":
      return (
        <p className="rounded-lg border border-dashed border-border bg-secondary/60 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
          <Rich text={block.text} />
        </p>
      );
    default:
      return null;
  }
}

function TocList({
  active,
  onPick,
  className,
}: {
  active: string;
  onPick?: () => void;
  className?: string;
}) {
  return (
    <ol className={cn("grid gap-0.5", className)}>
      {PAPER_TOC.map((item) => {
        const current = active === item.id;
        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={onPick}
              className={cn(
                "flex min-h-11 gap-3 rounded-md px-2 py-2 text-sm transition-colors duration-150 lg:min-h-0 lg:py-1.5",
                current
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
              aria-current={current ? "location" : undefined}
            >
              <span className="w-6 shrink-0 font-mono text-label text-muted-foreground">{item.num}</span>
              <span className="leading-snug">{item.title}</span>
            </a>
          </li>
        );
      })}
    </ol>
  );
}

function useActiveSection() {
  const [active, setActive] = useState(PAPER_TOC[0]?.id ?? "");

  useEffect(() => {
    const nodes = PAPER_TOC.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActive(visible[0].target.id);
      },
      { rootMargin: "-12% 0px -70% 0px", threshold: [0, 0.25, 1] },
    );
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = document.querySelector(`nav[aria-label="Paper contents"] a[href="#${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  return active;
}

export function WhitepaperDocument() {
  const active = useActiveSection();
  const [tocOpen, setTocOpen] = useState(false);

  return (
    <main>
      <section className="border-b border-foreground/80">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="flex items-start justify-between gap-4">
            <p className="text-label uppercase tracking-label text-muted-foreground">
              {PAPER_META.folio} · White paper · {PAPER_META.prepared}
            </p>
            <SealMark className="size-10 shrink-0 print-hidden" />
          </div>
          <h1 className="mt-4 max-w-3xl font-display text-4xl leading-tight tracking-display sm:text-5xl">
            {PAPER_META.title}
          </h1>
          <p className="mt-4 max-w-2xl font-display text-xl italic leading-snug text-muted-foreground">
            {PAPER_META.subtitle}
          </p>
          <dl className="mt-8 grid gap-4 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-label uppercase tracking-label text-muted-foreground">Version</dt>
              <dd className="mt-1">{PAPER_META.version}</dd>
            </div>
            <div>
              <dt className="text-label uppercase tracking-label text-muted-foreground">First application</dt>
              <dd className="mt-1">{PAPER_META.firstApplication}</dd>
            </div>
            <div>
              <dt className="text-label uppercase tracking-label text-muted-foreground">Working name</dt>
              <dd className="mt-1">{PAPER_META.workingName}</dd>
            </div>
          </dl>
          <p className="mt-6 max-w-3xl leading-relaxed text-muted-foreground">{PAPER_META.foundation}</p>
          <div className="mt-8 flex flex-wrap gap-3 print-hidden">
            <Button type="button" onClick={() => window.print()}>
              <Printer />
              Print or save PDF
            </Button>
            <Button asChild variant="outline">
              <a href="/whitepaper.md" download>
                <Download />
                Download Markdown
              </a>
            </Button>
            <Button asChild variant="outline">
              <Link to="/collection">Open the prototype</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-secondary/50">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <p className="text-label uppercase tracking-label text-muted-foreground">Document status</p>
          <p className="mt-2 max-w-4xl leading-relaxed">{PAPER_META.status}</p>
        </div>
      </section>

      <div className="mx-auto flex max-w-6xl min-w-0 flex-col gap-10 px-4 py-10 sm:px-6 lg:flex-row lg:py-14">
        <aside className="print-hidden lg:sticky lg:top-6 lg:w-64 lg:shrink-0 lg:self-start">
          <details
            className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)] lg:hidden"
            open={tocOpen}
            onToggle={(e) => setTocOpen((e.target as HTMLDetailsElement).open)}
          >
            <summary className="cursor-pointer font-display text-lg tracking-tight">Contents</summary>
            <TocList active={active} onPick={() => setTocOpen(false)} className="mt-3 max-h-80 overflow-y-auto" />
          </details>
          <nav className="hidden max-h-dvh overflow-y-auto pr-1 lg:block" aria-label="Paper contents">
            <p className="mb-3 text-label uppercase tracking-label text-muted-foreground">Contents</p>
            <TocList active={active} />
          </nav>
        </aside>

        <article className="min-w-0 max-w-full flex-1 overflow-x-hidden">
          <header className="mb-12 border-b border-border pb-8">
            <p className="font-display text-2xl leading-snug tracking-tight">{PAPER_META.lede}</p>
            <p className="mt-4 text-sm text-muted-foreground">
              How to cite: TrialWatch. <em>{PAPER_META.title}: {PAPER_META.subtitle}.</em>{" "}
              {PAPER_META.version}. {PAPER_META.prepared}.
            </p>
          </header>

          <div className="grid min-w-0 gap-16">
            {PAPER_SECTIONS.map((section) => (
              <section key={section.id} id={section.id} className="min-w-0 scroll-mt-6">
                <p className="text-label uppercase tracking-label text-muted-foreground">
                  Section {section.num}
                </p>
                <h2 className="mt-1 font-display text-3xl tracking-tight">{section.title}</h2>
                <div className="mt-6 grid gap-4">
                  {section.blocks.map((block, i) => (
                    <BlockView key={i} block={block} />
                  ))}
                </div>
              </section>
            ))}
          </div>

          <footer className="mt-16 border-t border-foreground/80 pt-8">
            <p className="font-display text-xl tracking-tight">End of paper</p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              This web edition is the reading copy of the founder-review draft. The Markdown source is
              byte-identical to the attached blueprint. Inclusion in TrialWatch is not a claim of
              clinical truth.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 print-hidden">
              <Button asChild>
                <Link to="/collection">Inspect the Glucoril packets</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/methods">Read the frozen policy</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/verify">Verify a receipt</Link>
              </Button>
            </div>
          </footer>
        </article>
      </div>
    </main>
  );
}
