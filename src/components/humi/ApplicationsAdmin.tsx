import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { getApplications } from "@/lib/api/applications.functions";

export function ApplicationsAdmin() {
  const {
    data: apps = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-applications"],
    queryFn: () => getApplications(),
  });

  const exportCsv = () => {
    const head =
      "Candidate,Email,Phone,Role,Company,Interview Date,Interview Time,Mode,Note,Applied";
    const rows = apps.map((a) =>
      [
        a.candidateName,
        a.email,
        a.phone,
        a.jobTitle,
        a.company,
        a.interviewDate,
        a.interviewTime,
        a.interviewMode,
        a.note,
        a.createdAt,
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(","),
    );
    const url = URL.createObjectURL(new Blob([[head, ...rows].join("\n")], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "humi-applications.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex gap-3">
        <button
          onClick={exportCsv}
          disabled={!apps.length}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-50"
        >
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      {error && (
        <p className="mt-6 text-sm text-destructive">
          Failed to load applications. Try refreshing the page.
        </p>
      )}

      <div className="mt-8 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-tint text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              {["Candidate", "Contact", "Role", "Company", "Interview", "Note"].map((h) => (
                <th key={h} className="px-4 py-3 font-bold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {apps.map((a) => (
              <tr key={a.id} className="border-t border-border">
                <td className="px-4 py-3 font-semibold">{a.candidateName}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {a.email}
                  <br />
                  {a.phone}
                </td>
                <td className="px-4 py-3">{a.jobTitle}</td>
                <td className="px-4 py-3">{a.company}</td>
                <td className="px-4 py-3 font-bold text-primary">
                  {a.interviewDate}
                  <br />
                  {a.interviewTime} · {a.interviewMode}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{a.note || "—"}</td>
              </tr>
            ))}
            {!isLoading && !apps.length && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  No applications yet.
                </td>
              </tr>
            )}
            {isLoading && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  Loading…
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
