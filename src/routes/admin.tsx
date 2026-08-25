import { createFileRoute } from "@tanstack/react-router";
import { CandidateLeadsDashboard } from "@/components/humi/CandidateLeadsDashboard";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Candidate Leads — Humi.ai" },
      { name: "description", content: "Job fair candidate leads captured by Humi.ai." },
      { property: "og:title", content: "Candidate Leads — Humi.ai" },
      { property: "og:description", content: "Job fair candidate leads captured by Humi.ai." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <CandidateLeadsDashboard />,
});
