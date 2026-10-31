"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  FolderGit2,
  FileCode,
  FileText,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  ExternalLink,
  Code2,
  Terminal,
  Cpu,
  Star,
  GitBranch,
  GitCommit,
  Sparkles,
  Tag,
  Globe,
  Info,
  Clock,
  Check,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/8bit/button";
import { Badge } from "@/components/ui/8bit/badge";
import { Progress } from "@/components/ui/8bit/progress";
import { AiGeneratorModal } from "@/components/dashboard/AiGeneratorModal";
import { arcadeAudio } from "@/lib/sound/audio";

interface RepoDetailData {
  repo: string;
  owner: string;
  overallScore: number;
  grade: "S" | "A" | "B" | "C" | "D";
  metadata: {
    description: string | null;
    topics: string[];
    homepage: string | null;
    stars: number;
    forks: number;
    openIssues: number;
    defaultBranch: string;
    isArchived: boolean;
    hasDescription: boolean;
    hasTopics: boolean;
    hasHomepage: boolean;
  };
  nameQuality: {
    score: number;
    status: "excellent" | "good" | "generic" | "poor";
    isGeneric: boolean;
  };
  commitQuality: {
    score: number;
    totalAudited: number;
    conventionalCount: number;
    lazyCount: number;
    conventionalRatio: number;
    recentCommits: Array<{
      sha: string;
      message: string;
      date: string;
      author: string;
      isConventional: boolean;
      isLazy: boolean;
    }>;
  };
  structure: {
    hasPackageJson: boolean;
    hasGitignore: boolean;
    hasLicense: boolean;
    hasTests: boolean;
    hasDocs: boolean;
    hasSrc: boolean;
    hasWorkflows: boolean;
  };
  readmeStats: {
    exists: boolean;
    length: number;
    hasInstall: boolean;
    hasUsage: boolean;
    hasScreenshots: boolean;
    hasBadges: boolean;
  };
  files: Array<{ name: string; type: string; size: number }>;
  findings: Array<{
    severity: "critical" | "high" | "medium" | "low";
    category: "metadata" | "commits" | "readme" | "architecture" | "naming";
    title: string;
    description: string;
    fix: string;
  }>;
}

export default function RepositoryDeepAnalysisPage({
  params,
}: {
  params: Promise<{ username: string; repo: string }>;
}) {
  const resolvedParams = use(params);
  const rawUsername = resolvedParams.username;
  const rawRepo = resolvedParams.repo;
  const username = decodeURIComponent(rawUsername);
  const repo = decodeURIComponent(rawRepo);

  const [data, setData] = useState<RepoDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isReadmeModalOpen, setIsReadmeModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    async function loadRepoAnalysis() {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/audit/${encodeURIComponent(username)}/repo/${encodeURIComponent(repo)}`
        );
        if (!res.ok) {
          throw new Error("Failed to load repository audit");
        }
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || "Failed to inspect repository");
      } finally {
        setLoading(false);
      }
    }
    loadRepoAnalysis();
  }, [username, repo]);

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-20 flex flex-col items-center justify-center">
        <div className="w-14 h-14 border-4 border-neon-cyan border-t-transparent animate-spin mb-4" />
        <h2 className="font-['Press_Start_2P'] text-sm text-foreground">
          INSPECTING {repo.toUpperCase()}...
        </h2>
        <p className="font-mono text-xs text-muted-foreground mt-2">
          Auditing description, topics, commit history, and code hygiene
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="w-full max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="font-['Press_Start_2P'] text-lg text-destructive mb-3">
          REPOSITORY INSPECTION FAILED
        </h2>
        <p className="font-mono text-sm text-muted-foreground mb-6">{error}</p>
        <Link href={`/report/${encodeURIComponent(username)}`}>
          <Button className="bg-neon-cyan text-black font-bold">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  const filteredFindings = data.findings.filter((f) => {
    if (selectedCategory === "all") return true;
    return f.category === selectedCategory;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground flex-wrap">
          <Link href="/" className="hover:text-neon-cyan transition-colors">
            HOME
          </Link>
          <span>/</span>
          <Link
            href={`/report/${encodeURIComponent(username)}`}
            className="hover:text-neon-cyan transition-colors"
          >
            @{username}
          </Link>
          <span>/</span>
          <span className="text-foreground">REPOSITORIES</span>
          <span>/</span>
          <span className="text-neon-cyan font-bold">{repo}</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link href={`/audit/${encodeURIComponent(username)}`}>
            <Button
              size="sm"
              variant="outline"
              className="bg-card text-foreground border-border hover:border-primary text-xs whitespace-nowrap"
            >
              <Terminal className="w-3.5 h-3.5 mr-1 text-primary shrink-0" /> Full @{username} Audit
            </Button>
          </Link>

          <a
            href={`https://github.com/${username}/${repo}`}
            target="_blank"
            rel="noreferrer"
          >
            <Button
              variant="outline"
              size="sm"
              className="bg-card text-neon-cyan border-border hover:bg-muted text-xs whitespace-nowrap"
            >
              <ExternalLink className="w-3.5 h-3.5 mr-1 shrink-0" /> Open on GitHub
            </Button>
          </a>
        </div>
      </div>

      {/* SECTION 1: REPOSITORY HERO & COMPOSITE SCORE */}
      <div className="bg-card border-2 border-border p-6 relative overflow-hidden shadow-[0_0_25px_rgba(34,211,238,0.12)]">
        {/* Corner Pixel Accents */}
        <div className="absolute top-0 left-0 w-2.5 h-2.5 bg-neon-cyan" />
        <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-neon-pink" />
        <div className="absolute bottom-0 left-0 w-2.5 h-2.5 bg-neon-green" />
        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-neon-yellow" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Repo Name & Owner */}
          <div className="lg:col-span-2">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[10px] font-mono px-2 py-0.5 bg-secondary text-primary border border-border font-bold">
                REPOSITORY AUDIT
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 border font-bold ${
                  data.metadata.defaultBranch === "main"
                    ? "text-neon-green border-neon-green/40 bg-neon-green/10"
                    : "text-neon-yellow border-neon-yellow/40 bg-neon-yellow/10"
                }`}
              >
                BRANCH: {data.metadata.defaultBranch}
              </span>
              {data.metadata.isArchived && (
                <span className="text-[10px] font-mono px-2 py-0.5 text-destructive border border-destructive/40 bg-destructive/10 font-bold">
                  ARCHIVED
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 mb-2">
              <FolderGit2 className="w-7 h-7 text-neon-cyan shrink-0" />
              <h1 className="font-['Press_Start_2P'] text-base sm:text-xl text-foreground break-all">
                {repo}
              </h1>
            </div>

            <p className="font-mono text-xs text-muted-foreground flex items-center gap-4 flex-wrap mt-1">
              <span>OWNER: <strong className="text-neon-cyan">@{username}</strong></span>
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-neon-yellow" /> {data.metadata.stars} Stars
              </span>
              <span className="flex items-center gap-1">
                <GitBranch className="w-3.5 h-3.5" /> {data.metadata.forks} Forks
              </span>
            </p>
          </div>

          {/* Overall Health Score Badge */}
          <div className="bg-secondary border border-border p-5 text-center flex flex-col items-center justify-center">
            <span className="text-[10px] font-mono text-muted-foreground block mb-1">
              REPOSITORY HEALTH SCORE
            </span>
            <div className="font-['Space_Grotesk'] text-5xl font-bold text-foreground">
              {data.overallScore}
              <span className="text-lg text-muted-foreground font-mono">/100</span>
            </div>
            <div className="mt-2 inline-flex items-center gap-2">
              <span
                className={`px-2.5 py-0.5 font-['Press_Start_2P'] text-xs border ${
                  data.overallScore >= 75
                    ? "bg-neon-green/20 text-neon-green border-neon-green/50"
                    : data.overallScore >= 50
                    ? "bg-neon-yellow/20 text-neon-yellow border-neon-yellow/50"
                    : "bg-destructive/20 text-destructive border-destructive/50"
                }`}
              >
                RANK {data.grade}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: "ABOUT" SECTION AUDIT (Description, Topics, Website) */}
      <div className="bg-card border-2 border-border p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-neon-cyan" />
            <h3 className="font-['Press_Start_2P'] text-xs text-foreground">
              ABOUT SECTION AUDIT (METADATA &amp; DISCOVERABILITY)
            </h3>
          </div>
          <span className="text-xs font-mono text-muted-foreground">
            {data.metadata.hasDescription && data.metadata.hasTopics
              ? "✓ OPTIMIZED"
              : "⚠️ NEEDS ATTENTION"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Description Block */}
          <div className="p-4 bg-secondary border border-border space-y-2 md:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-foreground flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-neon-cyan" />
                REPOSITORY DESCRIPTION
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 border font-bold ${
                  data.metadata.hasDescription
                    ? "text-neon-green border-neon-green/40 bg-neon-green/10"
                    : "text-destructive border-destructive/40 bg-destructive/10"
                }`}
              >
                {data.metadata.hasDescription ? "CONFIGURED" : "MISSING"}
              </span>
            </div>

            {data.metadata.hasDescription ? (
              <p className="text-xs text-foreground font-mono leading-relaxed bg-background p-3 border border-border">
                "{data.metadata.description}"
              </p>
            ) : (
              <div className="p-3 bg-destructive/10 border border-destructive/40 text-xs font-mono text-destructive space-y-1">
                <p className="font-bold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> No description provided in About section.
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Click the gear icon next to 'About' on GitHub to add a 1-sentence summary so recruiters immediately know what this project does.
                </p>
              </div>
            )}
          </div>

          {/* Website / Live Demo Block */}
          <div className="p-4 bg-secondary border border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-foreground flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-neon-yellow" />
                LIVE DEMO URL
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 border font-bold ${
                  data.metadata.hasHomepage
                    ? "text-neon-green border-neon-green/40 bg-neon-green/10"
                    : "text-muted-foreground border-border bg-card"
                }`}
              >
                {data.metadata.hasHomepage ? "LINKED" : "NONE"}
              </span>
            </div>

            {data.metadata.hasHomepage ? (
              <a
                href={
                  data.metadata.homepage!.startsWith("http")
                    ? data.metadata.homepage!
                    : `https://${data.metadata.homepage}`
                }
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono text-neon-cyan hover:underline flex items-center gap-1 break-all bg-background p-2.5 border border-border block"
              >
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                {data.metadata.homepage}
              </a>
            ) : (
              <p className="text-[11px] font-mono text-muted-foreground bg-background p-2.5 border border-border">
                No deployment URL linked in the About section.
              </p>
            )}
          </div>
        </div>

        {/* Topics / Tags Block */}
        <div className="p-4 bg-secondary border border-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-foreground flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-primary" />
              GITHUB TOPICS / TAGS ({data.metadata.topics.length})
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 border font-bold ${
                data.metadata.hasTopics
                  ? "text-neon-green border-neon-green/40 bg-neon-green/10"
                  : "text-destructive border-destructive/40 bg-destructive/10"
              }`}
            >
              {data.metadata.hasTopics ? `${data.metadata.topics.length} TAGS` : "ZERO TOPICS"}
            </span>
          </div>

          {data.metadata.hasTopics ? (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {data.metadata.topics.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 bg-background border border-border text-xs font-mono text-neon-cyan font-bold"
                >
                  #{t}
                </span>
              ))}
            </div>
          ) : (
            <div className="p-3 bg-destructive/10 border border-destructive/40 text-xs font-mono text-destructive space-y-1">
              <p className="font-bold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" /> Zero GitHub topics configured.
              </p>
              <p className="text-[11px] text-muted-foreground">
                Topics like <code className="text-primary">nextjs</code>, <code className="text-primary">typescript</code>, or <code className="text-primary">auditor</code> help recruiters and search algorithms find and index your repository.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 3: REPO NAME QUALITY & COMMIT HYGIENE STUDIO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Name Quality Card */}
        <div className="bg-card border-2 border-border p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
              <h3 className="font-['Press_Start_2P'] text-xs text-foreground">
                NAME QUALITY
              </h3>
              <span
                className={`text-xs font-mono font-bold px-2 py-0.5 border ${
                  data.nameQuality.score >= 80
                    ? "text-neon-green border-neon-green/40 bg-neon-green/10"
                    : data.nameQuality.score >= 60
                    ? "text-neon-yellow border-neon-yellow/40 bg-neon-yellow/10"
                    : "text-destructive border-destructive/40 bg-destructive/10"
                }`}
              >
                {data.nameQuality.score}/100
              </span>
            </div>

            <div className="p-3 bg-secondary border border-border font-mono text-xs space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">NAME STATUS:</span>
                <span className="font-bold uppercase text-foreground">
                  {data.nameQuality.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">GENERIC NAME:</span>
                <span
                  className={`font-bold ${
                    data.nameQuality.isGeneric ? "text-destructive" : "text-neon-green"
                  }`}
                >
                  {data.nameQuality.isGeneric ? "YES (PENALTY)" : "NO (SEMANTIC)"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">CHARACTER LENGTH:</span>
                <span className="text-neon-cyan font-bold">{repo.length} chars</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground font-sans leading-relaxed">
              {data.nameQuality.isGeneric
                ? "Generic names like 'app' or 'test' look like abandoned tutorials to recruiters. Use semantic project names."
                : "Great naming convention! The repository name is descriptive, clear, and provides immediate context on what the codebase represents."}
            </p>
          </div>
        </div>

        {/* Commit Quality & Conventional Ratio Studio */}
        <div className="lg:col-span-2 bg-card border-2 border-border p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <GitCommit className="w-4 h-4 text-neon-green" />
              <h3 className="font-['Press_Start_2P'] text-xs text-foreground">
                COMMIT QUALITY &amp; GIT HYGIENE
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-neon-green">
              SCORE: {data.commitQuality.score}/100
            </span>
          </div>

          {/* Quick Commit Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
            <div className="p-3 bg-secondary border border-border">
              <span className="text-[10px] text-muted-foreground block">AUDITED COMMITS</span>
              <span className="text-sm font-bold text-foreground">
                {data.commitQuality.totalAudited}
              </span>
            </div>
            <div className="p-3 bg-secondary border border-border">
              <span className="text-[10px] text-muted-foreground block">CONVENTIONAL</span>
              <span className="text-sm font-bold text-neon-green">
                {data.commitQuality.conventionalRatio}%
              </span>
            </div>
            <div className="p-3 bg-secondary border border-border">
              <span className="text-[10px] text-muted-foreground block">LAZY / VAGUE</span>
              <span
                className={`text-sm font-bold ${
                  data.commitQuality.lazyCount > 0 ? "text-destructive" : "text-neon-green"
                }`}
              >
                {data.commitQuality.lazyCount}
              </span>
            </div>
            <div className="p-3 bg-secondary border border-border">
              <span className="text-[10px] text-muted-foreground block">DEFAULT BRANCH</span>
              <span className="text-sm font-bold text-neon-cyan">
                {data.metadata.defaultBranch}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5 font-mono text-xs pt-1">
            <div className="flex justify-between text-muted-foreground">
              <span>CONVENTIONAL COMMITS RATIO</span>
              <span className="text-neon-cyan font-bold">
                {data.commitQuality.conventionalCount} OF {data.commitQuality.totalAudited} COMMITS
              </span>
            </div>
            <Progress
              value={data.commitQuality.conventionalRatio}
              variant="retro"
              progressBg={
                data.commitQuality.conventionalRatio >= 70
                  ? "bg-neon-green"
                  : data.commitQuality.conventionalRatio >= 40
                  ? "bg-neon-yellow"
                  : "bg-destructive"
              }
              className="h-2.5"
            />
          </div>

          {/* Recent Commits Log */}
          <div className="pt-2">
            <span className="text-[10px] font-mono text-muted-foreground block mb-2 uppercase">
              Recent Commit Message Stream:
            </span>
            <div className="bg-background border border-border max-h-52 overflow-y-auto space-y-2 p-3 font-mono text-xs">
              {data.commitQuality.recentCommits.length === 0 ? (
                <p className="text-muted-foreground text-xs">No recent commits detected.</p>
              ) : (
                data.commitQuality.recentCommits.map((c) => (
                  <div
                    key={c.sha}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-border/40 last:border-none"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="text-primary font-bold text-[10px] shrink-0">
                        [{c.sha}]
                      </span>
                      <span className="truncate text-foreground text-xs">{c.message}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {c.isConventional ? (
                        <span className="text-[9px] px-1.5 py-0.2 bg-neon-green/20 text-neon-green border border-neon-green/40 font-bold whitespace-nowrap">
                          CONVENTIONAL
                        </span>
                      ) : c.isLazy ? (
                        <span className="text-[9px] px-1.5 py-0.2 bg-destructive/20 text-destructive border border-destructive/40 font-bold whitespace-nowrap">
                          LAZY / VAGUE
                        </span>
                      ) : (
                        <span className="text-[9px] px-1.5 py-0.2 bg-secondary text-muted-foreground border border-border whitespace-nowrap">
                          STANDARD
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: FILE STRUCTURE & DOCUMENTATION DEEP DIVE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Root File Structure */}
        <div className="bg-card border-2 border-border p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h3 className="font-['Press_Start_2P'] text-xs text-foreground">
              ROOT ARCHITECTURE
            </h3>
            <span className="text-[11px] font-mono text-muted-foreground">
              {data.files.length} items
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            {[
              { label: "README.md", ok: data.readmeStats.exists },
              { label: "License File", ok: data.structure.hasLicense },
              { label: ".gitignore", ok: data.structure.hasGitignore },
              { label: "Manifest / package.json", ok: data.structure.hasPackageJson },
              { label: "Source Directory (src/lib)", ok: data.structure.hasSrc },
              { label: "Tests Suite", ok: data.structure.hasTests },
              { label: "GitHub Actions CI/CD", ok: data.structure.hasWorkflows },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 bg-secondary border border-border"
              >
                <span className="text-muted-foreground">{item.label}</span>
                <span
                  className={`font-bold ${
                    item.ok ? "text-neon-green" : "text-destructive"
                  }`}
                >
                  {item.ok ? "PRESENT" : "MISSING"}
                </span>
              </div>
            ))}
          </div>

          {/* Root Files list */}
          <div className="pt-4 border-t border-border">
            <span className="text-[10px] font-mono text-muted-foreground block mb-2 uppercase">
              Root File Tree:
            </span>
            <div className="bg-background p-3 border border-border max-h-48 overflow-y-auto space-y-1 font-mono text-xs">
              {data.files.map((file, i) => (
                <div key={i} className="flex items-center justify-between text-muted-foreground">
                  <span className="truncate flex items-center gap-1.5">
                    {file.type === "dir" ? (
                      <span className="text-neon-cyan">📁</span>
                    ) : (
                      <span className="text-muted-foreground">📄</span>
                    )}
                    {file.name}
                  </span>
                  {file.size > 0 && (
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {Math.round(file.size / 1024)} KB
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Documentation & Actionable Findings */}
        <div className="lg:col-span-2 space-y-8">
          {/* Documentation Deep Dive */}
          <div className="bg-card border-2 border-border p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="font-['Press_Start_2P'] text-xs text-neon-cyan">
                DOCUMENTATION AUDIT
              </h3>
              <Button
                onClick={() => {
                  arcadeAudio.playClick();
                  setIsReadmeModalOpen(true);
                }}
                size="sm"
                className="bg-primary text-white hover:bg-primary/90 border-none text-xs font-mono font-bold whitespace-nowrap shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1 text-neon-cyan shrink-0" />
                Generate README with AI
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
              <div className="p-3 bg-secondary border border-border">
                <span className="text-[10px] text-muted-foreground block">README FOUND</span>
                <span
                  className={`text-sm font-bold ${
                    data.readmeStats.exists ? "text-neon-green" : "text-destructive"
                  }`}
                >
                  {data.readmeStats.exists ? "YES" : "NO"}
                </span>
              </div>
              <div className="p-3 bg-secondary border border-border">
                <span className="text-[10px] text-muted-foreground block">LENGTH</span>
                <span className="text-sm font-bold text-foreground">
                  {data.readmeStats.length} chars
                </span>
              </div>
              <div className="p-3 bg-secondary border border-border">
                <span className="text-[10px] text-muted-foreground block">SETUP GUIDE</span>
                <span
                  className={`text-sm font-bold ${
                    data.readmeStats.hasInstall ? "text-neon-green" : "text-neon-yellow"
                  }`}
                >
                  {data.readmeStats.hasInstall ? "VERIFIED" : "NONE"}
                </span>
              </div>
              <div className="p-3 bg-secondary border border-border">
                <span className="text-[10px] text-muted-foreground block">USAGE EXAMPLES</span>
                <span
                  className={`text-sm font-bold ${
                    data.readmeStats.hasUsage ? "text-neon-green" : "text-muted-foreground"
                  }`}
                >
                  {data.readmeStats.hasUsage ? "YES" : "NO"}
                </span>
              </div>
            </div>
          </div>

          {/* Actionable Findings & Fixes with Category Tabs */}
          <div className="bg-card border-2 border-border p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
              <h3 className="font-['Press_Start_2P'] text-xs text-neon-pink">
                DIAGNOSTIC FINDINGS ({data.findings.length})
              </h3>

              {/* Category Filter Chips */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
                {[
                  { id: "all", label: "ALL" },
                  { id: "metadata", label: "ABOUT & TOPICS" },
                  { id: "commits", label: "COMMITS" },
                  { id: "naming", label: "NAMING" },
                  { id: "readme", label: "README" },
                  { id: "architecture", label: "ARCHITECTURE" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      arcadeAudio.playClick();
                      setSelectedCategory(cat.id);
                    }}
                    className={`px-2 py-0.5 text-[10px] uppercase font-mono cursor-pointer border transition-colors whitespace-nowrap ${
                      selectedCategory === cat.id
                        ? "bg-neon-pink text-white border-neon-pink font-bold"
                        : "bg-secondary text-muted-foreground border-border hover:text-foreground"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {filteredFindings.length === 0 ? (
              <p className="text-xs font-mono text-neon-green p-4 bg-secondary border border-border">
                ✓ No flaws detected for this category. Outstanding engineering hygiene!
              </p>
            ) : (
              <div className="space-y-4">
                {filteredFindings.map((finding, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-secondary border-l-4 border-l-neon-pink border border-border space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.2 bg-background text-primary border border-border font-bold uppercase">
                          {finding.category}
                        </span>
                        <h4 className="text-xs font-mono font-bold text-foreground">
                          {finding.title}
                        </h4>
                      </div>
                      <span
                        className={`text-[10px] font-mono uppercase px-2 py-0.5 border font-bold ${
                          finding.severity === "critical"
                            ? "bg-destructive/20 text-destructive border-destructive/40"
                            : finding.severity === "high"
                            ? "bg-neon-pink/20 text-neon-pink border-neon-pink/40"
                            : finding.severity === "medium"
                            ? "bg-neon-yellow/20 text-neon-yellow border-neon-yellow/40"
                            : "bg-muted text-muted-foreground border-border"
                        }`}
                      >
                        {finding.severity}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {finding.description}
                    </p>

                    <div className="p-2.5 bg-background border border-border text-xs font-mono">
                      <span className="text-neon-green font-bold">&gt; Actionable Step: </span>
                      <span className="text-foreground">{finding.fix}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI README GENERATOR MODAL */}
      <AiGeneratorModal
        type="readme"
        isOpen={isReadmeModalOpen}
        onClose={() => setIsReadmeModalOpen(false)}
        repoData={{
          repo,
          owner: username,
          description: data.metadata.description,
          language: null,
          hasLicense: data.structure.hasLicense,
        }}
      />
    </div>
  );
}
