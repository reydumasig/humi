import { createFileRoute } from "@tanstack/react-router";
import { JobDetail } from "@/components/humi/JobDetail";

export const Route = createFileRoute("/jobs/$jobId")({
  head: () => ({
    meta: [
      { title: "Job Details — Humi.ai" },
      {
        name: "description",
        content: "Role details, requirements and interview booking for this Humi.ai job listing.",
      },
      { property: "og:title", content: "Job Details — Humi.ai" },
      {
        property: "og:description",
        content: "Review the role and book an interview slot with the hiring company.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: JobDetailRoute,
});

function JobDetailRoute() {
  const { jobId } = Route.useParams();
  return <JobDetail jobId={jobId} />;
}
