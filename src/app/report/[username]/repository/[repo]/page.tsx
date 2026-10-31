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
} from "lucide-react";
import { Button } from "@/components/ui/8bit/button";
import { Badge } from "@/components/ui/8bit/badge";
import { Progress } from "@/components/ui/8bit/progress";
import { AiGeneratorModal } from "@/components/dashboard/AiGeneratorModal";
import { Sparkles } from "lucide-react";

interface RepoDetailData {
  repo: string;
  owner: string;
  files: Array<{ name: string; type: string; size: number }>;
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
  findings: Array<{
    severity: "critical" | "high" | "medium" | "low";
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
          Auditing file tree, README depth, and architectural hygiene
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

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground flex-wrap">
          <Link href="/" className="hover:text-neon-cyan transition-colors">
            HOME
          </Link>
          <span>/</span>
          <Link href={`/report/${encodeURIComponent(username)}`} className="hover:text-neon-cyan transition-colors">
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

      {/* REPO TITLE HEADER */}
      <div className="bg-card border-2 border-border p-6 relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <FolderGit2 className="w-6 h-6 text-neon-cyan" />
              <h1 className="font-['Press_Start_2P'] text-base sm:text-xl text-foreground">
                {repo}
              </h1>
            </div>
            <p className="font-mono text-xs text-muted-foreground">
              OWNER: @{username} • AUDITED BY DEVSCOPE ENGINE
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 font-mono text-xs font-bold border ${
                data.readmeStats.exists && data.structure.hasLicense
                  ? "bg-neon-green/20 text-neon-green border-neon-green/40"
                  : "bg-neon-yellow/20 text-neon-yellow border-neon-yellow/40"
              }`}
            >
              {data.readmeStats.exists && data.structure.hasLicense
                ? "HEALTH: HEALTHY"
                : "HEALTH: NEEDS ATTENTION"}
            </span>
          </div>
        </div>
      </div>

      {/* 2-COLUMN AUDIT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: File Tree Inspection */}
        <div className="bg-card border-2 border-border p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h3 className="font-['Press_Start_2P'] text-xs text-foreground">
              ROOT FILE STRUCTURE
            </h3>
            <span className="text-[11px] font-mono text-muted-foreground">
              {data.files.length} items
            </span>
          </div>

          {/* Key structural checks */}
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
              Detected Files in Root:
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

        {/* Right Col: Documentation & Actionable Findings */}
        <div className="lg:col-span-2 space-y-8">
          {/* Documentation Deep Dive */}
          <div className="bg-card border-2 border-border p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="font-['Press_Start_2P'] text-xs text-neon-cyan">
                DOCUMENTATION AUDIT
              </h3>
              <Button
                onClick={() => setIsReadmeModalOpen(true)}
                size="sm"
                className="bg-primary text-white hover:bg-primary/90 border-none text-xs font-mono font-bold"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1 text-neon-cyan" />
                Generate README with AI
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
              <div className="p-3 bg-secondary border border-border">
                <span className="text-[10px] text-muted-foreground block">README FOUND</span>
                <span className={`text-sm font-bold ${data.readmeStats.exists ? "text-neon-green" : "text-destructive"}`}>
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
                <span className={`text-sm font-bold ${data.readmeStats.hasInstall ? "text-neon-green" : "text-neon-yellow"}`}>
                  {data.readmeStats.hasInstall ? "VERIFIED" : "NONE"}
                </span>
              </div>
              <div className="p-3 bg-secondary border border-border">
                <span className="text-[10px] text-muted-foreground block">USAGE EXAMPLES</span>
                <span className={`text-sm font-bold ${data.readmeStats.hasUsage ? "text-neon-green" : "text-muted-foreground"}`}>
                  {data.readmeStats.hasUsage ? "YES" : "NO"}
                </span>
              </div>
            </div>
          </div>

          {/* Actionable Findings & Fixes */}
          <div className="bg-card border-2 border-border p-6 space-y-4">
            <h3 className="font-['Press_Start_2P'] text-xs text-neon-pink">
              ENGINEERING FINDINGS & RECOMMENDATIONS ({data.findings.length})
            </h3>

            {data.findings.length === 0 ? (
              <p className="text-xs font-mono text-neon-green">
                No critical flaws detected for this repository. Great engineering hygiene!
              </p>
            ) : (
              <div className="space-y-4">
                {data.findings.map((finding, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-secondary border-l-4 border-l-neon-pink border border-border space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-mono font-bold text-foreground">
                        {finding.title}
                      </h4>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-neon-pink/20 text-neon-pink border border-neon-pink/40 font-bold">
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
          description: null,
          language: null,
          hasLicense: data.structure.hasLicense,
        }}
      />
    </div>
  );
}

