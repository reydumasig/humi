import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { getHelpRequests } from "@/lib/api/help-requests.functions";

export function HelpRequestsAdmin() {
  const {
    data: requests = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-help-requests"],
    queryFn: () => getHelpRequests(),
  });

  const exportCsv = () => {
    const head = "Candidate,Email,Phone,Topic,Message,Submitted";
    const rows = requests.map((r) =>
      [r.firstName + " " + r.lastName, r.email, r.phone, r.topic, r.message, r.createdAt]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(","),
    );
    const url = URL.createObjectURL(new Blob([[head, ...rows].join("\n")], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "humi-help-requests.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex gap-3">
        <button
          onClick={exportCsv}
          disabled={!requests.length}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-50"
        >
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      {error && (
        <p className="mt-6 text-sm text-destructive">
          Failed to load help requests. Try refreshing the page.
        </p>
      )}

      <div className="mt-8 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-tint text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              {["Candidate", "Contact", "Topic", "Message", "Submitted"].map((h) => (
                <th key={h} className="px-4 py-3 font-bold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <td className="px-4 py-3 font-semibold">
                  {r.firstName} {r.lastName}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {r.email}
                  <br />
                  {r.phone}
                </td>
                <td className="px-4 py-3 font-bold text-primary">{r.topic}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.message || "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(r.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
            {!isLoading && !requests.length && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No help requests yet.
                </td>
              </tr>
            )}
            {isLoading && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
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
