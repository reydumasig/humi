import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Sparkles, Upload, X } from "lucide-react";
import { extractResumeText } from "@/lib/api/resume.functions";
import type { ResumeInput } from "@/lib/humi/types";

const field =
  "w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm outline-none transition focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10";

interface Props {
  initial?: Partial<ResumeInput>;
  onSubmit: (input: ResumeInput, file?: File) => void;
}

export function ResumeUpload({ initial, onSubmit }: Props) {
  const [fileName, setFileName] = useState<string | undefined>(initial?.fileName);
  const [file, setFile] = useState<File>();
  const [manual, setManual] = useState(!!initial?.recentRole);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [data, setData] = useState<ResumeInput>({
    recentRole: initial?.recentRole ?? "",
    experienceSummary: initial?.experienceSummary ?? "",
    keySkills: initial?.keySkills ?? "",
    industries: initial?.industries ?? "",
  });
  const inputRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof ResumeInput>(k: K, v: ResumeInput[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  const accept = (candidate?: File) => {
    if (!candidate) return;
    if (!/\.(pdf|docx?|txt)$/i.test(candidate.name)) {
      setError("Please upload a PDF, DOC, DOCX or TXT file.");
      return;
    }
    setError("");
    setFileName(candidate.name);
    setFile(candidate);
  };

  const hasManualInput = data.recentRole.trim() || data.keySkills.trim();

  const submit = async () => {
    if (!fileName && !hasManualInput) {
      setError("Upload a resume or enter your experience manually to continue.");
      return;
    }

    if (!file) {
      onSubmit({ ...data, fileName }, file);
      return;
    }

    setExtracting(true);
    setError("");
    try {
      const form = new FormData();
      form.set("resume", file);
      const result = await extractResumeText({ data: form });
      if (!result.supported && !hasManualInput) {
        setError(
          "We couldn't read this file automatically — add a quick summary below so we get your profile right.",
        );
        setManual(true);
        return;
      }
      onSubmit({ ...data, fileName, resumeText: result.text }, file);
    } catch {
      onSubmit({ ...data, fileName }, file);
    } finally {
      setExtracting(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-5 py-10"
    >
      <div className="mx-auto max-w-2xl">
        <h2 className="text-2xl font-extrabold sm:text-3xl">Upload Your Resume</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Humi.ai will analyze your experience, skills, and previous roles to create your
          personalized career evolution profile.
        </p>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            accept(e.dataTransfer.files?.[0]);
          }}
          className={`mt-6 rounded-3xl border-2 border-dashed p-8 text-center transition ${
            dragging ? "border-primary bg-tint" : "border-[var(--color-border-soft)] bg-card"
          }`}
        >
          {fileName ? (
            <div className="flex items-center justify-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-tint text-primary">
                <FileText className="h-5 w-5" />
              </span>
              <div className="text-left">
                <p className="text-sm font-bold">{fileName}</p>
                <p className="text-xs text-muted-foreground">Ready to analyze</p>
              </div>
              <button
                onClick={() => {
                  setFileName(undefined);
                  setFile(undefined);
                }}
                className="ml-2 rounded-full p-2 text-muted-foreground transition hover:bg-secondary"
                aria-label="Remove file"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-tint text-primary">
                <Upload className="h-6 w-6" />
              </span>
              <p className="mt-4 text-sm font-semibold">Drag and drop your resume here</p>
              <p className="mt-1 text-xs text-muted-foreground">Accepted formats: PDF, DOC, DOCX</p>
              <button
                onClick={() => inputRef.current?.click()}
                className="mt-4 rounded-full border border-[var(--color-border-soft)] bg-tint px-5 py-2.5 text-sm font-bold text-primary transition hover:brightness-97"
              >
                Browse file
              </button>
              <input
                ref={inputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
                onChange={(e) => accept(e.target.files?.[0])}
              />
            </>
          )}
        </div>

        <button
          onClick={() => setManual((m) => !m)}
          className="mt-5 text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          Don't have a resume? Enter your experience manually
        </button>

        {manual && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 space-y-4 overflow-hidden"
          >
            <div>
              <label className="mb-1.5 block text-sm font-semibold">
                Most recent role / desired role
              </label>
              <input
                className={field}
                value={data.recentRole}
                onChange={(e) => set("recentRole", e.target.value)}
                maxLength={100}
                placeholder="Customer Service Representative"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold">Work experience summary</label>
              <textarea
                className={`${field} min-h-24`}
                value={data.experienceSummary}
                onChange={(e) => set("experienceSummary", e.target.value)}
                maxLength={800}
                placeholder="What did you do day to day?"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold">Key skills</label>
              <input
                className={field}
                value={data.keySkills}
                onChange={(e) => set("keySkills", e.target.value)}
                maxLength={300}
                placeholder="Communication, Excel, CRM, Reporting"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold">Industries of interest</label>
              <input
                className={field}
                value={data.industries}
                onChange={(e) => set("industries", e.target.value)}
                maxLength={200}
                placeholder="Banking, Technology, Retail"
              />
            </div>
          </motion.div>
        )}

        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

        <button
          onClick={submit}
          disabled={extracting}
          className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-base font-bold text-primary-foreground shadow-[var(--shadow-lift)] transition hover:brightness-110 disabled:opacity-60 sm:w-auto"
        >
          <Sparkles className="h-4 w-4" />
          {extracting ? "Reading your resume…" : "Analyze My Resume"}
        </button>

        <p className="mt-4 text-xs text-muted-foreground">
          Your resume is analyzed only to generate your career profile for this demo experience.
        </p>
      </div>
    </motion.section>
  );
}
