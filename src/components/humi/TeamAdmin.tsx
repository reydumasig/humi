import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2, UserPlus } from "lucide-react";
import { getAdminUsers, inviteAdminUser, removeAdminUser } from "@/lib/api/admin-users.functions";

const field =
  "w-full rounded-2xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-primary";

export function TeamAdmin({ currentAdminEmail }: { currentAdminEmail?: string }) {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"owner" | "admin">("admin");
  const [error, setError] = useState("");

  const { data: admins = [], isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => getAdminUsers(),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-users"] });

  const inviteMutation = useMutation({
    mutationFn: inviteAdminUser,
    onSuccess: () => {
      invalidate();
      setEmail("");
      setPassword("");
      setRole("admin");
      setShowForm(false);
      setError("");
    },
    onError: (err) => setError(err instanceof Error ? err.message : "Failed to add admin."),
  });

  const removeMutation = useMutation({
    mutationFn: removeAdminUser,
    onSuccess: invalidate,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || password.length < 8) {
      setError("A valid email and a password of at least 8 characters are required.");
      return;
    }
    inviteMutation.mutate({ data: { email: email.trim(), password, role } });
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-xl text-sm text-muted-foreground">
          Owners can add or remove staff who can access this console. Admins can manage jobs,
          applicants and leads but not the team itself.
        </p>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"
        >
          <UserPlus className="h-4 w-4" /> {showForm ? "Close form" : "Add admin"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="surface-card mt-5 space-y-3 p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="email"
              className={field}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className={field}
              placeholder="Temporary password (at least 8 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <select
            className={field}
            value={role}
            onChange={(e) => setRole(e.target.value as "owner" | "admin")}
          >
            <option value="admin">Admin — manage jobs, applicants and leads</option>
            <option value="owner">Owner — can also manage the team</option>
          </select>
          {error && <p className="text-xs font-bold text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={inviteMutation.isPending}
            className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground disabled:opacity-60"
          >
            {inviteMutation.isPending ? "Adding…" : "Add admin"}
          </button>
        </form>
      )}

      <div className="mt-8 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-tint text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              {["Email", "Role", "Added", ""].map((h) => (
                <th key={h} className="px-4 py-3 font-bold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {admins.map((a) => (
              <tr key={a.userId} className="border-t border-border">
                <td className="px-4 py-3 font-semibold">
                  {a.email}
                  {a.email === currentAdminEmail && (
                    <span className="ml-2 text-xs font-bold text-muted-foreground">(you)</span>
                  )}
                </td>
                <td className="px-4 py-3 capitalize">{a.role}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(a.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  {a.email !== currentAdminEmail && (
                    <button
                      aria-label={`Remove ${a.email}`}
                      onClick={() => removeMutation.mutate({ data: { userId: a.userId } })}
                      className="text-muted-foreground hover:text-primary"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {!isLoading && !admins.length && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  No admins yet.
                </td>
              </tr>
            )}
            {isLoading && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
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
