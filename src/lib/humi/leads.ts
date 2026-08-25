import type { Lead } from "./types";

const KEY = "humi.leads.v1";

export function getLeads(): Lead[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "[]") as Lead[];
  } catch {
    return [];
  }
}

export function saveLead(lead: Omit<Lead, "id" | "createdAt">): Lead {
  const full: Lead = { ...lead, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEY, JSON.stringify([full, ...getLeads()]));
  }
  return full;
}

export function clearLeads() {
  if (typeof window !== "undefined") window.localStorage.removeItem(KEY);
}
