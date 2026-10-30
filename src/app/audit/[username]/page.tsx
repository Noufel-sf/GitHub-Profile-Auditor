"use client";

import { useEffect, useState, use, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Terminal,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Cpu,
  Layers,
  Database,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/8bit/button";
import { Progress } from "@/components/ui/8bit/progress";
import { OverallAuditReport } from "@/types/audit";

const AUDIT_STAGES = [
  { id: 1, name: "Connecting to GitHub API & Profile", delay: 800 },
  { id: 2, name: "Retrieving Public Repositories", delay: 1000 },
  { id: 3, name: "Inspecting Repository Metadata & Branches", delay: 1000 },
  { id: 4, name: "Analyzing README & Documentation Depth", delay: 1200 },
  { id: 5, name: "Inspecting CI/CD Workflows & Licenses", delay: 1000 },
  { id: 6, name: "Evaluating Engineering Indicators", delay: 1000 },
  { id: 7, name: "Running Gemini Architectural Synthesis", delay: 1200 },
  { id: 8, name: "Finalizing Report & RPG Quest Log", delay: 800 },
];

export default function AuditExperiencePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const resolvedParams = use(params);
  const rawUsername = resolvedParams.username;
  const username = decodeURIComponent(rawUsername);
  const router = useRouter();

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportData, setReportData] = useState<OverallAuditReport | null>(null);

  const addLog = (msg: string) => {
    const timestamp = new Date().toISOString().substring(11, 19);
    setLogs((prev) => [...prev, `[${timestamp}] ${msg}`]);
  };

  useEffect(() => {
    let isCancelled = false;

    async function runAudit() {
      setError(null);
      addLog(`INIT: DevScope audit initialized for user @${username}`);
      addLog("CONFIG: Deterministic engine weights loaded (15/30/25/15/15)");

      try {
        // Start stages animation while fetching actual API
        addLog("GITHUB_API: Requesting /users/" + username);
        setCurrentStageIndex(1);

        const res = await fetch(`/api/audit/${encodeURIComponent(username)}`);
        if (!res.ok) {
          const errJson = await res.json().catch(() => ({}));
          throw new Error(errJson.error || `Failed to audit @${username} (HTTP ${res.status})`);
        }

        const data: OverallAuditReport = await res.json();
        if (isCancelled) return;
        setReportData(data);

        // Advance through simulated audit inspection stages with real data injected into logs
        addLog(`PROFILE: Found ${data.profile.name || username} (${data.profile.public_repos} public repos, ${data.profile.followers} followers)`);
        setCurrentStageIndex(2);
        await new Promise((r) => setTimeout(r, 700));

        addLog(`REPOS: Inspected ${data.repositories.length} public codebases`);
        data.repositories.slice(0, 3).forEach((r) => {
          addLog(`  -> repo: ${r.name} [stars: ${r.stars}, lang: ${r.primaryLanguage || "None"}]`);
        });
        setCurrentStageIndex(3);
        await new Promise((r) => setTimeout(r, 800));

        addLog("DOCS: Verifying README coverage and installation setup instructions");
        const docPassCount = data.repositories.filter((r) => r.hasReadme).length;
        addLog(`DOCS: ${docPassCount}/${data.repositories.length} repositories contain markdown documentation`);
        setCurrentStageIndex(4);
        await new Promise((r) => setTimeout(r, 800));

        addLog("HYGIENE: Inspecting licenses, .gitignore, and GitHub Actions workflows");
        const licCount = data.repositories.filter((r) => r.hasLicense).length;
        addLog(`HYGIENE: Open-source licenses verified in ${licCount} projects`);
        setCurrentStageIndex(5);
        await new Promise((r) => setTimeout(r, 700));

        addLog(`ENGINE: Calculating deterministic score: ${data.overallScore}/100 (Grade ${data.grade})`);
        setCurrentStageIndex(6);
        await new Promise((r) => setTimeout(r, 700));

        addLog("AI_AGENT: Synthesizing executive recommendations and RPG quests");
        addLog(`ROADMAP: Generated ${data.roadmap.length} gamified quests`);
        setCurrentStageIndex(7);
        await new Promise((r) => setTimeout(r, 800));

        addLog("STATUS: Audit complete! Report ready for viewing.");
        setIsComplete(true);

        // Store data in sessionStorage for instant retrieval on report page
        if (typeof window !== "undefined") {
          sessionStorage.setItem(`audit_${username.toLowerCase()}`, JSON.stringify(data));
        }

        // Auto-navigate after short confirmation
        setTimeout(() => {
          router.push(`/report/${encodeURIComponent(username)}`);
        }, 1200);
      } catch (err: any) {
        if (isCancelled) return;
        setError(err.message || "An unexpected error occurred during audit");
        addLog(`FATAL_ERROR: ${err.message}`);
      }
    }

    runAudit();

    return () => {
      isCancelled = true;
    };
  }, [username, router]);

  const progressPercentage = Math.round(((currentStageIndex + 1) / AUDIT_STAGES.length) * 100);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-12 flex flex-col items-center">
      {/* Top Breadcrumb */}
      <div className="w-full flex items-center justify-between mb-8 pb-4 border-b border-border">
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <Link href="/" className="hover:text-neon-cyan transition-colors">
            HOME
          </Link>
          <span>/</span>
          <span className="text-foreground">AUDIT</span>
          <span>/</span>
          <span className="text-neon-cyan">@{username}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
          <span className="text-xs font-mono text-neon-cyan">LIVE AUDIT SESSION</span>
        </div>
      </div>

      {/* Main Terminal Box */}
      <div className="w-full bg-card border-2 border-border shadow-[0_0_30px_rgba(34,211,238,0.1)] relative overflow-hidden">
        {/* Decorative corner pixels */}
        <div className="absolute top-0 left-0 w-2 h-2 bg-neon-cyan" />
        <div className="absolute top-0 right-0 w-2 h-2 bg-neon-pink" />
        <div className="absolute bottom-0 left-0 w-2 h-2 bg-neon-green" />
        <div className="absolute bottom-0 right-0 w-2 h-2 bg-neon-yellow" />

        {/* Terminal Header */}
        <div className="bg-background px-4 py-3 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-destructive" />
            <div className="w-3 h-3 bg-neon-yellow" />
            <div className="w-3 h-3 bg-neon-green" />
            <span className="text-xs font-['Press_Start_2P'] text-foreground ml-2">
              DEVSCOPE_ANALYZER // @{username}
            </span>
          </div>
          <span className="text-[11px] font-mono text-primary font-bold">
            {progressPercentage}% COMPLETE
          </span>
        </div>

        {/* Progress Section */}
        <div className="p-6 bg-secondary border-b border-border">
          <div className="flex items-center justify-between mb-3 text-xs font-mono">
            <span className="text-muted-foreground">CURRENT STAGE:</span>
            <span className="text-neon-cyan font-bold">
              [{currentStageIndex + 1}/{AUDIT_STAGES.length}] {AUDIT_STAGES[currentStageIndex]?.name}
            </span>
          </div>
          <Progress
            value={progressPercentage}
            variant="retro"
            progressBg="bg-neon-cyan"
            className="h-3"
          />
        </div>

        {/* Stages Checklist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-6 bg-background/60 border-b border-border text-xs font-mono">
          {AUDIT_STAGES.map((stage, idx) => {
            const isDone = idx < currentStageIndex || isComplete;
            const isCurrent = idx === currentStageIndex && !isComplete && !error;
            return (
              <div
                key={stage.id}
                className={`p-2.5 border flex items-center gap-2.5 transition-colors ${
                  isDone
                    ? "bg-card border-neon-cyan/40 text-foreground"
                    : isCurrent
                    ? "bg-muted border-primary text-neon-cyan"
                    : "bg-background border-border text-muted-foreground"
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-neon-green shrink-0" />
                ) : isCurrent ? (
                  <RefreshCw className="w-4 h-4 text-primary animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 border border-border shrink-0 flex items-center justify-center text-[9px] text-muted-foreground">
                    {stage.id}
                  </div>
                )}
                <span className="truncate">{stage.name}</span>
              </div>
            );
          })}
        </div>

        {/* Terminal Log Console */}
        <div className="p-4 bg-background font-mono text-xs text-neon-cyan h-64 overflow-y-auto space-y-1.5 flex flex-col-reverse">
          <div className="flex items-center gap-2 text-neon-green pt-2">
            <span className="animate-pulse">&gt;</span>
            <span>{isComplete ? "AUDIT COMPLETED // REDIRECTING..." : "AUDIT ENGINE WORKING..."}</span>
          </div>
          {logs.slice().reverse().map((log, index) => (
            <p
              key={index}
              className={`leading-relaxed ${
                log.includes("FATAL_ERROR")
                  ? "text-destructive"
                  : log.includes("STATUS: Audit complete")
                  ? "text-neon-green font-bold"
                  : log.includes("ENGINE:")
                  ? "text-neon-pink"
                  : log.includes("PROFILE:")
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {log}
            </p>
          ))}
        </div>

        {/* Footer Bar */}
        <div className="bg-card p-4 border-t border-border flex items-center justify-between">
          {error ? (
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-mono text-destructive flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" /> {error}
              </span>
              <Button
                onClick={() => window.location.reload()}
                size="sm"
                variant="destructive"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1" /> Retry Audit
              </Button>
            </div>
          ) : isComplete ? (
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-mono text-neon-green flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Audit complete! Opening report...
              </span>
              <Link href={`/report/${encodeURIComponent(username)}`}>
                <Button
                  size="sm"
                  className="bg-neon-cyan text-black hover:bg-neon-cyan/80 font-bold text-xs"
                >
                  View Report Now <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
              <Cpu className="w-4 h-4 text-neon-cyan animate-pulse" />
              <span>DevScope Deterministic Engine Active</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

