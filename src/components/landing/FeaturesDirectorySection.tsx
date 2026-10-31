"use client";

import Link from "next/link";
import {
  Terminal,
  PieChart,
  FolderGit2,
  Trophy,
  Medal,
  Sparkles,
  ShieldCheck,
  History,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/8bit/button";
import { arcadeAudio } from "@/lib/sound/audio";

interface FeatureCardProps {
  number: string;
  title: string;
  badge: string;
  badgeColor: string;
  description: string;
  actionText: string;
  actionHref: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

const FEATURES: FeatureCardProps[] = [
  {
    number: "01",
    title: "TERMINAL AUDIT ENGINE",
    badge: "LIVE PIPELINE",
    badgeColor: "text-neon-cyan border-neon-cyan/40 bg-neon-cyan/10",
    description:
      "Watch an interactive retro console stream live GitHub API inspect events, repository metadata checks, and licensing validation.",
    actionText: "Try Sample Audit",
    actionHref: "/audit/torvalds",
    icon: Terminal,
    accentColor: "border-neon-cyan text-neon-cyan",
  },
  {
    number: "02",
    title: "5-AXIS SPIDER RADAR",
    badge: "VISUAL METRICS",
    badgeColor: "text-primary border-primary/40 bg-primary/10",
    description:
      "Interactive Recharts competency radar and tech stack frequency charts mapping your engineering strengths and weaknesses.",
    actionText: "View Sample Dashboard",
    actionHref: "/report/shadcn",
    icon: PieChart,
    accentColor: "border-primary text-primary",
  },
  {
    number: "03",
    title: "DEEP REPO INSPECTOR",
    badge: "CODE HYGIENE",
    badgeColor: "text-neon-pink border-neon-pink/40 bg-neon-pink/10",
    description:
      "Root file structure analysis, README setup instructions check, test suite detection, and actionable code fixes.",
    actionText: "Inspect Repo Sample",
    actionHref: "/report/shadcn/repository/ui",
    icon: FolderGit2,
    accentColor: "border-neon-pink text-neon-pink",
  },
  {
    number: "04",
    title: "GAMIFIED RPG QUEST LOG",
    badge: "XP PROGRESSION",
    badgeColor: "text-neon-green border-neon-green/40 bg-neon-green/10",
    description:
      "Convert portfolio technical debt into actionable RPG quests. Complete tasks, earn XP, trigger confetti, and level up your engineering rank.",
    actionText: "Open Sample Quest Log",
    actionHref: "/report/shadcn/roadmap",
    icon: Trophy,
    accentColor: "border-neon-green text-neon-green",
  },
  {
    number: "05",
    title: "ARCADE HALL OF FAME",
    badge: "GLOBAL HIGH SCORES",
    badgeColor: "text-neon-yellow border-neon-yellow/40 bg-neon-yellow/10",
    description:
      "Global leaderboard benchmarking your engineering presence against open-source titans like Linus Torvalds, shadcn, and Lee Robinson.",
    actionText: "Open Hall of Fame",
    actionHref: "/leaderboard",
    icon: Medal,
    accentColor: "border-neon-yellow text-neon-yellow",
  },
  {
    number: "06",
    title: "AI DOCUMENTATION STUDIO",
    badge: "GEMINI 2.5",
    badgeColor: "text-neon-cyan border-neon-cyan/40 bg-neon-cyan/10",
    description:
      "Generate complete, recruiter-ready README.md files and high-conversion developer bios tailored to your audited tech stack.",
    actionText: "Explore AI Studio",
    actionHref: "/report/shadcn",
    icon: Sparkles,
    accentColor: "border-neon-cyan text-neon-cyan",
  },
  {
    number: "07",
    title: "DYNAMIC SVG README BADGE",
    badge: "GITHUB EMBED",
    badgeColor: "text-primary border-primary/40 bg-primary/10",
    description:
      "Live embeddable SVG badges that update your GitHub profile README dynamically whenever your engineering score improves.",
    actionText: "View Live Badge",
    actionHref: "/api/badge/torvalds",
    icon: ShieldCheck,
    accentColor: "border-primary text-primary",
  },
  {
    number: "08",
    title: "SQUAD & PROGRESS TRACKER",
    badge: "LOCAL HISTORY",
    badgeColor: "text-neon-green border-neon-green/40 bg-neon-green/10",
    description:
      "Bookmark teammates, pin favorite profiles to your squad, and track point differentials (e.g. +14 PTS) between re-audits.",
    actionText: "Start an Audit",
    actionHref: "/#audit-form",
    icon: History,
    accentColor: "border-neon-green text-neon-green",
  },
];

export function FeaturesDirectorySection() {
  return (
    <section id="features" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 bg-secondary border border-border text-xs font-mono text-neon-cyan">
          <span className="w-2 h-2 rounded-none bg-neon-cyan animate-pulse" />
          <span>ARCADE AUDIT SUITE // DIRECTORY</span>
        </div>
        <h2 className="font-['Press_Start_2P'] text-xl sm:text-3xl text-foreground tracking-tight mb-4 leading-relaxed">
          COMPLETE FEATURE ARSENAL
        </h2>
        <p className="text-sm text-muted-foreground font-sans max-w-2xl mx-auto">
          Every tool in DevScope is crafted to give you transparent engineering insights, practical documentation upgrades, and measurable portfolio growth.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {FEATURES.map((feat) => {
          const Icon = feat.icon;
          return (
            <div
              key={feat.number}
              className="bg-card border-2 border-border p-5 flex flex-col justify-between hover:border-neon-cyan transition-all group relative overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.2)]"
            >
              <div>
                {/* Header: Number and Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-['Press_Start_2P'] text-[11px] text-muted-foreground group-hover:text-neon-cyan transition-colors">
                    [{feat.number}]
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 border font-bold ${feat.badgeColor}`}>
                    {feat.badge}
                  </span>
                </div>

                {/* Icon & Title */}
                <div className="flex items-center gap-2.5 mb-3">
                  <div className={`w-8 h-8 bg-secondary border flex items-center justify-center shrink-0 ${feat.accentColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-['Press_Start_2P'] text-[11px] text-foreground group-hover:text-neon-cyan transition-colors leading-snug">
                    {feat.title}
                  </h3>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed mb-6 font-sans">
                  {feat.description}
                </p>
              </div>

              {/* Action Button Link */}
              <div className="pt-3 border-t border-border/60">
                <Link
                  href={feat.actionHref}
                  onClick={() => arcadeAudio.playClick()}
                  className="w-full block"
                >
                  <Button
                    size="sm"
                    className="w-full bg-secondary hover:bg-muted border border-border group-hover:border-neon-cyan text-foreground hover:text-neon-cyan text-xs font-mono py-2 transition-colors flex items-center justify-between whitespace-nowrap"
                  >
                    <span className="truncate">{feat.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-neon-cyan group-hover:translate-x-1 transition-transform shrink-0 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

