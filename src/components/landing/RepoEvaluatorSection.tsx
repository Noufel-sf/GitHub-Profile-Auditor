"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FolderGit2,
  Terminal,
  Search,
  CheckCircle2,
  FileCode,
  ShieldCheck,
  Workflow,
  Sparkles,
  ArrowRight,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/8bit/button";
import { arcadeAudio } from "@/lib/sound/audio";

const POPULAR_REPOS = [
  {
    owner: "Noufel-sf",
    repo: "GitHub-Profile-Auditor",
    label: "DevScope (Creator)",
    isCreator: true,
  },
  {
    owner: "shadcn",
    repo: "ui",
    label: "shadcn/ui",
  },
  {
    owner: "vercel",
    repo: "next.js",
    label: "vercel/next.js",
  },
  {
    owner: "facebook",
    repo: "react",
    label: "facebook/react",
  },
  {
    owner: "torvalds",
    repo: "linux",
    label: "torvalds/linux",
  },
];

const INSPECTION_METRICS = [
  {
    icon: FolderGit2,
    title: "ROOT STRUCTURE",
    desc: "Validates package.json, Cargo.toml, go.mod, .gitignore, and clean source code layout.",
    color: "text-neon-cyan border-neon-cyan/40 bg-neon-cyan/10",
  },
  {
    icon: FileCode,
    title: "README COMPLETENESS",
    desc: "Scans for setup quickstart, usage commands, architecture specs, and live deployment links.",
    color: "text-neon-green border-neon-green/40 bg-neon-green/10",
  },
  {
    icon: Workflow,
    title: "CI/CD AUTOMATION",
    desc: "Inspects .github/workflows for automated builds, linting, and continuous delivery.",
    color: "text-primary border-primary/40 bg-primary/10",
  },
  {
    icon: CheckCircle2,
    title: "TEST COVERAGE",
    desc: "Checks for test suites (Jest, Vitest, Pytest, Go) and test-to-code structural hygiene.",
    color: "text-neon-yellow border-neon-yellow/40 bg-neon-yellow/10",
  },
  {
    icon: ShieldCheck,
    title: "OSI LICENSING",
    desc: "Detects permissive open-source licenses (MIT, Apache 2.0, GPL) for recruiter safety.",
    color: "text-neon-pink border-neon-pink/40 bg-neon-pink/10",
  },
  {
    icon: Sparkles,
    title: "AI README STUDIO",
    desc: "Generate professional, recruiter-ready README.md docs with Gemini AI in one click.",
    color: "text-neon-cyan border-neon-cyan/40 bg-neon-cyan/10",
  },
];

export function RepoEvaluatorSection() {
  const router = useRouter();
  const [repoInput, setRepoInput] = useState("");
  const [error, setError] = useState("");

  const parseRepoInput = (input: string): { owner: string; repo: string } | null => {
    let clean = input.trim();
    if (!clean) return null;

    // Remove protocol and domain if present
    clean = clean
      .replace(/^https?:\/\/(www\.)?github\.com\//i, "")
      .replace(/^github\.com\//i, "")
      .replace(/^@/, "")
      .replace(/\.git$/i, "")
      .replace(/\/$/, "");

    const parts = clean.split("/").map((p) => p.trim()).filter(Boolean);
    if (parts.length >= 2) {
      return { owner: parts[0], repo: parts[1] };
    }
    return null;
  };

  const handleInspect = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseRepoInput(repoInput);

    if (!parsed) {
      setError("Please enter a valid format: owner/repo (e.g., shadcn/ui or Noufel-sf/GitHub-Profile-Auditor)");
      return;
    }

    setError("");
    arcadeAudio.playClick();
    router.push(
      `/report/${encodeURIComponent(parsed.owner)}/repository/${encodeURIComponent(parsed.repo)}`
    );
  };

  const handleQuickSelect = (owner: string, repo: string) => {
    setRepoInput(`${owner}/${repo}`);
    setError("");
    arcadeAudio.playClick();
    router.push(
      `/report/${encodeURIComponent(owner)}/repository/${encodeURIComponent(repo)}`
    );
  };

  return (
    <section
      id="repo-evaluator"
      className="w-full bg-secondary/50 border-y border-border py-20 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 bg-card border border-border text-xs font-mono text-neon-cyan">
            <span className="w-2 h-2 rounded-none bg-neon-cyan animate-pulse" />
            <span>SINGLE REPOSITORY AUDITOR // DEEP DIVE</span>
          </div>
          <h2 className="font-['Press_Start_2P'] text-xl sm:text-3xl text-foreground tracking-tight mb-4 leading-relaxed">
            EVALUATE A SPECIFIC REPO
          </h2>
          <p className="text-sm text-muted-foreground font-sans max-w-2xl mx-auto">
            Want to audit a single project instead of an entire profile? Inspect root file trees, README quality, test suites, and CI/CD automation for any public GitHub repository.
          </p>
        </div>

        {/* Input Box */}
        <div className="w-full max-w-3xl mx-auto bg-card border-2 border-border p-5 sm:p-6 relative mb-12 shadow-[0_0_25px_rgba(34,211,238,0.12)]">
          {/* Decorative Corner Pixels */}
          <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-neon-cyan" />
          <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-neon-pink" />
          <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-neon-green" />
          <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-neon-yellow" />

          <form onSubmit={handleInspect} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                <FolderGit2 className="w-5 h-5 text-neon-cyan" />
              </div>
              <input
                type="text"
                placeholder="owner/repository (e.g., shadcn/ui or Noufel-sf/GitHub-Profile-Auditor)"
                value={repoInput}
                onChange={(e) => {
                  setRepoInput(e.target.value);
                  if (error) setError("");
                }}
                className="w-full pl-10 pr-4 py-3 bg-background border border-border text-foreground font-mono text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="bg-primary text-white hover:bg-primary/90 border-none font-bold text-xs font-['Press_Start_2P'] py-4 px-6 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.4)] cursor-pointer whitespace-nowrap shrink-0"
            >
              <Terminal className="w-4 h-4 mr-1 text-neon-cyan shrink-0" />
              INSPECT REPO
            </Button>
          </form>

          {error && (
            <p className="text-left text-xs font-mono text-destructive mt-3 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
            </p>
          )}

          {/* Quick Repo Selectors */}
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-border/60 text-xs font-mono text-muted-foreground">
            <span className="text-foreground/80 font-bold whitespace-nowrap">SAMPLE REPOSITORIES:</span>
            {POPULAR_REPOS.map((item) => (
              <button
                key={`${item.owner}/${item.repo}`}
                type="button"
                onClick={() => handleQuickSelect(item.owner, item.repo)}
                className={`px-2.5 py-1 text-[11px] transition-all cursor-pointer border flex items-center gap-1.5 whitespace-nowrap ${
                  item.isCreator
                    ? "bg-neon-cyan/20 text-neon-cyan border-neon-cyan/60 font-bold hover:bg-neon-cyan/30 shadow-[0_0_10px_rgba(34,211,238,0.2)]"
                    : "bg-secondary hover:bg-muted text-foreground border-border hover:border-primary hover:text-neon-cyan"
                }`}
              >
                <span>{item.label}</span>
                {item.isCreator && (
                  <span className="px-1 py-0.2 bg-neon-cyan text-black text-[9px] font-bold">
                    CREATOR
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 6 Inspection Criteria Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INSPECTION_METRICS.map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.title}
                className="bg-card border-2 border-border p-5 flex flex-col justify-between hover:border-neon-cyan transition-all group shadow-[0_0_15px_rgba(0,0,0,0.15)]"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-9 h-9 border flex items-center justify-center shrink-0 ${metric.color}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-['Press_Start_2P'] text-[11px] text-foreground group-hover:text-neon-cyan transition-colors leading-snug">
                      {metric.title}
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed font-sans">
                    {metric.desc}
                  </p>
                </div>

                <div className="pt-3 mt-4 border-t border-border/60 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                  <span className="text-neon-green">✓ DETERMINISTIC</span>
                  <span className="text-primary font-bold">DEEP SCAN</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

