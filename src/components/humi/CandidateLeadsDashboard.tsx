import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Download, ExternalLink, LogOut } from "lucide-react";
import { getLeads } from "@/lib/api/leads.functions";
import { adminLogout } from "@/lib/api/admin-auth.functions";

interface Props {
  adminEmail?: string;
}

export function CandidateLeadsDashboard({ adminEmail }: Props) {
  const navigate = useNavigate();
  const {
    data: leads = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-leads"],
    queryFn: () => getLeads(),
  });

  const logout = async () => {
    await adminLogout();
    navigate({ to: "/admin-login" });
  };

  const exportCsv = () => {
    const head = "Name,Email,Phone,Stage,Resume,Recommended Role,Interest,AI Readiness,Captured";
    const rows = leads.map((l) =>
      [
        `${l.firstName} ${l.lastName}`,
        l.email,
        l.phone,
        l.careerStage,
        l.resumeFileName ?? "Manual entry",
        l.recommendedRole,
        l.careerInterest,
        String(l.aiReadiness),
        l.createdAt,
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(","),
    );
    const url = URL.createObjectURL(new Blob([[head, ...rows].join("\n")], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "humi-leads.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="mx-auto max-w-6xl px-5 py-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">Candidate Leads</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {adminEmail && <>Signed in as {adminEmail} · </>}
            {leads.length} candidate{leads.length === 1 ? "" : "s"} captured.
          </p>
        </div>
        <button
          onClick={logout}
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
        >
          <LogOut className="h-4 w-4" /> Log out
        </button>
      </div>

      <div className="mt-5 flex gap-3">
        <button
          onClick={exportCsv}
          disabled={!leads.length}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-50"
        >
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      {error && (
        <p className="mt-6 text-sm text-destructive">
          Failed to load leads. Try refreshing the page.
        </p>
      )}

      <div className="mt-8 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-tint text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              {["Name", "Contact", "Stage", "Resume", "Recommended role", "Interest", "Score"].map(
                (h) => (
                  <th key={h} className="px-4 py-3 font-bold">
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => (
              <tr key={l.id} className="border-t border-border">
                <td className="px-4 py-3 font-semibold">
                  {l.firstName} {l.lastName}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {l.email}
                  <br />
                  {l.phone}
                </td>
                <td className="px-4 py-3">{l.careerStage}</td>
                <td className="px-4 py-3">
                  {l.resumeUrl ? (
                    <a
                      href={l.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                    >
                      {l.resumeFileName ?? "View"} <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : (
                    <span className="text-muted-foreground">Manual entry</span>
                  )}
                </td>
                <td className="px-4 py-3">{l.recommendedRole}</td>
                <td className="px-4 py-3 text-muted-foreground">{l.careerInterest}</td>
                <td className="px-4 py-3 font-bold text-primary">{l.aiReadiness}</td>
              </tr>
            ))}
            {!isLoading && !leads.length && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  No leads captured yet.
                </td>
              </tr>
            )}
            {isLoading && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  Loading…
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
