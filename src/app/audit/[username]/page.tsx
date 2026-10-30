"use client";

import { useEffect, useState, use } from "react";
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
      <div className="w-full flex items-center justify-between mb-8 pb-4 border-b border-[#30395D]">
        <div className="flex items-center gap-2 text-xs font-mono text-[#707B9C]">
          <Link href="/" className="hover:text-[#22D3EE] transition-colors">
            HOME
          </Link>
          <span>/</span>
          <span className="text-[#F8FAFC]">AUDIT</span>
          <span>/</span>
          <span className="text-[#22D3EE]">@{username}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#22D3EE] animate-pulse" />
          <span className="text-xs font-mono text-[#22D3EE]">LIVE AUDIT SESSION</span>
        </div>
      </div>

      {/* Main Terminal Box */}
      <div className="w-full bg-[#111832] border-2 border-[#30395D] shadow-[0_0_30px_rgba(34,211,238,0.15)] relative overflow-hidden">
        {/* Decorative corner pixels */}
        <div className="absolute top-0 left-0 w-2 h-2 bg-[#22D3EE]" />
        <div className="absolute top-0 right-0 w-2 h-2 bg-[#EC4899]" />
        <div className="absolute bottom-0 left-0 w-2 h-2 bg-[#A3E635]" />
        <div className="absolute bottom-0 right-0 w-2 h-2 bg-[#FACC15]" />

        {/* Terminal Header */}
        <div className="bg-[#080B20] px-4 py-3 border-b border-[#30395D] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#EF4444]" />
            <div className="w-3 h-3 bg-[#FACC15]" />
            <div className="w-3 h-3 bg-[#10B981]" />
            <span className="text-xs font-['Press_Start_2P'] text-[#F8FAFC] ml-2">
              DEVSCOPE_ANALYZER // @{username}
            </span>
          </div>
          <span className="text-[11px] font-mono text-[#A855F7] font-bold">
            {progressPercentage}% COMPLETE
          </span>
        </div>

        {/* Progress Section */}
        <div className="p-6 bg-[#0D1228] border-b border-[#202A4A]">
          <div className="flex items-center justify-between mb-3 text-xs font-mono">
            <span className="text-[#A5AEC9]">CURRENT STAGE:</span>
            <span className="text-[#22D3EE] font-bold">
              [{currentStageIndex + 1}/{AUDIT_STAGES.length}] {AUDIT_STAGES[currentStageIndex]?.name}
            </span>
          </div>
          <Progress
            value={progressPercentage}
            variant="retro"
            progressBg="bg-[#22D3EE]"
            className="h-3"
          />
        </div>

        {/* Stages Checklist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-6 bg-[#080B20]/60 border-b border-[#202A4A] text-xs font-mono">
          {AUDIT_STAGES.map((stage, idx) => {
            const isDone = idx < currentStageIndex || isComplete;
            const isCurrent = idx === currentStageIndex && !isComplete && !error;
            return (
              <div
                key={stage.id}
                className={`p-2.5 border flex items-center gap-2.5 transition-colors ${
                  isDone
                    ? "bg-[#111832] border-[#22D3EE]/40 text-[#F8FAFC]"
                    : isCurrent
                    ? "bg-[#171F3D] border-[#A855F7] text-[#22D3EE]"
                    : "bg-[#080B20] border-[#202A4A] text-[#707B9C]"
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-[#A3E635] shrink-0" />
                ) : isCurrent ? (
                  <RefreshCw className="w-4 h-4 text-[#A855F7] animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 border border-[#707B9C] shrink-0 flex items-center justify-center text-[9px]">
                    {stage.id}
                  </div>
                )}
                <span className="truncate">{stage.name}</span>
              </div>
            );
          })}
        </div>

        {/* Terminal Log Console */}
        <div className="p-4 bg-[#080B20] font-mono text-xs text-[#22D3EE] h-64 overflow-y-auto space-y-1.5 flex flex-col-reverse">
          <div className="flex items-center gap-2 text-[#A3E635] pt-2">
            <span className="animate-pulse">&gt;</span>
            <span>{isComplete ? "AUDIT COMPLETED // REDIRECTING..." : "AUDIT ENGINE WORKING..."}</span>
          </div>
          {logs.slice().reverse().map((log, index) => (
            <p
              key={index}
              className={`leading-relaxed ${
                log.includes("FATAL_ERROR")
                  ? "text-[#EF4444]"
                  : log.includes("STATUS: Audit complete")
                  ? "text-[#A3E635] font-bold"
                  : log.includes("ENGINE:")
                  ? "text-[#EC4899]"
                  : log.includes("PROFILE:")
                  ? "text-[#F8FAFC]"
                  : "text-[#A5AEC9]"
              }`}
            >
              {log}
            </p>
          ))}
        </div>

        {/* Footer Bar */}
        <div className="bg-[#111832] p-4 border-t border-[#30395D] flex items-center justify-between">
          {error ? (
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-mono text-[#EF4444] flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" /> {error}
              </span>
              <Button
                onClick={() => window.location.reload()}
                size="sm"
                className="bg-[#EF4444] text-white hover:bg-[#dc2626]"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1" /> Retry Audit
              </Button>
            </div>
          ) : isComplete ? (
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-mono text-[#A3E635] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Audit complete! Opening report...
              </span>
              <Link href={`/report/${encodeURIComponent(username)}`}>
                <Button
                  size="sm"
                  className="bg-[#22D3EE] text-[#080B20] hover:bg-[#06b6d4] font-bold text-xs"
                >
                  View Report Now <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-xs font-mono text-[#707B9C]">
              <Cpu className="w-4 h-4 text-[#22D3EE] animate-pulse" />
              <span>DevScope Deterministic Engine Active</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
