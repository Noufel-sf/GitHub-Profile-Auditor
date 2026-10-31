import { OverallAuditReport } from "@/types/audit";

export interface StoredAuditRecord {
  username: string;
  name: string | null;
  avatarUrl: string;
  overallScore: number;
  grade: string;
  gradeLabel: string;
  topLanguage: string | null;
  publicRepos: number;
  followers: number;
  auditedAt: number; // timestamp
  previousScore?: number; // for calculating score difference
  scoreDiff?: number;
  isPinned?: boolean;
}

const STORAGE_KEY = "devscope_audit_history";

export function getAuditHistory(): StoredAuditRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: StoredAuditRecord[] = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Failed to parse audit history from localStorage", err);
    return [];
  }
}

export function saveAuditToHistory(report: OverallAuditReport): StoredAuditRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const history = getAuditHistory();
    const cleanUsername = report.username.toLowerCase();
    const existingIndex = history.findIndex(
      (item) => item.username.toLowerCase() === cleanUsername
    );

    let previousScore: number | undefined = undefined;
    let isPinned = false;

    if (existingIndex >= 0) {
      previousScore = history[existingIndex].overallScore;
      isPinned = !!history[existingIndex].isPinned;
      history.splice(existingIndex, 1);
    }

    const topLanguage =
      report.repositories.find((r) => r.primaryLanguage)?.primaryLanguage || null;

    const scoreDiff =
      previousScore !== undefined ? report.overallScore - previousScore : undefined;

    const newRecord: StoredAuditRecord = {
      username: report.username,
      name: report.profile.name,
      avatarUrl: report.profile.avatar_url,
      overallScore: report.overallScore,
      grade: report.grade,
      gradeLabel: report.gradeLabel,
      topLanguage,
      publicRepos: report.profile.public_repos,
      followers: report.profile.followers,
      auditedAt: Date.now(),
      previousScore,
      scoreDiff,
      isPinned,
    };

    // Pinned records stay at top, then sort by auditedAt
    const updated = [newRecord, ...history].slice(0, 30);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error("Failed to save audit history", err);
    return [];
  }
}

export function togglePinAudit(username: string): StoredAuditRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const history = getAuditHistory();
    const target = history.find(
      (h) => h.username.toLowerCase() === username.toLowerCase()
    );
    if (target) {
      target.isPinned = !target.isPinned;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    }
    return history;
  } catch (err) {
    console.error("Failed to toggle pin", err);
    return [];
  }
}

export function removeAuditFromHistory(username: string): StoredAuditRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const history = getAuditHistory().filter(
      (h) => h.username.toLowerCase() !== username.toLowerCase()
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    return history;
  } catch (err) {
    console.error("Failed to remove audit from history", err);
    return [];
  }
}

export function clearAuditHistory(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error("Failed to clear audit history", err);
  }
}

export function getPreviousAuditRecord(username: string): StoredAuditRecord | null {
  if (typeof window === "undefined") return null;
  const history = getAuditHistory();
  return (
    history.find((h) => h.username.toLowerCase() === username.toLowerCase()) || null
  );
}

