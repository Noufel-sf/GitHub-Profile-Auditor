"use client";

import Link from "next/link";
import {
  Trophy,
  ExternalLink,
  ArrowRight,
  Sparkles,
  GitBranch,
  Terminal,
  ShieldCheck,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/8bit/button";
import { arcadeAudio } from "@/lib/sound/audio";

interface PublicExampleProfile {
  username: string;
  name: string;
  avatarUrl: string;
  role: string;
  archetype: string;
  badge: string;
  badgeColor: string;
  highlight?: boolean;
  publicRepos: number;
  topTech: string;
}

const PUBLIC_EXAMPLES: PublicExampleProfile[] = [
  {
    username: "Noufel-sf",
    name: "Noufel seif el islam",
    avatarUrl: "https://avatars.githubusercontent.com/u/202407807?v=4",
    role: "DevScope Creator & Full-Stack Architect",
    archetype: "Full-Stack Pioneer",
    badge: "CREATOR AUDIT",
    badgeColor: "text-neon-cyan border-neon-cyan/60 bg-neon-cyan/15",
    highlight: true,
    publicRepos: 40,
    topTech: "Next.js / TypeScript",
  },
  {
    username: "torvalds",
    name: "Linus Torvalds",
    avatarUrl: "https://avatars.githubusercontent.com/u/1024025?v=4",
    role: "Linux Kernel & Git Originator",
    archetype: "System Kernel Sovereign",
    badge: "RANK S TITAN",
    badgeColor: "text-neon-yellow border-neon-yellow/60 bg-neon-yellow/15",
    publicRepos: 7,
    topTech: "C / Kernel",
  },
  {
    username: "shadcn",
    name: "shadcn",
    avatarUrl: "https://avatars.githubusercontent.com/u/124599?v=4",
    role: "Design System & Component Architect",
    archetype: "Design System Sorcerer",
    badge: "RANK S MAESTRO",
    badgeColor: "text-primary border-primary/60 bg-primary/15",
    publicRepos: 18,
    topTech: "TypeScript / UI",
  },
  {
    username: "leerob",
    name: "Lee Robinson",
    avatarUrl: "https://avatars.githubusercontent.com/u/9113740?v=4",
    role: "VP of Product & Next.js Pioneer",
    archetype: "Modern Web Evangelist",
    badge: "RANK S LEADER",
    badgeColor: "text-neon-pink border-neon-pink/60 bg-neon-pink/15",
    publicRepos: 82,
    topTech: "React / Next.js",
  },
  {
    username: "antfu",
    name: "Anthony Fu",
    avatarUrl: "https://avatars.githubusercontent.com/u/11247099?v=4",
    role: "Vue, Vite & Tooling Core Contributor",
    archetype: "Vite Tooling Sovereign",
    badge: "RANK S PROLIFIC",
    badgeColor: "text-neon-green border-neon-green/60 bg-neon-green/15",
    publicRepos: 480,
    topTech: "TypeScript / Vite",
  },
];

export function PublicAuditsShowcase() {
  return (
    <section id="example-audits" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 bg-secondary border border-border text-xs font-mono text-neon-yellow">
          <Trophy className="w-3.5 h-3.5" />
          <span>PUBLIC BENCHMARKS // LIVE AUDITS</span>
        </div>
        <h2 className="font-['Press_Start_2P'] text-xl sm:text-3xl text-foreground tracking-tight mb-4 leading-relaxed">
          5 FEATURED PUBLIC AUDITS
        </h2>
        <p className="text-sm text-muted-foreground font-sans max-w-2xl mx-auto">
          Explore real audit scorecards across prominent developers and creators. Click any profile to inspect their live deterministic report and RPG roadmap.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PUBLIC_EXAMPLES.map((profile) => (
          <div
            key={profile.username}
            className={`bg-card border-2 p-6 flex flex-col justify-between transition-all group relative overflow-hidden ${
              profile.highlight
                ? "border-neon-cyan shadow-[0_0_25px_rgba(34,211,238,0.2)] md:col-span-2 lg:col-span-1"
                : "border-border hover:border-primary shadow-[0_0_15px_rgba(0,0,0,0.15)]"
            }`}
          >
            {/* Corner Decorative Pixels */}
            {profile.highlight ? (
              <>
                <div className="absolute top-0 left-0 w-2.5 h-2.5 bg-neon-cyan" />
                <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-neon-pink" />
                <div className="absolute bottom-0 left-0 w-2.5 h-2.5 bg-neon-green" />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-neon-yellow" />
              </>
            ) : null}

            <div>
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className={`text-[10px] font-mono px-2 py-0.5 border font-bold ${profile.badgeColor}`}>
                  {profile.badge}
                </span>
                <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                  <GitBranch className="w-3 h-3 text-neon-cyan" /> {profile.publicRepos} Repos
                </span>
              </div>

              {/* Developer Profile Header */}
              <div className="flex items-start gap-3.5 mb-4">
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className={`w-14 h-14 border-2 object-cover shrink-0 ${
                    profile.highlight ? "border-neon-cyan shadow-[0_0_12px_rgba(34,211,238,0.4)]" : "border-border"
                  }`}
                />
                <div className="min-w-0 flex-1 font-mono">
                  <h3 className="font-bold text-sm text-foreground truncate group-hover:text-neon-cyan transition-colors">
                    {profile.name}
                  </h3>
                  <div className="text-xs text-neon-cyan font-bold truncate">
                    @{profile.username}
                  </div>
                  <div className="text-[11px] text-primary truncate mt-0.5">
                    {profile.archetype}
                  </div>
                </div>
              </div>

              {/* Description / Role */}
              <p className="text-xs text-muted-foreground leading-relaxed mb-4 font-sans">
                {profile.role}
              </p>

              {/* Stack indicator */}
              <div className="p-2.5 bg-background border border-border mb-6 font-mono text-[11px] flex items-center justify-between gap-2">
                <span className="text-muted-foreground whitespace-nowrap">PRIMARY STACK:</span>
                <span className="text-foreground font-bold truncate text-right">{profile.topTech}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-border/60 flex items-center gap-2">
              <Link
                href={`/report/${encodeURIComponent(profile.username)}`}
                onClick={() => arcadeAudio.playClick()}
                className="flex-1"
              >
                <Button
                  size="sm"
                  className={`w-full text-xs font-mono py-2 font-bold flex items-center justify-center gap-1.5 whitespace-nowrap ${
                    profile.highlight
                      ? "bg-neon-cyan text-black hover:bg-neon-cyan/80"
                      : "bg-secondary text-foreground hover:bg-muted border border-border hover:border-primary"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>View Audit</span> <ArrowRight className="w-3 h-3 ml-1 shrink-0" />
                </Button>
              </Link>

              <Link
                href={`/audit/${encodeURIComponent(profile.username)}`}
                onClick={() => arcadeAudio.playClick()}
                title="Run fresh live audit terminal"
              >
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-card text-neon-cyan border-border hover:bg-muted p-2"
                >
                  <Terminal className="w-3.5 h-3.5" />
                </Button>
              </Link>

              <a
                href={`https://github.com/${profile.username}`}
                target="_blank"
                rel="noreferrer"
                title="Open GitHub Profile"
              >
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-card text-muted-foreground hover:text-foreground border-border hover:bg-muted p-2"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </Button>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

