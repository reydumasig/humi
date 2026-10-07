import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { getApplications, updateApplicationStatus } from "@/lib/api/applications.functions";
import { APPLICATION_STATUSES, type ApplicationStatus } from "@/lib/humi/types";

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  Applied: "bg-tint text-primary",
  Screening: "bg-tint text-primary",
  Interview: "bg-primary/15 text-primary",
  Offer: "bg-primary text-primary-foreground",
  Rejected: "border border-border text-muted-foreground",
};

export function ApplicationsAdmin() {
  const queryClient = useQueryClient();
  const [stageFilter, setStageFilter] = useState<ApplicationStatus | "All">("All");

  const {
    data: apps = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-applications"],
    queryFn: () => getApplications(),
  });

  const statusMutation = useMutation({
    mutationFn: updateApplicationStatus,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-applications"] }),
  });

  const filtered = useMemo(
    () => (stageFilter === "All" ? apps : apps.filter((a) => a.status === stageFilter)),
    [apps, stageFilter],
  );

  const exportCsv = () => {
    const head =
      "Candidate,Email,Phone,Role,Company,Status,Interview Date,Interview Time,Mode,Note,Applied";
    const rows = apps.map((a) =>
      [
        a.candidateName,
        a.email,
        a.phone,
        a.jobTitle,
        a.company,
        a.status,
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
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={exportCsv}
          disabled={!apps.length}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-50"
        >
          <Download className="h-4 w-4" /> Export CSV
        </button>
        <div className="ml-auto flex flex-wrap gap-2">
          {(["All", ...APPLICATION_STATUSES] as const).map((s) => {
            const count = s === "All" ? apps.length : apps.filter((a) => a.status === s).length;
            return (
              <button
                key={s}
                onClick={() => setStageFilter(s)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold ${
                  stageFilter === s
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card text-muted-foreground"
                }`}
              >
                {s} ({count})
              </button>
            );
          })}
        </div>
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
              {["Candidate", "Contact", "Role", "Company", "Stage", "Interview", "Note"].map(
                (h) => (
                  <th key={h} className="px-4 py-3 font-bold">
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id} className="border-t border-border">
                <td className="px-4 py-3 font-semibold">{a.candidateName}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {a.email}
                  <br />
                  {a.phone}
                </td>
                <td className="px-4 py-3">{a.jobTitle}</td>
                <td className="px-4 py-3">{a.company}</td>
                <td className="px-4 py-3">
                  <select
                    value={a.status}
                    onChange={(e) =>
                      statusMutation.mutate({
                        data: { id: a.id, status: e.target.value as ApplicationStatus },
                      })
                    }
                    className={`rounded-full px-3 py-1.5 text-xs font-bold outline-none ${STATUS_STYLES[a.status]}`}
                  >
                    {APPLICATION_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 font-bold text-primary">
                  {a.interviewDate}
                  <br />
                  {a.interviewTime} · {a.interviewMode}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{a.note || "—"}</td>
              </tr>
            ))}
            {!isLoading && !filtered.length && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  No applications{stageFilter === "All" ? " yet" : ` in ${stageFilter}`}.
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
    </div>
  );
}
