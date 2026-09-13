import { createFileRoute } from "@tanstack/react-router";
import { WhitepaperDocument } from "@/components/whitepaper/document";

export const Route = createFileRoute("/whitepaper")({
  component: WhitepaperPage,
  head: () => ({
    meta: [
      { title: "White paper · TrialWatch" },
      {
        name: "description",
        content:
          "Medical Evidence Commons — full product, architecture, and implementation blueprint. Version 0.1 founder review draft.",
      },
    ],
  }),
});

function WhitepaperPage() {
  return <WhitepaperDocument />;
}
