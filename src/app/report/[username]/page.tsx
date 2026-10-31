"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  Trophy,
  Star,
  GitFork,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  AlertOctagon,
  ArrowRight,
  Sparkles,
  BookOpen,
  Calendar,
  MapPin,
  Link as LinkIcon,
  Users,
  Code,
  Layers,
  Activity,
  Filter,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Button } from "@/components/ui/8bit/button";
import { Badge } from "@/components/ui/8bit/badge";
import { Progress } from "@/components/ui/8bit/progress";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/8bit/card";
import { OverallAuditReport, RepoAuditResult, FindingSeverity } from "@/types/audit";
import { GithubIcon } from "@/components/ui/icons";
import { AuditCharts } from "@/components/dashboard/AuditRadarChart";
import { ShareModal } from "@/components/dashboard/ShareModal";
import { AiGeneratorModal } from "@/components/dashboard/AiGeneratorModal";
import { AuditHistorySection } from "@/components/dashboard/AuditHistorySection";
import { arcadeAudio } from "@/lib/sound/audio";
import {
  saveAuditToHistory,
  togglePinAudit,
  getPreviousAuditRecord,
} from "@/lib/storage/auditHistory";
import { Share2 } from "lucide-react";

export default function AuditReportPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const resolvedParams = use(params);
  const rawUsername = resolvedParams.username;
  const username = decodeURIComponent(rawUsername);

  const [report, setReport] = useState<OverallAuditReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isBioModalOpen, setIsBioModalOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [scoreDiff, setScoreDiff] = useState<number | null>(null);

  // Repo filter & sort states
  const [repoFilter, setRepoFilter] = useState<"all" | "best" | "needs_work" | "recent">("all");
  const [repoSort, setRepoSort] = useState<"score" | "stars" | "updated">("score");
  const [visibleRepoCount, setVisibleRepoCount] = useState(15);

  useEffect(() => {
    // Check if session data already has cached audit
    if (typeof window !== "undefined") {
      const existing = getPreviousAuditRecord(username);
      if (existing) {
        setIsPinned(!!existing.isPinned);
        if (existing.scoreDiff !== undefined) {
          setScoreDiff(existing.scoreDiff);
        }
      }

      const cached = sessionStorage.getItem(`audit_${username.toLowerCase()}`);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setReport(parsed);
          setLoading(false);
          saveAuditToHistory(parsed);
          return;
        } catch {
          // fallback to fetch
        }
      }
    }

    // Fetch from API
    async function fetchReport() {
      try {
        setLoading(true);
        const res = await fetch(`/api/audit/${encodeURIComponent(username)}`);
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || `Failed to load audit report for ${username}`);
        }
        const data: OverallAuditReport = await res.json();
        setReport(data);
        if (typeof window !== "undefined") {
          sessionStorage.setItem(`audit_${username.toLowerCase()}`, JSON.stringify(data));
          saveAuditToHistory(data);
          const rec = getPreviousAuditRecord(username);
          if (rec && rec.scoreDiff !== undefined) {
            setScoreDiff(rec.scoreDiff);
          }
        }
      } catch (e: any) {
        setError(e.message || "Failed to load audit");
      } finally {
        setLoading(false);
      }
    }

    fetchReport();
  }, [username]);

  const handleTogglePin = () => {
    arcadeAudio.playClick();
    const updated = togglePinAudit(username);
    const current = updated.find((u) => u.username.toLowerCase() === username.toLowerCase());
    setIsPinned(!!current?.isPinned);
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-neon-cyan border-t-transparent animate-spin mb-6" />
        <h2 className="font-['Press_Start_2P'] text-lg text-foreground mb-2">
          COMPUTING AUDIT SCORECARD...
        </h2>
        <p className="font-mono text-xs text-muted-foreground">
          Compiling category evidence for @{username}
        </p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="w-full max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 bg-destructive/20 border border-destructive text-destructive flex items-center justify-center mx-auto mb-4 font-bold">
          !
        </div>
        <h2 className="font-['Press_Start_2P'] text-xl text-foreground mb-3">
          AUDIT LOAD FAILED
        </h2>
        <p className="font-mono text-sm text-destructive mb-6">{error}</p>
        <Link href="/">
          <Button className="bg-neon-cyan text-black font-bold">
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  // Filter and sort repos
  const filteredRepos = report.repositories
    .filter((repo) => {
      if (repoFilter === "best") return repo.score >= 70;
      if (repoFilter === "needs_work") return repo.score < 70;
      if (repoFilter === "recent") {
        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
        return new Date(repo.updatedAt).getTime() > thirtyDaysAgo;
      }
      return true;
    })
    .sort((a, b) => {
      if (repoSort === "stars") return b.stars - a.stars;
      if (repoSort === "updated") return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      return b.score - a.score;
    });

  const visibleRepos = filteredRepos.slice(0, visibleRepoCount);
  const hasMoreRepos = filteredRepos.length > visibleRepoCount;

  const handleLoadMore = () => {
    arcadeAudio.playClick();
    setVisibleRepoCount((prev) => prev + 15);
  };

  const getSeverityBadge = (severity: FindingSeverity) => {
    switch (severity) {
      case "critical":
        return <span className="px-2 py-0.5 bg-destructive/20 text-destructive border border-destructive/40 font-mono text-[10px] font-bold uppercase">CRITICAL</span>;
      case "high":
        return <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 border border-orange-500/40 font-mono text-[10px] font-bold uppercase">HIGH</span>;
      case "medium":
        return <span className="px-2 py-0.5 bg-neon-yellow/20 text-neon-yellow border border-neon-yellow/40 font-mono text-[10px] font-bold uppercase">MEDIUM</span>;
      default:
        return <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500/40 font-mono text-[10px] font-bold uppercase">LOW</span>;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <Link href="/" className="hover:text-neon-cyan transition-colors">
            HOME
          </Link>
          <span>/</span>
          <span className="text-foreground">AUDIT REPORT</span>
          <span>/</span>
          <span className="text-neon-cyan">@{report.username}</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={handleTogglePin}
            size="sm"
            variant="outline"
            className={`border-border text-xs font-mono font-bold transition-all ${
              isPinned
                ? "bg-neon-yellow/20 text-neon-yellow border-neon-yellow/50"
                : "bg-card text-muted-foreground hover:text-neon-yellow hover:border-neon-yellow/40"
            }`}
          >
            <Star className={`w-3.5 h-3.5 mr-1 ${isPinned ? "fill-neon-yellow" : ""}`} />
            {isPinned ? "PINNED TO SQUAD" : "PIN PROFILE"}
          </Button>

          <Button
            onClick={() => setIsShareOpen(true)}
            size="sm"
            className="bg-neon-cyan text-black hover:bg-neon-cyan/80 border-none text-xs font-mono font-bold"
          >
            <Share2 className="w-3.5 h-3.5 mr-1" />
            Share Badge
          </Button>

          <Link href={`/report/${encodeURIComponent(username)}/roadmap`}>
            <Button className="bg-primary text-white hover:bg-primary/90 border-none text-xs font-['Press_Start_2P'] py-2.5 px-4 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
              <Trophy className="w-3.5 h-3.5 mr-1 text-neon-yellow" />
              RPG QUEST LOG ({report.roadmap.length})
            </Button>
          </Link>
          <a
            href={report.profile.html_url}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex"
          >
            <Button
              variant="outline"
              size="sm"
              className="bg-card text-neon-cyan border-border hover:bg-muted text-xs"
            >
              <GithubIcon className="w-3.5 h-3.5 mr-1" /> View GitHub
            </Button>
          </a>
        </div>
      </div>

      {/* SECTION A: PROFILE HERO & OVERALL SCORE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-2 bg-card border-2 border-border p-6 relative">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <img
              src={report.profile.avatar_url}
              alt={report.username}
              className="w-24 h-24 border-2 border-neon-cyan object-cover shrink-0 shadow-[0_0_15px_rgba(34,211,238,0.25)]"
            />
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-['Press_Start_2P'] text-lg sm:text-xl text-foreground">
                  {report.profile.name || report.profile.login}
                </h1>
                <span className="text-xs font-mono px-2 py-0.5 bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/40 font-bold">
                  @{report.profile.login}
                </span>
              </div>

              {report.profile.bio ? (
                <div className="pt-1">
                  <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                    "{report.profile.bio}"
                  </p>
                  <button
                    onClick={() => setIsBioModalOpen(true)}
                    className="text-[11px] font-mono text-primary hover:text-neon-cyan flex items-center gap-1 mt-1 cursor-pointer transition-colors"
                  >
                    <Sparkles className="w-3 h-3" /> Optimize bio with AI
                  </button>
                </div>
              ) : (
                <div className="pt-1 flex items-center gap-3">
                  <span className="text-xs text-muted-foreground italic">No public bio set</span>
                  <Button
                    size="sm"
                    onClick={() => setIsBioModalOpen(true)}
                    className="bg-primary text-white text-[10px] py-0.5 px-2 font-mono"
                  >
                    <Sparkles className="w-3 h-3 mr-1" /> Generate Bio with AI
                  </Button>
                </div>
              )}

              {/* Meta details */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted-foreground pt-3">
                {report.profile.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-neon-cyan" /> {report.profile.location}
                  </span>
                )}
                {report.profile.blog && (
                  <a
                    href={report.profile.blog.startsWith("http") ? report.profile.blog : `https://${report.profile.blog}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-neon-cyan hover:underline"
                  >
                    <LinkIcon className="w-3.5 h-3.5" /> {report.profile.blog.replace(/^https?:\/\//, "")}
                  </a>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-primary" /> Joined{" "}
                  {new Date(report.profile.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Stat counters */}
          <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-border text-center font-mono">
            <div className="p-2.5 bg-secondary border border-border">
              <span className="text-[10px] text-muted-foreground block">PUBLIC REPOS</span>
              <span className="text-lg font-bold text-foreground">{report.profile.public_repos}</span>
            </div>
            <div className="p-2.5 bg-secondary border border-border">
              <span className="text-[10px] text-muted-foreground block">FOLLOWERS</span>
              <span className="text-lg font-bold text-neon-cyan">{report.profile.followers}</span>
            </div>
            <div className="p-2.5 bg-secondary border border-border">
              <span className="text-[10px] text-muted-foreground block">FOLLOWING</span>
              <span className="text-lg font-bold text-primary">{report.profile.following}</span>
            </div>
          </div>
        </div>

        {/* OVERALL SCORECARD */}
        <div className="bg-card border-2 border-border p-6 flex flex-col justify-between relative overflow-hidden shadow-[0_0_20px_rgba(168,85,247,0.15)]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-['Press_Start_2P'] text-primary">
              OVERALL SCORE
            </span>
            <div className="w-8 h-8 bg-primary/20 border border-primary flex items-center justify-center font-['Press_Start_2P'] text-sm text-foreground">
              {report.grade}
            </div>
          </div>

          <div className="my-auto text-center py-4">
            <div className="font-['Space_Grotesk'] text-6xl font-bold tracking-tight text-foreground flex items-baseline justify-center gap-1">
              <span>{report.overallScore}</span>
              <span className="text-xl text-muted-foreground font-mono">/100</span>
            </div>
            <p className="font-['Press_Start_2P'] text-[11px] text-neon-cyan mt-3 tracking-wider">
              {report.gradeLabel}
            </p>
            {scoreDiff !== null && scoreDiff !== 0 && (
              <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold bg-background border border-border">
                {scoreDiff > 0 ? (
                  <span className="text-neon-green flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> +{scoreDiff} PTS SINCE LAST AUDIT
                  </span>
                ) : (
                  <span className="text-destructive flex items-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5" /> {scoreDiff} PTS SINCE LAST AUDIT
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2 pt-4 border-t border-border text-xs font-mono">
            <div className="flex justify-between text-muted-foreground">
              <span>DETERMINISTIC WEIGHTING</span>
              <span className="text-neon-green">100% AUDITED</span>
            </div>
            <Progress
              value={report.overallScore}
              variant="retro"
              progressBg={report.overallScore >= 75 ? "bg-neon-green" : report.overallScore >= 50 ? "bg-neon-yellow" : "bg-destructive"}
              className="h-2.5"
            />
          </div>
        </div>
      </div>

      {/* SECTION B: AI EXECUTIVE ANALYSIS */}
      {report.aiAnalysis && (
        <div className="bg-card border-2 border-border p-6 relative">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-neon-cyan" />
            <span className="font-['Press_Start_2P'] text-xs text-neon-cyan">
              AI ARCHITECT SYNTHESIS
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-primary/20 text-primary border border-primary/40 ml-auto">
              ARCHETYPE: {report.aiAnalysis.developerArchetype}
            </span>
          </div>

          <p className="text-sm text-foreground leading-relaxed mb-4 font-sans">
            {report.aiAnalysis.summary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border text-xs font-mono">
            <div className="p-3 bg-secondary border border-border">
              <span className="text-primary font-bold block mb-1">EXECUTIVE TAKEAWAY:</span>
              <p className="text-muted-foreground">{report.aiAnalysis.executiveTakeaway}</p>
            </div>
            <div className="p-3 bg-secondary border border-border">
              <span className="text-neon-cyan font-bold block mb-1">INTERVIEW READINESS:</span>
              <p className="text-muted-foreground">{report.aiAnalysis.interviewReadiness}</p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION B.2: INTERACTIVE VISUAL CHARTS */}
      <AuditCharts report={report} />

      {/* SECTION C: 5 CATEGORY CARDS */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-['Press_Start_2P'] text-sm sm:text-base text-foreground">
            CATEGORY SCORECARDS
          </h2>
          <span className="text-xs font-mono text-muted-foreground">WEIGHTED TO 100%</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(report.categories).map(([key, cat]) => (
            <div
              key={key}
              className="bg-card border-2 border-border p-5 flex flex-col justify-between hover:border-neon-cyan transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-['Press_Start_2P'] text-foreground">
                    {cat.title}
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 bg-muted text-neon-cyan border border-border">
                    {Math.round(cat.weight * 100)}%
                  </span>
                </div>

                <div className="flex items-baseline gap-2 mb-3">
                  <span className="font-['Space_Grotesk'] text-3xl font-bold text-foreground">
                    {cat.score}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">/100</span>
                  <span
                    className={`text-[10px] font-mono ml-auto uppercase font-bold ${
                      cat.status === "exceptional"
                        ? "text-neon-green"
                        : cat.status === "good"
                        ? "text-neon-cyan"
                        : "text-destructive"
                    }`}
                  >
                    [{cat.status.replace("_", " ")}]
                  </span>
                </div>

                <Progress
                  value={cat.score}
                  variant="retro"
                  progressBg={cat.score >= 75 ? "bg-neon-green" : cat.score >= 50 ? "bg-neon-yellow" : "bg-destructive"}
                  className="h-2 mb-4"
                />

                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  {cat.summary}
                </p>
              </div>

              {/* Individual checks list */}
              <div className="space-y-1.5 pt-3 border-t border-border text-[11px] font-mono">
                {cat.checks.map((check) => (
                  <div key={check.id} className="flex items-center justify-between text-muted-foreground">
                    <span className="truncate pr-2">{check.name}</span>
                    <span
                      className={`font-bold ${
                        check.status === "pass"
                          ? "text-neon-green"
                          : check.status === "warning"
                          ? "text-neon-yellow"
                          : "text-destructive"
                      }`}
                    >
                      {check.status === "pass" ? "PASS" : check.status === "warning" ? "WARN" : "FAIL"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION D: STRENGTHS & WEAKNESSES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Strengths */}
        <div className="bg-card border-2 border-border p-6">
          <div className="flex items-center gap-2 mb-6 text-neon-green">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="font-['Press_Start_2P'] text-xs sm:text-sm text-foreground">
              VERIFIED STRENGTHS ({report.strengths.length})
            </h3>
          </div>

          {report.strengths.length === 0 ? (
            <p className="text-xs font-mono text-muted-foreground">
              No prominent strengths detected across the audited criteria.
            </p>
          ) : (
            <div className="space-y-4">
              {report.strengths.map((str) => (
                <div
                  key={str.id}
                  className="p-3.5 bg-secondary border-l-4 border-l-neon-green border border-border"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-xs font-mono font-bold text-foreground">
                      {str.title}
                    </h4>
                    <span className="text-[10px] font-mono text-neon-green uppercase">VERIFIED</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{str.description}</p>
                  <div className="text-[11px] font-mono text-muted-foreground bg-background p-2 border border-border">
                    <span className="text-neon-cyan">&gt; Evidence:</span> {str.evidence}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Weaknesses / Issues */}
        <div className="bg-card border-2 border-border p-6">
          <div className="flex items-center gap-2 mb-6 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-['Press_Start_2P'] text-xs sm:text-sm text-foreground">
              AREAS FOR IMPROVEMENT ({report.weaknesses.length})
            </h3>
          </div>

          {report.weaknesses.length === 0 ? (
            <p className="text-xs font-mono text-neon-green">
              Outstanding! No major deficiencies detected across audited metrics.
            </p>
          ) : (
            <div className="space-y-4">
              {report.weaknesses.map((weak) => (
                <div
                  key={weak.id}
                  className="p-3.5 bg-secondary border-l-4 border-l-destructive border border-border"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-xs font-mono font-bold text-foreground">
                      {weak.title}
                    </h4>
                    {getSeverityBadge(weak.severity)}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{weak.description}</p>
                  <div className="text-[11px] font-mono text-muted-foreground bg-background p-2 border border-border space-y-1">
                    <div>
                      <span className="text-destructive">&gt; Evidence:</span> {weak.evidence}
                    </div>
                    <div>
                      <span className="text-neon-green">&gt; Recommended Fix:</span> {weak.recommendation}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SECTION E: REPOSITORY OVERVIEW */}
      <div className="bg-card border-2 border-border p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
          <div>
            <h3 className="font-['Press_Start_2P'] text-xs sm:text-sm text-foreground mb-1">
              REPOSITORY SCORECARDS ({filteredRepos.length})
            </h3>
            <p className="text-xs font-mono text-muted-foreground">
              Click any repository for a deep file tree and architectural inspection
            </p>
          </div>

          {/* Filters & Sorting */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <div className="flex items-center gap-1 bg-background p-1 border border-border">
              <span className="text-muted-foreground px-1">FILTER:</span>
              {(["all", "best", "needs_work", "recent"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    arcadeAudio.playClick();
                    setRepoFilter(mode);
                    setVisibleRepoCount(15);
                  }}
                  className={`px-2 py-1 uppercase text-[10px] cursor-pointer ${
                    repoFilter === mode
                      ? "bg-neon-cyan text-black font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {mode.replace("_", " ")}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 bg-background p-1 border border-border">
              <span className="text-muted-foreground px-1">SORT:</span>
              {(["score", "stars", "updated"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    arcadeAudio.playClick();
                    setRepoSort(mode);
                    setVisibleRepoCount(15);
                  }}
                  className={`px-2 py-1 uppercase text-[10px] cursor-pointer ${
                    repoSort === mode
                      ? "bg-primary text-white font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Repository Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleRepos.map((repo) => (
            <Link
              key={repo.name}
              href={`/report/${encodeURIComponent(username)}/repository/${encodeURIComponent(repo.name)}`}
              className="group block"
            >
              <div className="h-full bg-secondary border border-border p-4 group-hover:border-neon-cyan transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-mono font-bold text-foreground group-hover:text-neon-cyan transition-colors truncate">
                      {repo.name}
                    </h4>
                    <span
                      className={`text-xs font-mono font-bold px-1.5 py-0.5 border ${
                        repo.score >= 80
                          ? "text-neon-green border-neon-green/40 bg-neon-green/10"
                          : repo.score >= 60
                          ? "text-neon-yellow border-neon-yellow/40 bg-neon-yellow/10"
                          : "text-destructive border-destructive/40 bg-destructive/10"
                      }`}
                    >
                      {repo.score}/100
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                    {repo.description || "No description provided."}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-border text-[11px] font-mono text-muted-foreground">
                  {/* Indicators */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-1.5 py-0.2 border ${
                        repo.hasReadme
                          ? "text-neon-green border-neon-green/40"
                          : "text-destructive border-destructive/40"
                      }`}
                    >
                      README: {repo.hasReadme ? "YES" : "NO"}
                    </span>
                    <span
                      className={`px-1.5 py-0.2 border ${
                        repo.hasLicense
                          ? "text-neon-green border-neon-green/40"
                          : "text-muted-foreground border-border"
                      }`}
                    >
                      LIC: {repo.hasLicense ? "YES" : "NO"}
                    </span>
                    {repo.primaryLanguage && (
                      <span className="text-neon-cyan px-1.5 py-0.2 bg-muted border border-border">
                        {repo.primaryLanguage}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-foreground">
                        <Star className="w-3 h-3 text-neon-yellow" /> {repo.stars}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitFork className="w-3 h-3" /> {repo.forks}
                      </span>
                    </div>
                    <span className="text-[10px] text-primary group-hover:translate-x-1 transition-transform inline-flex items-center">
                      Inspect &gt;
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination / Load More Controls */}
        {hasMoreRepos ? (
          <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs font-mono text-muted-foreground">
              SHOWING <strong className="text-foreground">{visibleRepos.length}</strong> OF{" "}
              <strong className="text-neon-cyan">{filteredRepos.length}</strong> REPOSITORIES
            </span>
            <Button
              onClick={handleLoadMore}
              className="bg-primary text-white hover:bg-primary/90 font-['Press_Start_2P'] text-[11px] py-3 px-6 shadow-[0_0_15px_rgba(168,85,247,0.35)] cursor-pointer"
            >
              LOAD MORE REPOSITORIES (+15)
            </Button>
          </div>
        ) : filteredRepos.length > 15 ? (
          <div className="mt-8 pt-6 border-t border-border text-center font-mono text-xs text-muted-foreground">
            <span className="inline-block px-3 py-1 bg-secondary border border-border text-neon-green">
              ✓ ALL {filteredRepos.length} REPOSITORIES LOADED
            </span>
          </div>
        ) : null}
      </div>

      {/* SECTION F: AUDIT HISTORY & SQUAD TRACKER */}
      <AuditHistorySection currentUsername={username} />

      {/* SHARE & EMBED BADGE MODAL */}
      <ShareModal
        username={username}
        score={report.overallScore}
        grade={report.grade}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />

      {/* AI BIO GENERATOR MODAL */}
      <AiGeneratorModal
        type="bio"
        isOpen={isBioModalOpen}
        onClose={() => setIsBioModalOpen(false)}
        userData={{
          username: report.username,
          languages: report.repositories.map((r) => r.primaryLanguage).filter(Boolean) as string[],
          strengths: report.strengths.map((s) => s.title),
        }}
      />
    </div>
  );
}

