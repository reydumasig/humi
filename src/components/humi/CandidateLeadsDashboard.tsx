import { useEffect, useState } from "react";
import { Download, Trash2 } from "lucide-react";
import { clearLeads, getLeads } from "@/lib/humi/leads";
import type { Lead } from "@/lib/humi/types";

export function CandidateLeadsDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    setLeads(getLeads());
  }, []);

  const exportCsv = () => {
    const head = "Name,Email,Phone,Stage,Resume,Recommended Role,Interest,AI Readiness,Captured";
    const rows = leads.map((l) =>
      [
        `${l.firstName} ${l.lastName}`,
        l.email,
        l.phone,
        l.careerStage,
        l.resumeFileName,
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
      <h1 className="text-3xl font-extrabold">Candidate Leads</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Captured on this device during the job fair ({leads.length} total).
      </p>

      <div className="mt-5 flex gap-3">
        <button
          onClick={exportCsv}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"
        >
          <Download className="h-4 w-4" /> Export CSV
        </button>
        <button
          onClick={() => {
            clearLeads();
            setLeads([]);
          }}
          className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-bold"
        >
          <Trash2 className="h-4 w-4" /> Clear
        </button>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-tint text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              {["Name", "Contact", "Stage", "Recommended role", "Interest", "Score"].map((h) => (
                <th key={h} className="px-4 py-3 font-bold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => (
              <tr key={l.id} className="border-t border-border">
                <td className="px-4 py-3 font-semibold">{l.firstName} {l.lastName}</td>
                <td className="px-4 py-3 text-muted-foreground">{l.email}<br />{l.phone}</td>
                <td className="px-4 py-3">{l.careerStage}</td>
                <td className="px-4 py-3">{l.recommendedRole}</td>
                <td className="px-4 py-3 text-muted-foreground">{l.careerInterest}</td>
                <td className="px-4 py-3 font-bold text-primary">{l.aiReadiness}</td>
              </tr>
            ))}
            {!leads.length && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  No leads captured yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
