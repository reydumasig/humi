import { useState } from "react";
import { CalendarDays, CheckCircle2, Clock, Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { submitApplication } from "@/lib/api/applications.functions";
import { cacheMyApplication, getProfile } from "@/lib/humi/candidate-profile";
import type { JobApplication, JobPosting } from "@/lib/humi/types";

function toDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y!, (m ?? 1) - 1, d ?? 1);
}
const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const pretty = (s: string) =>
  toDate(s).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });

function downloadIcs(app: JobApplication) {
  const [y, m, d] = app.interviewDate.split("-").map(Number);
  const [hh, mm] = app.interviewTime.split(":").map(Number);
  const start = new Date(y!, m! - 1, d!, hh!, mm!);
  const end = new Date(start.getTime() + 45 * 60000);
  const f = (dt: Date) =>
    `${dt.getFullYear()}${String(dt.getMonth() + 1).padStart(2, "0")}${String(dt.getDate()).padStart(2, "0")}T${String(dt.getHours()).padStart(2, "0")}${String(dt.getMinutes()).padStart(2, "0")}00`;
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Humi.ai//Interview//EN",
    "BEGIN:VEVENT",
    `UID:${app.id}`,
    `DTSTART:${f(start)}`,
    `DTEND:${f(end)}`,
    `SUMMARY:Interview — ${app.jobTitle} at ${app.company}`,
    `DESCRIPTION:${app.interviewMode} interview booked via Humi.ai`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "humi-interview.ics";
  a.click();
  URL.revokeObjectURL(url);
}

export function ApplyDialog({
  job,
  open,
  onOpenChange,
  onBooked,
}: {
  job: JobPosting;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onBooked: (app: JobApplication) => void;
}) {
  const p = getProfile();
  const [name, setName] = useState(p ? `${p.firstName} ${p.lastName}`.trim() : "");
  const [email, setEmail] = useState(p?.email ?? "");
  const [phone, setPhone] = useState(p?.phone ?? "");
  const [note, setNote] = useState("");
  const [date, setDate] = useState<string>(job.interviewDates[0] ?? "");
  const [time, setTime] = useState<string>("");
  const [booked, setBooked] = useState<JobApplication | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const confirm = async () => {
    if (!name.trim() || !email.trim() || !date || !time) {
      setError("Add your name, email, and pick an interview date and time.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const app = await submitApplication({
        data: {
          jobId: job.id,
          jobTitle: job.title,
          company: job.company,
          candidateName: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          note: note.trim(),
          interviewDate: date,
          interviewTime: time,
          interviewMode: job.interviewMode,
        },
      });
      cacheMyApplication(app);
      setBooked(app);
      onBooked(app);
    } catch {
      setError("Something went wrong booking your interview. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const field =
    "w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-lg">
        {booked ? (
          <div className="py-2 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
            <DialogHeader>
              <DialogTitle className="mt-4 text-center text-xl font-extrabold">
                Interview booked
              </DialogTitle>
            </DialogHeader>
            <p className="mt-2 text-sm text-muted-foreground">
              {booked.company} will meet you for the {booked.jobTitle} role.
            </p>
            <div className="tint-card mt-5 p-5 text-left text-sm">
              <p className="flex items-center gap-2 font-bold">
                <CalendarDays className="h-4 w-4 text-primary" />
                {pretty(booked.interviewDate)}
              </p>
              <p className="mt-2 flex items-center gap-2 font-bold">
                <Clock className="h-4 w-4 text-primary" />
                {booked.interviewTime} · {booked.interviewMode}
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                A confirmation was sent to {booked.email}.
              </p>
            </div>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <button
                onClick={() => downloadIcs(booked)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground"
              >
                <Download className="h-4 w-4" /> Add to calendar
              </button>
              <button
                onClick={() => onOpenChange(false)}
                className="flex-1 rounded-full border border-border px-5 py-3 text-sm font-bold"
              >
                Back to jobs
              </button>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-lg font-extrabold">Apply & book interview</DialogTitle>
            </DialogHeader>
            <p className="-mt-2 text-sm text-muted-foreground">
              {job.title} · {job.company}
            </p>

            <div className="mt-2 space-y-3">
              <input
                className={field}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
              />
              <input
                className={field}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                type="email"
              />
              <input
                className={field}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Mobile number"
              />
            </div>

            <div className="mt-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
                Pick an interview date
              </p>
              <div className="mt-2 rounded-2xl border border-border">
                <Calendar
                  mode="single"
                  selected={date ? toDate(date) : undefined}
                  onSelect={(d) => {
                    if (d) {
                      setDate(iso(d));
                      setTime("");
                    }
                  }}
                  disabled={(d) => !job.interviewDates.includes(iso(d))}
                  defaultMonth={job.interviewDates[0] ? toDate(job.interviewDates[0]) : undefined}
                  className={cn("p-3 pointer-events-auto")}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Available:{" "}
                {job.interviewDates
                  .map((d) =>
                    toDate(d).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
                  )
                  .join(" · ")}
              </p>
            </div>

            <div className="mt-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
                Choose a time
              </p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {job.interviewSlots.map((s) => (
                  <button
                    key={s}
                    onClick={() => setTime(s)}
                    className={`rounded-full px-3 py-2 text-xs font-bold ${s === time ? "bg-primary text-primary-foreground" : "border border-border bg-card"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              className={`${field} mt-4 min-h-20`}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Anything the hiring team should know? (optional)"
            />

            {error && <p className="mt-2 text-xs font-bold text-primary">{error}</p>}

            <button
              onClick={confirm}
              disabled={submitting}
              className="mt-4 w-full rounded-full bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground disabled:opacity-60"
            >
              {submitting ? "Booking…" : "Confirm application & interview"}
            </button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
