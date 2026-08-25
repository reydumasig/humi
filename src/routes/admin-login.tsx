import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { HumiLogo } from "@/components/humi/HumiLogo";
import { adminLogin, getAdminMe } from "@/lib/api/admin-auth.functions";

const field =
  "w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm outline-none transition focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10";

export const Route = createFileRoute("/admin-login")({
  beforeLoad: async () => {
    const me = await getAdminMe();
    if (me) throw redirect({ to: "/admin" });
  },
  head: () => ({
    meta: [{ title: "Admin Login — Humi.ai" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await adminLogin({ data: { email, password } });
      navigate({ to: "/admin" });
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-12">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-lift)]"
      >
        <HumiLogo className="mx-auto" showTagline />
        <h1 className="mt-6 text-center text-xl font-extrabold">Admin Login</h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Sign in to view candidate leads.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Email</label>
            <input
              type="email"
              required
              className={field}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Password</label>
            <input
              type="password"
              required
              className={field}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-primary px-7 py-3.5 text-base font-bold text-primary-foreground shadow-[var(--shadow-lift)] transition hover:brightness-110 disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
