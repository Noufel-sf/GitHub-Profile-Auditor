"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Terminal,
  Search,
  Sparkles,
  Zap,
  ShieldCheck,
  Code2,
  FileText,
  Activity,
  ArrowRight,
  Trophy,
  Flame,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/8bit/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/8bit/card";
import { Badge } from "@/components/ui/8bit/badge";
import { GithubIcon } from "@/components/ui/icons";

export default function HomePage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleAudit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = username.trim().replace(/^https?:\/\/(www\.)?github\.com\//i, "").replace(/^@/, "").replace(/\/$/, "");

    if (!clean) {
      setError("Please enter a valid GitHub username");
      return;
    }
    setError("");
    router.push(`/audit/${encodeURIComponent(clean)}`);
  };

  const handleQuickSelect = (user: string) => {
    setUsername(user);
    router.push(`/audit/${encodeURIComponent(user)}`);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* HERO SECTION */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 flex flex-col items-center text-center">
        {/* Retro Header Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 bg-[#111832] border border-[#22D3EE] text-[#22D3EE] text-xs font-mono tracking-widest shadow-[0_0_12px_rgba(34,211,238,0.25)]">
          <span className="w-2 h-2 rounded-none bg-[#22D3EE] animate-ping" />
          <span>DEV SCOPE // ARCADE AUDITING SUITE</span>
          <span className="text-[#EC4899] font-bold">READY</span>
        </div>

        {/* Large Pixel Heading */}
        <h1 className="font-['Press_Start_2P'] text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-[#F8FAFC] tracking-tight leading-relaxed max-w-5xl mb-6">
          LEVEL UP YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A855F7] via-[#22D3EE] to-[#EC4899]">GITHUB</span>.
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-[#A5AEC9] max-w-3xl leading-relaxed mb-10 font-sans">
          Your GitHub profile tells a story. DevScope performs an engineering audit across documentation, code indicators, repository hygiene, and generates an actionable RPG improvement roadmap.
        </p>

        {/* Audit Search Box */}
        <div id="audit-form" className="w-full max-w-2xl bg-[#111832] border-2 border-[#30395D] p-3 sm:p-4 shadow-[0_0_25px_rgba(168,85,247,0.15)] relative mb-6">
          {/* Decorative Corner Pixels */}
          <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-[#22D3EE]" />
          <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-[#EC4899]" />
          <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-[#A3E635]" />
          <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-[#FACC15]" />

          <form onSubmit={handleAudit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#707B9C]">
                <GithubIcon className="w-5 h-5 text-[#22D3EE]" />
              </div>
              <input
                type="text"
                placeholder="github.com/username or @handle"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error) setError("");
                }}
                className="w-full pl-10 pr-4 py-3 bg-[#080B20] border border-[#30395D] text-[#F8FAFC] font-mono text-sm placeholder-[#707B9C] focus:outline-none focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE] transition-all"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="bg-[#A855F7] text-white hover:bg-[#9333ea] border-none font-bold text-xs font-['Press_Start_2P'] py-4 px-6 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.5)] cursor-pointer"
            >
              <Terminal className="w-4 h-4 mr-1 text-[#22D3EE]" />
              ANALYZE PROFILE
            </Button>
          </form>

          {error && (
            <p className="text-left text-xs font-mono text-[#EF4444] mt-2 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {error}
            </p>
          )}

          {/* Quick Demo Selectors */}
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-[#202A4A] text-xs font-mono text-[#707B9C]">
            <span className="text-[#A5AEC9]">QUICK AUDIT DEMOS:</span>
            {[
              { name: "torvalds", label: "Linus Torvalds" },
              { name: "shadcn", label: "shadcn" },
              { name: "leerob", label: "Lee Robinson" },
              { name: "gaearon", label: "Dan Abramov" },
            ].map((user) => (
              <button
                key={user.name}
                type="button"
                onClick={() => handleQuickSelect(user.name)}
                className="px-2.5 py-1 bg-[#171F3D] hover:bg-[#202A4A] text-[#22D3EE] hover:text-[#F8FAFC] border border-[#30395D] text-[11px] transition-colors cursor-pointer"
              >
                @{user.name}
              </button>
            ))}
          </div>
        </div>

        {/* Live stats banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl mt-6">
          <div className="p-3 bg-[#0D1228] border border-[#202A4A] text-left">
            <span className="text-[10px] font-mono text-[#707B9C] block">SCORING SYSTEM</span>
            <span className="font-['Press_Start_2P'] text-sm text-[#22D3EE] mt-1 block">DETERMINISTIC</span>
          </div>
          <div className="p-3 bg-[#0D1228] border border-[#202A4A] text-left">
            <span className="text-[10px] font-mono text-[#707B9C] block">WEIGHTED CATEGORIES</span>
            <span className="font-['Press_Start_2P'] text-sm text-[#A3E635] mt-1 block">5 METRICS</span>
          </div>
          <div className="p-3 bg-[#0D1228] border border-[#202A4A] text-left">
            <span className="text-[10px] font-mono text-[#707B9C] block">AI INSIGHTS</span>
            <span className="font-['Press_Start_2P'] text-sm text-[#EC4899] mt-1 block">GEMINI POWERED</span>
          </div>
          <div className="p-3 bg-[#0D1228] border border-[#202A4A] text-left">
            <span className="text-[10px] font-mono text-[#707B9C] block">ACTIONABLE ROADMAP</span>
            <span className="font-['Press_Start_2P'] text-sm text-[#FACC15] mt-1 block">RPG QUESTS</span>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="w-full bg-[#0D1228] border-y border-[#30395D] py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono text-[#A855F7] tracking-widest block mb-2 font-bold">
              [ ARCADE WORKFLOW ]
            </span>
            <h2 className="font-['Press_Start_2P'] text-xl sm:text-3xl text-[#F8FAFC] tracking-tight mb-4">
              HOW DEV SCOPE WORKS
            </h2>
            <p className="text-sm text-[#A5AEC9]">
              Three deterministic steps to audit your engineering presence and unlock your developer roadmap.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-[#111832] border-2 border-[#30395D] p-6 relative hover:border-[#22D3EE] transition-all">
              <div className="w-10 h-10 bg-[#080B20] border-2 border-[#22D3EE] flex items-center justify-center font-['Press_Start_2P'] text-sm text-[#22D3EE] mb-4">
                01
              </div>
              <h3 className="font-['Press_Start_2P'] text-xs text-[#F8FAFC] mb-3 leading-relaxed">
                ENTER USERNAME
              </h3>
              <p className="text-xs text-[#A5AEC9] leading-relaxed">
                Provide any public GitHub handle. DevScope queries the official GitHub API without requiring private OAuth access or tokens.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#111832] border-2 border-[#30395D] p-6 relative hover:border-[#A855F7] transition-all">
              <div className="w-10 h-10 bg-[#080B20] border-2 border-[#A855F7] flex items-center justify-center font-['Press_Start_2P'] text-sm text-[#A855F7] mb-4">
                02
              </div>
              <h3 className="font-['Press_Start_2P'] text-xs text-[#F8FAFC] mb-3 leading-relaxed">
                RUN METRIC ENGINE
              </h3>
              <p className="text-xs text-[#A5AEC9] leading-relaxed">
                Our transparent engine inspects documentation presence, repository structure, licensing, commit cadences, and engineering indicators.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#111832] border-2 border-[#30395D] p-6 relative hover:border-[#A3E635] transition-all">
              <div className="w-10 h-10 bg-[#080B20] border-2 border-[#A3E635] flex items-center justify-center font-['Press_Start_2P'] text-sm text-[#A3E635] mb-4">
                03
              </div>
              <h3 className="font-['Press_Start_2P'] text-xs text-[#F8FAFC] mb-3 leading-relaxed">
                UNLOCK RPG ROADMAP
              </h3>
              <p className="text-xs text-[#A5AEC9] leading-relaxed">
                Receive evidence-backed findings, category grades, and an interactive gamified quest log with prioritized actionable fixes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5 AUDIT CATEGORIES SECTION */}
      <section id="categories" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono text-[#22D3EE] tracking-widest block mb-2 font-bold">
            [ TRANSPARENT EVALUATION ]
          </span>
          <h2 className="font-['Press_Start_2P'] text-xl sm:text-3xl text-[#F8FAFC] tracking-tight mb-4">
            AUDIT BREAKDOWN & WEIGHTS
          </h2>
          <p className="text-sm text-[#A5AEC9]">
            Deterministic scoring based on documented engineering criteria. No invented numbers or arbitrary LLM grading.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Category 1 */}
          <div className="bg-[#111832] border-2 border-[#30395D] p-6 hover:border-[#22D3EE] transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2 py-0.5 bg-[#22D3EE]/20 text-[#22D3EE] font-mono text-xs border border-[#22D3EE]/40 font-bold">
                  WEIGHT: 15%
                </span>
                <span className="text-xs font-mono text-[#707B9C]">CAT-01</span>
              </div>
              <h3 className="font-['Press_Start_2P'] text-xs text-[#F8FAFC] mb-2 leading-relaxed">
                PROFILE QUALITY
              </h3>
              <p className="text-xs text-[#A5AEC9] leading-relaxed mb-4">
                Inspects bio clarity, portfolio link, timezone/location, custom avatar, and overall professional identity presentation.
              </p>
            </div>
            <ul className="text-[11px] font-mono text-[#707B9C] space-y-1.5 pt-3 border-t border-[#202A4A]">
              <li className="flex items-center gap-1.5 text-[#A5AEC9]">
                <span className="text-[#22D3EE]">&gt;</span> Technical elevator pitch
              </li>
              <li className="flex items-center gap-1.5 text-[#A5AEC9]">
                <span className="text-[#22D3EE]">&gt;</span> Active portfolio/blog URL
              </li>
              <li className="flex items-center gap-1.5 text-[#A5AEC9]">
                <span className="text-[#22D3EE]">&gt;</span> Public identity credibility
              </li>
            </ul>
          </div>

          {/* Category 2 */}
          <div className="bg-[#111832] border-2 border-[#30395D] p-6 hover:border-[#A855F7] transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2 py-0.5 bg-[#A855F7]/20 text-[#A855F7] font-mono text-xs border border-[#A855F7]/40 font-bold">
                  WEIGHT: 30%
                </span>
                <span className="text-xs font-mono text-[#707B9C]">CAT-02</span>
              </div>
              <h3 className="font-['Press_Start_2P'] text-xs text-[#F8FAFC] mb-2 leading-relaxed">
                REPOSITORY QUALITY
              </h3>
              <p className="text-xs text-[#A5AEC9] leading-relaxed mb-4">
                Measures repository descriptions, original vs forked ratio, topic tagging, and open-source licensing hygiene.
              </p>
            </div>
            <ul className="text-[11px] font-mono text-[#707B9C] space-y-1.5 pt-3 border-t border-[#202A4A]">
              <li className="flex items-center gap-1.5 text-[#A5AEC9]">
                <span className="text-[#A855F7]">&gt;</span> Description coverage
              </li>
              <li className="flex items-center gap-1.5 text-[#A5AEC9]">
                <span className="text-[#A855F7]">&gt;</span> Original work ratio
              </li>
              <li className="flex items-center gap-1.5 text-[#A5AEC9]">
                <span className="text-[#A855F7]">&gt;</span> Open source license usage
              </li>
            </ul>
          </div>

          {/* Category 3 */}
          <div className="bg-[#111832] border-2 border-[#30395D] p-6 hover:border-[#EC4899] transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2 py-0.5 bg-[#EC4899]/20 text-[#EC4899] font-mono text-xs border border-[#EC4899]/40 font-bold">
                  WEIGHT: 25%
                </span>
                <span className="text-xs font-mono text-[#707B9C]">CAT-03</span>
              </div>
              <h3 className="font-['Press_Start_2P'] text-xs text-[#F8FAFC] mb-2 leading-relaxed">
                CODE INDICATORS
              </h3>
              <p className="text-xs text-[#A5AEC9] leading-relaxed mb-4">
                Assesses language specialization, modern default branch standards ('main'), issue backlog hygiene, and project depth.
              </p>
            </div>
            <ul className="text-[11px] font-mono text-[#707B9C] space-y-1.5 pt-3 border-t border-[#202A4A]">
              <li className="flex items-center gap-1.5 text-[#A5AEC9]">
                <span className="text-[#EC4899]">&gt;</span> Primary language focus
              </li>
              <li className="flex items-center gap-1.5 text-[#A5AEC9]">
                <span className="text-[#EC4899]">&gt;</span> Modern branch standard
              </li>
              <li className="flex items-center gap-1.5 text-[#A5AEC9]">
                <span className="text-[#EC4899]">&gt;</span> Issue & backlog maintenance
              </li>
            </ul>
          </div>

          {/* Category 4 */}
          <div className="bg-[#111832] border-2 border-[#30395D] p-6 hover:border-[#A3E635] transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2 py-0.5 bg-[#A3E635]/20 text-[#A3E635] font-mono text-xs border border-[#A3E635]/40 font-bold">
                  WEIGHT: 15%
                </span>
                <span className="text-xs font-mono text-[#707B9C]">CAT-04</span>
              </div>
              <h3 className="font-['Press_Start_2P'] text-xs text-[#F8FAFC] mb-2 leading-relaxed">
                DOCUMENTATION
              </h3>
              <p className="text-xs text-[#A5AEC9] leading-relaxed mb-4">
                Analyzes README coverage, length, setup/run commands (e.g. npm install), and live deployment URLs.
              </p>
            </div>
            <ul className="text-[11px] font-mono text-[#707B9C] space-y-1.5 pt-3 border-t border-[#202A4A]">
              <li className="flex items-center gap-1.5 text-[#A5AEC9]">
                <span className="text-[#A3E635]">&gt;</span> README presence & depth
              </li>
              <li className="flex items-center gap-1.5 text-[#A3E635]">
                <span className="text-[#A3E635]">&gt;</span> Installation instructions
              </li>
              <li className="flex items-center gap-1.5 text-[#A3E635]">
                <span className="text-[#A3E635]">&gt;</span> Live web app demos
              </li>
            </ul>
          </div>

          {/* Category 5 */}
          <div className="bg-[#111832] border-2 border-[#30395D] p-6 hover:border-[#FACC15] transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2 py-0.5 bg-[#FACC15]/20 text-[#FACC15] font-mono text-xs border border-[#FACC15]/40 font-bold">
                  WEIGHT: 15%
                </span>
                <span className="text-xs font-mono text-[#707B9C]">CAT-05</span>
              </div>
              <h3 className="font-['Press_Start_2P'] text-xs text-[#F8FAFC] mb-2 leading-relaxed">
                ACTIVITY & HYGIENE
              </h3>
              <p className="text-xs text-[#A5AEC9] leading-relaxed mb-4">
                Verifies recent push cadence (within 180 days), long-term track record, and curation of deprecated projects.
              </p>
            </div>
            <ul className="text-[11px] font-mono text-[#707B9C] space-y-1.5 pt-3 border-t border-[#202A4A]">
              <li className="flex items-center gap-1.5 text-[#A5AEC9]">
                <span className="text-[#FACC15]">&gt;</span> Recent 6-month pushes
              </li>
              <li className="flex items-center gap-1.5 text-[#A5AEC9]">
                <span className="text-[#FACC15]">&gt;</span> Account maturity tenure
              </li>
              <li className="flex items-center gap-1.5 text-[#A5AEC9]">
                <span className="text-[#FACC15]">&gt;</span> Stale repository curation
              </li>
            </ul>
          </div>

          {/* Bonus: AI Assistant */}
          <div className="bg-gradient-to-br from-[#111832] to-[#171F3D] border-2 border-[#30395D] p-6 hover:border-[#22D3EE] transition-all flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 w-16 h-16 bg-[#22D3EE]/10 rounded-full blur-xl" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2 py-0.5 bg-[#22D3EE]/20 text-[#22D3EE] font-mono text-xs border border-[#22D3EE]/40 font-bold">
                  AI ASSISTANT
                </span>
                <Sparkles className="w-4 h-4 text-[#22D3EE]" />
              </div>
              <h3 className="font-['Press_Start_2P'] text-xs text-[#F8FAFC] mb-2 leading-relaxed">
                GEMINI SUMMARY
              </h3>
              <p className="text-xs text-[#A5AEC9] leading-relaxed mb-4">
                Translates raw audit findings into a recruiter-ready executive summary and tailored RPG quest tasks.
              </p>
            </div>
            <div className="pt-3 border-t border-[#202A4A] flex items-center justify-between text-xs font-mono text-[#22D3EE]">
              <span>Gamified RPG Quests</span>
              <span>XP Leveling &gt;</span>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="w-full bg-[#0D1228] border-t border-[#30395D] py-20 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="w-12 h-12 bg-[#111832] border-2 border-[#22D3EE] flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(34,211,238,0.4)]">
            <Trophy className="w-6 h-6 text-[#22D3EE]" />
          </div>
          <h2 className="font-['Press_Start_2P'] text-xl sm:text-3xl text-[#F8FAFC] tracking-tight mb-4 leading-relaxed">
            READY TO AUDIT YOUR CODE?
          </h2>
          <p className="text-sm text-[#A5AEC9] max-w-xl mx-auto mb-8 font-sans">
            Level up your GitHub portfolio, fix hidden engineering flaws, and build evidence that hiring managers notice.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#audit-form">
              <Button
                size="lg"
                className="bg-[#A855F7] text-white hover:bg-[#9333ea] border-none font-['Press_Start_2P'] text-xs py-4 px-8 shadow-[0_0_20px_rgba(168,85,247,0.5)] cursor-pointer"
              >
                INSERT COIN // START AUDIT
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
