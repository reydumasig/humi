import { createFileRoute, redirect } from "@tanstack/react-router";
import { CandidateLeadsDashboard } from "@/components/humi/CandidateLeadsDashboard";
import { getAdminMe } from "@/lib/api/admin-auth.functions";

export const Route = createFileRoute("/admin")({
  beforeLoad: async () => {
    const me = await getAdminMe();
    if (!me) throw redirect({ to: "/admin-login" });
    return { adminEmail: me.email };
  },
  head: () => ({
    meta: [
      { title: "Candidate Leads — Humi.ai" },
      { name: "description", content: "Job fair candidate leads captured by Humi.ai." },
      { property: "og:title", content: "Candidate Leads — Humi.ai" },
      { property: "og:description", content: "Job fair candidate leads captured by Humi.ai." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminRoute,
});

function AdminRoute() {
  const { adminEmail } = Route.useRouteContext();
  return <CandidateLeadsDashboard adminEmail={adminEmail} />;
}
