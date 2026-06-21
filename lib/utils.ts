import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ReadinessLevel } from "@/types/data-product";
import type { IncidentSeverity } from "@/types/incident";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getReadinessColor(level: ReadinessLevel): string {
  switch (level) {
    case "AI Ready": return "text-emerald-600";
    case "Conditionally Ready": return "text-amber-600";
    case "Needs Remediation": return "text-orange-600";
    case "High Risk": return "text-red-600";
  }
}

export function getReadinessBg(level: ReadinessLevel): string {
  switch (level) {
    case "AI Ready": return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Conditionally Ready": return "bg-amber-50 text-amber-700 border-amber-200";
    case "Needs Remediation": return "bg-orange-50 text-orange-700 border-orange-200";
    case "High Risk": return "bg-red-50 text-red-700 border-red-200";
  }
}

export function getScoreColor(score: number): string {
  if (score >= 90) return "text-emerald-600";
  if (score >= 75) return "text-amber-600";
  if (score >= 60) return "text-orange-600";
  return "text-red-600";
}

export function getScoreBarColor(score: number): string {
  if (score >= 90) return "bg-emerald-500";
  if (score >= 75) return "bg-amber-500";
  if (score >= 60) return "bg-orange-500";
  return "bg-red-500";
}

export function getReadinessFromScore(score: number): ReadinessLevel {
  if (score >= 90) return "AI Ready";
  if (score >= 75) return "Conditionally Ready";
  if (score >= 60) return "Needs Remediation";
  return "High Risk";
}

export function getSeverityColor(severity: IncidentSeverity): string {
  switch (severity) {
    case "critical": return "bg-red-50 text-red-700 border-red-200";
    case "high": return "bg-orange-50 text-orange-700 border-orange-200";
    case "medium": return "bg-amber-50 text-amber-700 border-amber-200";
    case "low": return "bg-blue-50 text-blue-700 border-blue-200";
  }
}

export function getSeverityDot(severity: IncidentSeverity): string {
  switch (severity) {
    case "critical": return "bg-red-500";
    case "high": return "bg-orange-500";
    case "medium": return "bg-amber-500";
    case "low": return "bg-blue-500";
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "open": return "bg-red-50 text-red-600 border-red-200";
    case "investigating": return "bg-orange-50 text-orange-600 border-orange-200";
    case "in-progress": return "bg-amber-50 text-amber-600 border-amber-200";
    case "resolved": return "bg-emerald-50 text-emerald-600 border-emerald-200";
    default: return "bg-slate-50 text-slate-600 border-slate-200";
  }
}

export function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date("2026-06-20T09:42:00Z");
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return "Less than 1 hour ago";
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
