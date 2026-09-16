import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { PacketFrame } from "@/components/mec/packet-frame";
import { getPacket } from "@/lib/mec/issued";
import { overlayPacket, useLocalReviews } from "@/lib/mec/local-review";

export const Route = createFileRoute("/packets/$packetId")({ component: PacketLayout });

function PacketLayout() {
  const { packetId } = Route.useParams();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const found = getPacket(packetId);
  const draft = useLocalReviews((s) => s.drafts[packetId]);
  if (!found) {
    return (
      <main className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl">No such packet</h1>
        <p className="mt-3 text-muted-foreground">That synthetic identifier is not in this collection.</p>
        <Link to="/collection" className="mt-6 inline-block text-primary hover:underline">
          Back to the collection
        </Link>
      </main>
    );
  }
  const packet = overlayPacket(found, draft);
  const tab = pathname.endsWith("/claim")
    ? "claim"
    : pathname.endsWith("/review")
      ? "review"
      : pathname.endsWith("/receipt")
        ? "receipt"
        : pathname.endsWith("/history")
          ? "history"
          : "overview";

  return (
    <PacketFrame packet={packet} tab={tab}>
      <Outlet />
    </PacketFrame>
  );
}
