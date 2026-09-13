import { createRouter } from "@tanstack/react-router";
import { AppErrorComponent } from "@/lib/error-component";
import { routeTree } from "./routeTree.gen";

function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-6 py-24 text-center">
      <p className="text-label uppercase tracking-label text-muted-foreground">TrialWatch</p>
      <h1 className="mt-3 font-display text-3xl">No such record</h1>
      <p className="mt-3 text-muted-foreground">
        That identifier is not in the synthetic collection. Nothing was fetched from a live registry.
      </p>
      <a href="/collection" className="mt-6 inline-block text-primary hover:underline">
        Back to the collection
      </a>
    </main>
  );
}

export function getRouter() {
  return createRouter({
    routeTree,
    defaultErrorComponent: AppErrorComponent,
    defaultNotFoundComponent: NotFound,
  });
}
