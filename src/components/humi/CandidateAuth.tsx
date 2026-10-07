import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { candidateLogin, candidateSignup } from "@/lib/api/candidate-auth.functions";

const field =
  "w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm outline-none transition focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10";

interface Props {
  onAuthenticated: (email: string) => void;
  defaultMode?: "signup" | "login";
}

export function CandidateAuth({ onAuthenticated, defaultMode = "signup" }: Props) {
  const [mode, setMode] = useState<"signup" | "login">(defaultMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "signup") {
        await candidateSignup({ data: { email: email.trim(), password } });
      } else {
        await candidateLogin({ data: { email: email.trim(), password } });
      }
      onAuthenticated(email.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-5 py-16"
    >
      <div className="surface-card mx-auto max-w-md p-7 sm:p-9">
        <h2 className="text-2xl font-extrabold sm:text-3xl">
          {mode === "signup" ? "Create your account" : "Welcome back"}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "signup"
            ? "Sign up to upload your resume, get your AI career report, and apply to matching jobs."
            : "Log in to see your career report and job applications."}
        </p>

        <form onSubmit={submit} className="mt-7 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Email Address</label>
            <input
              className={field}
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Password</label>
            <input
              className={field}
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-base font-bold text-primary-foreground shadow-[var(--shadow-lift)] transition hover:brightness-110 disabled:opacity-60"
          >
            {loading ? "Please wait…" : mode === "signup" ? "Create Account" : "Log In"}
            {!loading && (
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            )}
          </button>
        </form>

        <button
          onClick={() => {
            setMode((m) => (m === "signup" ? "login" : "signup"));
            setError("");
          }}
          className="mt-5 w-full text-center text-sm font-semibold text-muted-foreground hover:text-primary"
        >
          {mode === "signup" ? "Already have an account? Log in" : "New here? Create an account"}
        </button>
      </div>
    </motion.section>
  );
}
