import { createFileRoute } from "@tanstack/react-router";
import { JobBoard } from "@/components/humi/JobBoard";

export const Route = createFileRoute("/jobs/")({
  head: () => ({
    meta: [
      { title: "Matching Jobs — Humi.ai" },
      {
        name: "description",
        content:
          "Browse AI-ready job openings matched to your Humi.ai career evolution plan and book an interview slot.",
      },
      { property: "og:title", content: "Matching Jobs — Humi.ai" },
      {
        property: "og:description",
        content:
          "Open roles from companies hiring at the job fair, matched to your career profile.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: JobBoard,
});
