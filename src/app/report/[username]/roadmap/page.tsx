"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  Trophy,
  CheckCircle2,
  Circle,
  ArrowLeft,
  Flame,
  Zap,
  Star,
  ShieldAlert,
  ArrowRight,
  Filter,
  Sparkles,
  RefreshCw,
  Clock,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/8bit/button";
import { Progress } from "@/components/ui/8bit/progress";
import { OverallAuditReport, RoadmapTask } from "@/types/audit";

export default function GamifiedRoadmapPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const resolvedParams = use(params);
  const rawUsername = resolvedParams.username;
  const username = decodeURIComponent(rawUsername);

  const [report, setReport] = useState<OverallAuditReport | null>(null);
  const [tasks, setTasks] = useState<RoadmapTask[]>([]);
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "completed">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load audit report from session or API
    const cached = typeof window !== "undefined" ? sessionStorage.getItem(`audit_${username.toLowerCase()}`) : null;
    if (cached) {
      try {
        const parsed: OverallAuditReport = JSON.parse(cached);
        setReport(parsed);
        // Load saved roadmap status from localStorage if present
        const savedRoadmap = localStorage.getItem(`roadmap_${username.toLowerCase()}`);
        if (savedRoadmap) {
          setTasks(JSON.parse(savedRoadmap));
        } else {
          setTasks(parsed.roadmap);
        }
        setLoading(false);
        return;
      } catch {
        // fallback
      }
    }

    async function loadReport() {
      try {
        setLoading(true);
        const res = await fetch(`/api/audit/${encodeURIComponent(username)}`);
        if (!res.ok) throw new Error("Failed to load audit");
        const json: OverallAuditReport = await res.json();
        setReport(json);
        const savedRoadmap = localStorage.getItem(`roadmap_${username.toLowerCase()}`);
        if (savedRoadmap) {
          setTasks(JSON.parse(savedRoadmap));
        } else {
          setTasks(json.roadmap);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    loadReport();
  }, [username]);

  // Toggle quest completion
  const handleToggleTask = (taskId: string) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        const nextState = !t.completed;
        if (nextState) {
          // Trigger confetti burst
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.7 },
            colors: ["#A855F7", "#22D3EE", "#A3E635", "#FACC15"],
          });
        }
        return { ...t, completed: nextState };
      }
      return t;
    });

    setTasks(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(`roadmap_${username.toLowerCase()}`, JSON.stringify(updated));
    }
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const totalXp = tasks.reduce((sum, t) => sum + t.xpReward, 0);
  const earnedXp = tasks.filter((t) => t.completed).reduce((sum, t) => sum + t.xpReward, 0);
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Compute RPG Level
  const level = Math.floor(earnedXp / 300) + 1;
  const xpInCurrentLevel = earnedXp % 300;

  const filteredTasks = tasks.filter((t) => {
    if (filterStatus === "active" && t.completed) return false;
    if (filterStatus === "completed" && !t.completed) return false;
    if (filterPriority !== "all" && t.priority !== filterPriority) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-20 flex flex-col items-center justify-center">
        <div className="w-14 h-14 border-4 border-[#A855F7] border-t-transparent animate-spin mb-4" />
        <h2 className="font-['Press_Start_2P'] text-sm text-[#F8FAFC]">
          LOADING RPG QUEST LOG...
        </h2>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#30395D]">
        <div className="flex items-center gap-2 text-xs font-mono text-[#707B9C]">
          <Link href={`/report/${encodeURIComponent(username)}`} className="hover:text-[#22D3EE] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> REPORT
          </Link>
          <span>/</span>
          <span className="text-[#F8FAFC]">RPG ROADMAP</span>
          <span>/</span>
          <span className="text-[#A855F7]">@{username}</span>
        </div>

        <Link href={`/audit/${encodeURIComponent(username)}`}>
          <Button
            size="sm"
            className="bg-[#111832] text-[#22D3EE] border-[#30395D] hover:bg-[#171F3D] text-xs font-mono"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" /> Re-Audit & Verify Progress
          </Button>
        </Link>
      </div>

      {/* GAMIFIED HERO BANNER */}
      <div className="bg-[#111832] border-2 border-[#30395D] p-6 relative overflow-hidden shadow-[0_0_25px_rgba(168,85,247,0.2)]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Level & Player Status */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-[#080B20] border-2 border-[#A855F7] flex flex-col items-center justify-center relative shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              <span className="text-[10px] font-mono text-[#A855F7]">LVL</span>
              <span className="font-['Press_Start_2P'] text-2xl text-[#F8FAFC]">{level}</span>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#22D3EE]" />
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-[#A3E635]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-['Press_Start_2P'] text-base sm:text-lg text-[#F8FAFC]">
                  QUEST LOG
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-[#A855F7]/20 text-[#A855F7] border border-[#A855F7]/40 font-bold">
                  @{username}
                </span>
              </div>
              <p className="text-xs font-mono text-[#A5AEC9] mt-1">
                Complete quests to optimize your GitHub engineering presence.
              </p>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="space-y-2 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-[#A5AEC9]">XP PROGRESS:</span>
              <span className="text-[#22D3EE] font-bold">
                {earnedXp} / {totalXp} XP ({progressPercent}%)
              </span>
            </div>
            <Progress
              value={progressPercent}
              variant="retro"
              progressBg="bg-[#A855F7]"
              className="h-3"
            />
            <span className="text-[10px] text-[#707B9C] block">
              {300 - xpInCurrentLevel} XP until Level {level + 1}
            </span>
          </div>

          {/* Quest Counter Stats */}
          <div className="grid grid-cols-2 gap-3 text-center font-mono">
            <div className="p-3 bg-[#0D1228] border border-[#202A4A]">
              <span className="text-[10px] text-[#707B9C] block">COMPLETED</span>
              <span className="text-xl font-bold text-[#A3E635]">{completedTasks}</span>
            </div>
            <div className="p-3 bg-[#0D1228] border border-[#202A4A]">
              <span className="text-[10px] text-[#707B9C] block">REMAINING</span>
              <span className="text-xl font-bold text-[#FACC15]">{totalTasks - completedTasks}</span>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#0D1228] border border-[#30395D] text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-[#707B9C]">STATUS:</span>
          {(["all", "active", "completed"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-2.5 py-1 uppercase text-[11px] cursor-pointer ${
                filterStatus === s
                  ? "bg-[#22D3EE] text-[#080B20] font-bold"
                  : "text-[#A5AEC9] hover:text-[#F8FAFC]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#707B9C]">PRIORITY:</span>
          {["all", "critical", "high", "medium", "low"].map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={`px-2.5 py-1 uppercase text-[11px] cursor-pointer ${
                filterPriority === p
                  ? "bg-[#A855F7] text-white font-bold"
                  : "text-[#A5AEC9] hover:text-[#F8FAFC]"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* QUEST CARDS LIST */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center bg-[#111832] border border-[#30395D]">
            <p className="font-mono text-xs text-[#707B9C]">
              No quests match the selected filters.
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`bg-[#111832] border-2 transition-all p-5 relative ${
                task.completed
                  ? "border-[#A3E635]/40 opacity-70"
                  : "border-[#30395D] hover:border-[#22D3EE]"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                {/* Checkbox & Header */}
                <div className="flex items-start gap-4 flex-1">
                  <button
                    onClick={() => handleToggleTask(task.id)}
                    className="mt-1 cursor-pointer transition-transform hover:scale-110 shrink-0"
                    title={task.completed ? "Mark as Incomplete" : "Mark as Completed"}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-[#A3E635]" />
                    ) : (
                      <div className="w-6 h-6 border-2 border-[#707B9C] hover:border-[#22D3EE]" />
                    )}
                  </button>

                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-['Press_Start_2P'] text-xs text-[#22D3EE]">
                        QUEST {String(task.questNumber).padStart(2, "0")}
                      </span>
                      <h3
                        className={`text-sm font-mono font-bold ${
                          task.completed ? "line-through text-[#707B9C]" : "text-[#F8FAFC]"
                        }`}
                      >
                        {task.title}
                      </h3>
                      {task.affectedRepo && (
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-[#080B20] text-[#22D3EE] border border-[#202A4A]">
                          REPO: {task.affectedRepo}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#A5AEC9] leading-relaxed">
                      {task.description}
                    </p>

                    {/* Why it matters */}
                    <div className="p-3 bg-[#080B20] border border-[#202A4A] text-xs font-mono space-y-1">
                      <div className="text-[#A855F7] font-bold">
                        &gt; Why It Matters:
                      </div>
                      <p className="text-[#A5AEC9]">{task.whyItMatters}</p>
                    </div>

                    {/* Action Steps */}
                    <div className="space-y-1 pt-2">
                      <span className="text-[11px] font-mono text-[#707B9C] font-bold block">
                        Action Checklist:
                      </span>
                      {task.actionSteps.map((step, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs font-mono text-[#A5AEC9]">
                          <span className="text-[#A3E635]">&gt;</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Badges: Priority, XP & Effort */}
                <div className="flex sm:flex-col items-end gap-2 shrink-0 text-xs font-mono">
                  <span
                    className={`px-2 py-0.5 uppercase text-[10px] font-bold border ${
                      task.priority === "critical"
                        ? "bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/40"
                        : task.priority === "high"
                        ? "bg-[#F97316]/20 text-[#F97316] border-[#F97316]/40"
                        : "bg-[#FACC15]/20 text-[#FACC15] border-[#FACC15]/40"
                    }`}
                  >
                    {task.priority}
                  </span>

                  <span className="px-2 py-0.5 bg-[#A855F7]/20 text-[#A855F7] border border-[#A855F7]/40 text-[10px] font-bold">
                    +{task.xpReward} XP
                  </span>

                  <span className="text-[10px] text-[#707B9C] flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {task.estimatedEffort}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* FOOTER NOTE */}
      <div className="p-4 bg-[#080B20] border border-[#202A4A] text-center text-xs font-mono text-[#707B9C]">
        <p>
          💡 Tip: Checking off a quest here records your manual progress. Once you commit changes on GitHub, run a <Link href={`/audit/${encodeURIComponent(username)}`} className="text-[#22D3EE] underline">Re-Audit</Link> to have DevScope verify improvements deterministically!
        </p>
      </div>
    </div>
  );
}

