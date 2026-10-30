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
} from "lucide-react";
import { Button } from "@/components/ui/8bit/button";
import { Badge } from "@/components/ui/8bit/badge";
import { Progress } from "@/components/ui/8bit/progress";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/8bit/card";
import { OverallAuditReport, RepoAuditResult, FindingSeverity } from "@/types/audit";
import { GithubIcon } from "@/components/ui/icons";
import { AuditCharts } from "@/components/dashboard/AuditRadarChart";
import { ShareModal } from "@/components/dashboard/ShareModal";
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

  // Repo filter & sort states
  const [repoFilter, setRepoFilter] = useState<"all" | "best" | "needs_work" | "recent">("all");
  const [repoSort, setRepoSort] = useState<"score" | "stars" | "updated">("score");

  useEffect(() => {
    // Check if session data already has cached audit
    if (typeof window !== "undefined") {
      const cached = sessionStorage.getItem(`audit_${username.toLowerCase()}`);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setReport(parsed);
          setLoading(false);
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
        }
      } catch (e: any) {
        setError(e.message || "Failed to load audit");
      } finally {
        setLoading(false);
      }
    }

    fetchReport();
  }, [username]);

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#22D3EE] border-t-transparent animate-spin mb-6" />
        <h2 className="font-['Press_Start_2P'] text-lg text-[#F8FAFC] mb-2">
          COMPUTING AUDIT SCORECARD...
        </h2>
        <p className="font-mono text-xs text-[#707B9C]">
          Compiling category evidence for @{username}
        </p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="w-full max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 bg-[#EF4444]/20 border border-[#EF4444] text-[#EF4444] flex items-center justify-center mx-auto mb-4 font-bold">
          !
        </div>
        <h2 className="font-['Press_Start_2P'] text-xl text-[#F8FAFC] mb-3">
          AUDIT LOAD FAILED
        </h2>
        <p className="font-mono text-sm text-[#EF4444] mb-6">{error}</p>
        <Link href="/">
          <Button className="bg-[#22D3EE] text-[#080B20] font-bold">
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

  const getSeverityBadge = (severity: FindingSeverity) => {
    switch (severity) {
      case "critical":
        return <span className="px-2 py-0.5 bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40 font-mono text-[10px] font-bold uppercase">CRITICAL</span>;
      case "high":
        return <span className="px-2 py-0.5 bg-[#F97316]/20 text-[#F97316] border border-[#F97316]/40 font-mono text-[10px] font-bold uppercase">HIGH</span>;
      case "medium":
        return <span className="px-2 py-0.5 bg-[#FACC15]/20 text-[#FACC15] border border-[#FACC15]/40 font-mono text-[10px] font-bold uppercase">MEDIUM</span>;
      default:
        return <span className="px-2 py-0.5 bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/40 font-mono text-[10px] font-bold uppercase">LOW</span>;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#30395D]">
        <div className="flex items-center gap-2 text-xs font-mono text-[#707B9C]">
          <Link href="/" className="hover:text-[#22D3EE] transition-colors">
            HOME
          </Link>
          <span>/</span>
          <span className="text-[#F8FAFC]">AUDIT REPORT</span>
          <span>/</span>
          <span className="text-[#22D3EE]">@{report.username}</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={() => setIsShareOpen(true)}
            size="sm"
            className="bg-[#22D3EE] text-[#080B20] hover:bg-[#06b6d4] border-none text-xs font-mono font-bold"
          >
            <Share2 className="w-3.5 h-3.5 mr-1" />
            Share Badge
          </Button>

          <Link href={`/report/${encodeURIComponent(username)}/roadmap`}>
            <Button className="bg-[#A855F7] text-white hover:bg-[#9333ea] border-none text-xs font-['Press_Start_2P'] py-2.5 px-4 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
              <Trophy className="w-3.5 h-3.5 mr-1 text-[#FACC15]" />
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
              className="bg-[#111832] text-[#22D3EE] border-[#30395D] hover:bg-[#171F3D] text-xs"
            >
              <GithubIcon className="w-3.5 h-3.5 mr-1" /> View GitHub
            </Button>
          </a>
        </div>
      </div>

      {/* SECTION A: PROFILE HERO & OVERALL SCORE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-2 bg-[#111832] border-2 border-[#30395D] p-6 relative">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <img
              src={report.profile.avatar_url}
              alt={report.username}
              className="w-24 h-24 border-2 border-[#22D3EE] object-cover shrink-0 shadow-[0_0_15px_rgba(34,211,238,0.3)]"
            />
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-['Press_Start_2P'] text-lg sm:text-xl text-[#F8FAFC]">
                  {report.profile.name || report.profile.login}
                </h1>
                <span className="text-xs font-mono px-2 py-0.5 bg-[#22D3EE]/20 text-[#22D3EE] border border-[#22D3EE]/40 font-bold">
                  @{report.profile.login}
                </span>
              </div>

              {report.profile.bio ? (
                <p className="text-sm text-[#A5AEC9] leading-relaxed font-sans pt-1">
                  "{report.profile.bio}"
                </p>
              ) : (
                <p className="text-xs text-[#707B9C] italic">No public bio set</p>
              )}

              {/* Meta details */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#707B9C] pt-3">
                {report.profile.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#22D3EE]" /> {report.profile.location}
                  </span>
                )}
                {report.profile.blog && (
                  <a
                    href={report.profile.blog.startsWith("http") ? report.profile.blog : `https://${report.profile.blog}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[#22D3EE] hover:underline"
                  >
                    <LinkIcon className="w-3.5 h-3.5" /> {report.profile.blog.replace(/^https?:\/\//, "")}
                  </a>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#A855F7]" /> Joined{" "}
                  {new Date(report.profile.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Stat counters */}
          <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-[#202A4A] text-center font-mono">
            <div className="p-2.5 bg-[#0D1228] border border-[#202A4A]">
              <span className="text-[10px] text-[#707B9C] block">PUBLIC REPOS</span>
              <span className="text-lg font-bold text-[#F8FAFC]">{report.profile.public_repos}</span>
            </div>
            <div className="p-2.5 bg-[#0D1228] border border-[#202A4A]">
              <span className="text-[10px] text-[#707B9C] block">FOLLOWERS</span>
              <span className="text-lg font-bold text-[#22D3EE]">{report.profile.followers}</span>
            </div>
            <div className="p-2.5 bg-[#0D1228] border border-[#202A4A]">
              <span className="text-[10px] text-[#707B9C] block">FOLLOWING</span>
              <span className="text-lg font-bold text-[#A855F7]">{report.profile.following}</span>
            </div>
          </div>
        </div>

        {/* OVERALL SCORECARD */}
        <div className="bg-[#111832] border-2 border-[#30395D] p-6 flex flex-col justify-between relative overflow-hidden shadow-[0_0_20px_rgba(168,85,247,0.2)]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-['Press_Start_2P'] text-[#A855F7]">
              OVERALL SCORE
            </span>
            <div className="w-8 h-8 bg-[#A855F7]/20 border border-[#A855F7] flex items-center justify-center font-['Press_Start_2P'] text-sm text-[#F8FAFC]">
              {report.grade}
            </div>
          </div>

          <div className="my-auto text-center py-4">
            <div className="font-['Space_Grotesk'] text-6xl font-bold tracking-tight text-[#F8FAFC] flex items-baseline justify-center gap-1">
              <span>{report.overallScore}</span>
              <span className="text-xl text-[#707B9C] font-mono">/100</span>
            </div>
            <p className="font-['Press_Start_2P'] text-[11px] text-[#22D3EE] mt-3 tracking-wider">
              {report.gradeLabel}
            </p>
          </div>

          <div className="space-y-2 pt-4 border-t border-[#202A4A] text-xs font-mono">
            <div className="flex justify-between text-[#A5AEC9]">
              <span>DETERMINISTIC WEIGHTING</span>
              <span className="text-[#A3E635]">100% AUDITED</span>
            </div>
            <Progress
              value={report.overallScore}
              variant="retro"
              progressBg={report.overallScore >= 75 ? "bg-[#A3E635]" : report.overallScore >= 50 ? "bg-[#FACC15]" : "bg-[#EF4444]"}
              className="h-2.5"
            />
          </div>
        </div>
      </div>

      {/* SECTION B: AI EXECUTIVE ANALYSIS */}
      {report.aiAnalysis && (
        <div className="bg-gradient-to-r from-[#111832] via-[#171F3D] to-[#111832] border-2 border-[#30395D] p-6 relative">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-[#22D3EE]" />
            <span className="font-['Press_Start_2P'] text-xs text-[#22D3EE]">
              AI ARCHITECT SYNTHESIS
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-[#A855F7]/20 text-[#A855F7] border border-[#A855F7]/40 ml-auto">
              ARCHETYPE: {report.aiAnalysis.developerArchetype}
            </span>
          </div>

          <p className="text-sm text-[#F8FAFC] leading-relaxed mb-4 font-sans">
            {report.aiAnalysis.summary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#202A4A] text-xs font-mono">
            <div className="p-3 bg-[#080B20]/60 border border-[#202A4A]">
              <span className="text-[#A855F7] font-bold block mb-1">EXECUTIVE TAKEAWAY:</span>
              <p className="text-[#A5AEC9]">{report.aiAnalysis.executiveTakeaway}</p>
            </div>
            <div className="p-3 bg-[#080B20]/60 border border-[#202A4A]">
              <span className="text-[#22D3EE] font-bold block mb-1">INTERVIEW READINESS:</span>
              <p className="text-[#A5AEC9]">{report.aiAnalysis.interviewReadiness}</p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION B.2: INTERACTIVE VISUAL CHARTS */}
      <AuditCharts report={report} />

      {/* SECTION C: 5 CATEGORY CARDS */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-['Press_Start_2P'] text-sm sm:text-base text-[#F8FAFC]">
            CATEGORY SCORECARDS
          </h2>
          <span className="text-xs font-mono text-[#707B9C]">WEIGHTED TO 100%</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(report.categories).map(([key, cat]) => (
            <div
              key={key}
              className="bg-[#111832] border-2 border-[#30395D] p-5 flex flex-col justify-between hover:border-[#22D3EE] transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-['Press_Start_2P'] text-[#F8FAFC]">
                    {cat.title}
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 bg-[#171F3D] text-[#22D3EE] border border-[#30395D]">
                    {Math.round(cat.weight * 100)}%
                  </span>
                </div>

                <div className="flex items-baseline gap-2 mb-3">
                  <span className="font-['Space_Grotesk'] text-3xl font-bold text-[#F8FAFC]">
                    {cat.score}
                  </span>
                  <span className="text-xs font-mono text-[#707B9C]">/100</span>
                  <span
                    className={`text-[10px] font-mono ml-auto uppercase font-bold ${
                      cat.status === "exceptional"
                        ? "text-[#A3E635]"
                        : cat.status === "good"
                        ? "text-[#22D3EE]"
                        : "text-[#EF4444]"
                    }`}
                  >
                    [{cat.status.replace("_", " ")}]
                  </span>
                </div>

                <Progress
                  value={cat.score}
                  variant="retro"
                  progressBg={cat.score >= 75 ? "bg-[#A3E635]" : cat.score >= 50 ? "bg-[#FACC15]" : "bg-[#EF4444]"}
                  className="h-2 mb-4"
                />

                <p className="text-xs text-[#A5AEC9] leading-relaxed mb-4">
                  {cat.summary}
                </p>
              </div>

              {/* Individual checks list */}
              <div className="space-y-1.5 pt-3 border-t border-[#202A4A] text-[11px] font-mono">
                {cat.checks.map((check) => (
                  <div key={check.id} className="flex items-center justify-between text-[#A5AEC9]">
                    <span className="truncate pr-2">{check.name}</span>
                    <span
                      className={`font-bold ${
                        check.status === "pass"
                          ? "text-[#A3E635]"
                          : check.status === "warning"
                          ? "text-[#FACC15]"
                          : "text-[#EF4444]"
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
        <div className="bg-[#111832] border-2 border-[#30395D] p-6">
          <div className="flex items-center gap-2 mb-6 text-[#A3E635]">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="font-['Press_Start_2P'] text-xs sm:text-sm text-[#F8FAFC]">
              VERIFIED STRENGTHS ({report.strengths.length})
            </h3>
          </div>

          {report.strengths.length === 0 ? (
            <p className="text-xs font-mono text-[#707B9C]">
              No prominent strengths detected across the audited criteria.
            </p>
          ) : (
            <div className="space-y-4">
              {report.strengths.map((str) => (
                <div
                  key={str.id}
                  className="p-3.5 bg-[#0D1228] border-l-4 border-l-[#A3E635] border border-[#202A4A]"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-xs font-mono font-bold text-[#F8FAFC]">
                      {str.title}
                    </h4>
                    <span className="text-[10px] font-mono text-[#A3E635] uppercase">VERIFIED</span>
                  </div>
                  <p className="text-xs text-[#A5AEC9] mb-2">{str.description}</p>
                  <div className="text-[11px] font-mono text-[#707B9C] bg-[#080B20] p-2 border border-[#202A4A]">
                    <span className="text-[#22D3EE]">&gt; Evidence:</span> {str.evidence}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Weaknesses / Issues */}
        <div className="bg-[#111832] border-2 border-[#30395D] p-6">
          <div className="flex items-center gap-2 mb-6 text-[#EF4444]">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-['Press_Start_2P'] text-xs sm:text-sm text-[#F8FAFC]">
              AREAS FOR IMPROVEMENT ({report.weaknesses.length})
            </h3>
          </div>

          {report.weaknesses.length === 0 ? (
            <p className="text-xs font-mono text-[#A3E635]">
              Outstanding! No major deficiencies detected across audited metrics.
            </p>
          ) : (
            <div className="space-y-4">
              {report.weaknesses.map((weak) => (
                <div
                  key={weak.id}
                  className="p-3.5 bg-[#0D1228] border-l-4 border-l-[#EF4444] border border-[#202A4A]"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-xs font-mono font-bold text-[#F8FAFC]">
                      {weak.title}
                    </h4>
                    {getSeverityBadge(weak.severity)}
                  </div>
                  <p className="text-xs text-[#A5AEC9] mb-2">{weak.description}</p>
                  <div className="text-[11px] font-mono text-[#707B9C] bg-[#080B20] p-2 border border-[#202A4A] space-y-1">
                    <div>
                      <span className="text-[#EF4444]">&gt; Evidence:</span> {weak.evidence}
                    </div>
                    <div>
                      <span className="text-[#A3E635]">&gt; Recommended Fix:</span> {weak.recommendation}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SECTION E: REPOSITORY OVERVIEW */}
      <div className="bg-[#111832] border-2 border-[#30395D] p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#202A4A]">
          <div>
            <h3 className="font-['Press_Start_2P'] text-xs sm:text-sm text-[#F8FAFC] mb-1">
              REPOSITORY SCORECARDS ({filteredRepos.length})
            </h3>
            <p className="text-xs font-mono text-[#707B9C]">
              Click any repository for a deep file tree and architectural inspection
            </p>
          </div>

          {/* Filters & Sorting */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <div className="flex items-center gap-1 bg-[#080B20] p-1 border border-[#30395D]">
              <span className="text-[#707B9C] px-1">FILTER:</span>
              {(["all", "best", "needs_work", "recent"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setRepoFilter(mode)}
                  className={`px-2 py-1 uppercase text-[10px] cursor-pointer ${
                    repoFilter === mode
                      ? "bg-[#22D3EE] text-[#080B20] font-bold"
                      : "text-[#A5AEC9] hover:text-[#F8FAFC]"
                  }`}
                >
                  {mode.replace("_", " ")}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 bg-[#080B20] p-1 border border-[#30395D]">
              <span className="text-[#707B9C] px-1">SORT:</span>
              {(["score", "stars", "updated"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setRepoSort(mode)}
                  className={`px-2 py-1 uppercase text-[10px] cursor-pointer ${
                    repoSort === mode
                      ? "bg-[#A855F7] text-white font-bold"
                      : "text-[#A5AEC9] hover:text-[#F8FAFC]"
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
          {filteredRepos.map((repo) => (
            <Link
              key={repo.name}
              href={`/report/${encodeURIComponent(username)}/repository/${encodeURIComponent(repo.name)}`}
              className="group block"
            >
              <div className="h-full bg-[#0D1228] border border-[#202A4A] p-4 group-hover:border-[#22D3EE] transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-mono font-bold text-[#F8FAFC] group-hover:text-[#22D3EE] transition-colors truncate">
                      {repo.name}
                    </h4>
                    <span
                      className={`text-xs font-mono font-bold px-1.5 py-0.5 border ${
                        repo.score >= 80
                          ? "text-[#A3E635] border-[#A3E635]/40 bg-[#A3E635]/10"
                          : repo.score >= 60
                          ? "text-[#FACC15] border-[#FACC15]/40 bg-[#FACC15]/10"
                          : "text-[#EF4444] border-[#EF4444]/40 bg-[#EF4444]/10"
                      }`}
                    >
                      {repo.score}/100
                    </span>
                  </div>

                  <p className="text-xs text-[#A5AEC9] line-clamp-2 mb-4">
                    {repo.description || "No description provided."}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-[#202A4A] text-[11px] font-mono text-[#707B9C]">
                  {/* Indicators */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-1.5 py-0.2 border ${
                        repo.hasReadme
                          ? "text-[#A3E635] border-[#A3E635]/40"
                          : "text-[#EF4444] border-[#EF4444]/40"
                      }`}
                    >
                      README: {repo.hasReadme ? "YES" : "NO"}
                    </span>
                    <span
                      className={`px-1.5 py-0.2 border ${
                        repo.hasLicense
                          ? "text-[#A3E635] border-[#A3E635]/40"
                          : "text-[#707B9C] border-[#30395D]"
                      }`}
                    >
                      LIC: {repo.hasLicense ? "YES" : "NO"}
                    </span>
                    {repo.primaryLanguage && (
                      <span className="text-[#22D3EE] px-1.5 py-0.2 bg-[#171F3D] border border-[#30395D]">
                        {repo.primaryLanguage}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-[#F8FAFC]">
                        <Star className="w-3 h-3 text-[#FACC15]" /> {repo.stars}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitFork className="w-3 h-3" /> {repo.forks}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#A855F7] group-hover:translate-x-1 transition-transform inline-flex items-center">
                      Inspect &gt;
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* SHARE & EMBED BADGE MODAL */}
      <ShareModal
        username={username}
        score={report.overallScore}
        grade={report.grade}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />
    </div>
  );
}

