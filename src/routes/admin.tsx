import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { AdminDashboard } from "@/components/humi/AdminDashboard";
import { getAdminMe, adminLogout } from "@/lib/api/admin-auth.functions";

export const Route = createFileRoute("/admin")({
  beforeLoad: async () => {
    const me = await getAdminMe();
    if (!me) throw redirect({ to: "/admin-login" });
    return { adminEmail: me.email };
  },
  head: () => ({
    meta: [
      { title: "Admin Console — Humi.ai" },
      {
        name: "description",
        content: "Candidate leads, job postings and interview bookings for Humi.ai.",
      },
      { property: "og:title", content: "Admin Console — Humi.ai" },
      {
        property: "og:description",
        content: "Candidate leads, job postings and interview bookings for Humi.ai.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminRoute,
});

function AdminRoute() {
  const { adminEmail } = Route.useRouteContext();
  const navigate = useNavigate();

  const logout = async () => {
    await adminLogout();
    navigate({ to: "/admin-login" });
  };

  return (
    <main className="mx-auto max-w-6xl px-5 py-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">Humi.ai Console</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Candidate leads, job postings and interview bookings.
          </p>
        </div>
        <button
          onClick={logout}
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
        >
          <LogOut className="h-4 w-4" /> Log out
        </button>
      </div>

      <AdminDashboard adminEmail={adminEmail} />
    </main>
  );
}
