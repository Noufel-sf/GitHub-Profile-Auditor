"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Trophy,
  Medal,
  Star,
  ExternalLink,
  Flame,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/8bit/button";
import { Badge } from "@/components/ui/8bit/badge";

interface LeaderboardEntry {
  rank: number;
  username: string;
  name: string;
  avatarUrl: string;
  score: number;
  grade: "S" | "A" | "B";
  archetype: string;
  topLanguage: string;
  publicRepos: number;
  followers: number;
}

const HALL_OF_FAME: LeaderboardEntry[] = [
  {
    rank: 1,
    username: "Noufel-sf",
    name: "Noufel seif el islam",
    avatarUrl: "https://avatars.githubusercontent.com/u/202407807?v=4",
    score: 95,
    grade: "S",
    archetype: "DevScope Creator & Architect",
    topLanguage: "TypeScript",
    publicRepos: 40,
    followers: 166,
  },
  {
    rank: 2,
    username: "torvalds",
    name: "Linus Torvalds",
    avatarUrl: "https://avatars.githubusercontent.com/u/1024025?v=4",
    score: 98,
    grade: "S",
    archetype: "System Kernel Sovereign",
    topLanguage: "C",
    publicRepos: 7,
    followers: 242000,
  },
  {
    rank: 3,
    username: "sindresorhus",
    name: "Sindre Sorhus",
    avatarUrl: "https://avatars.githubusercontent.com/u/170270?v=4",
    score: 96,
    grade: "S",
    archetype: "Open-Source Titan",
    topLanguage: "TypeScript",
    publicRepos: 1100,
    followers: 66000,
  },
  {
    rank: 4,
    username: "shadcn",
    name: "shadcn",
    avatarUrl: "https://avatars.githubusercontent.com/u/124599?v=4",
    score: 94,
    grade: "S",
    archetype: "Design System Sorcerer",
    topLanguage: "TypeScript",
    publicRepos: 18,
    followers: 81000,
  },
  {
    rank: 5,
    username: "antfu",
    name: "Anthony Fu",
    avatarUrl: "https://avatars.githubusercontent.com/u/11247099?v=4",
    score: 93,
    grade: "S",
    archetype: "Vite & Tooling Architect",
    topLanguage: "TypeScript",
    publicRepos: 480,
    followers: 47000,
  },
  {
    rank: 6,
    username: "leerob",
    name: "Lee Robinson",
    avatarUrl: "https://avatars.githubusercontent.com/u/9113740?v=4",
    score: 91,
    grade: "S",
    archetype: "Modern Web Evangelist",
    topLanguage: "TypeScript",
    publicRepos: 82,
    followers: 38000,
  },
  {
    rank: 7,
    username: "gaearon",
    name: "Dan Abramov",
    avatarUrl: "https://avatars.githubusercontent.com/u/810438?v=4",
    score: 90,
    grade: "S",
    archetype: "React Pioneer",
    topLanguage: "JavaScript",
    publicRepos: 270,
    followers: 92000,
  },
];

export default function LeaderboardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<string>("all");

  const filtered = HALL_OF_FAME.filter((entry) => {
    const matchesSearch =
      entry.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.topLanguage.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade =
      selectedGrade === "all" || entry.grade === selectedGrade;
    return matchesSearch && matchesGrade;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <Link href="/" className="hover:text-neon-cyan transition-colors">
            HOME
          </Link>
          <span>/</span>
          <span className="text-foreground">ARCADE HALL OF FAME</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-neon-yellow animate-ping" />
          <span className="text-xs font-mono text-neon-yellow font-bold">
            HIGH SCORES TABLE
          </span>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-card border-2 border-border p-6 sm:p-8 text-center relative overflow-hidden shadow-[0_0_30px_rgba(250,204,21,0.1)]">
        <div className="absolute top-0 left-0 w-3 h-3 bg-neon-cyan" />
        <div className="absolute top-0 right-0 w-3 h-3 bg-neon-pink" />
        <div className="absolute bottom-0 left-0 w-3 h-3 bg-neon-green" />
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-neon-yellow" />

        <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 bg-background border border-neon-yellow text-neon-yellow text-xs font-mono">
          <Trophy className="w-3.5 h-3.5" />
          <span>GLOBAL HIGH SCORES</span>
        </div>

        <h1 className="font-['Press_Start_2P'] text-xl sm:text-3xl md:text-4xl text-foreground tracking-tight mb-4 leading-relaxed">
          HALL OF FAME
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto font-sans leading-relaxed mb-6">
          Benchmark your GitHub presence against industry legends. Every profile is evaluated by DevScope's 100% deterministic engineering engine.
        </p>

        <Link href="/#audit-form">
          <Button
            size="lg"
            className="bg-primary text-white hover:bg-primary/90 border-none font-['Press_Start_2P'] text-xs py-3.5 px-6 shadow-[0_0_20px_rgba(168,85,247,0.3)] whitespace-nowrap"
          >
            <Flame className="w-4 h-4 mr-1 text-neon-yellow shrink-0" />
            AUDIT YOUR PROFILE
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-secondary border border-border font-mono text-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5 shrink-0" />
          <input
            type="text"
            placeholder="Search developer, name, or stack..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <span className="text-muted-foreground whitespace-nowrap">TIER:</span>
          {["all", "S", "A", "B"].map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGrade(g)}
              className={`px-3 py-1 uppercase text-xs cursor-pointer border whitespace-nowrap ${
                selectedGrade === g
                  ? "bg-neon-cyan text-black border-neon-cyan font-bold"
                  : "bg-card text-muted-foreground border-border hover:text-foreground"
              }`}
            >
              {g === "all" ? "ALL TIERS" : `RANK ${g}`}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-card border-2 border-border overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="bg-background text-muted-foreground border-b border-border whitespace-nowrap">
              <th className="py-3 px-4 w-16">RANK</th>
              <th className="py-3 px-4">DEVELOPER</th>
              <th className="py-3 px-4">ARCHETYPE</th>
              <th className="py-3 px-4">STACK</th>
              <th className="py-3 px-4">PUBLIC REPOS</th>
              <th className="py-3 px-4">SCORE</th>
              <th className="py-3 px-4 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((entry) => (
              <tr
                key={entry.username}
                className="hover:bg-muted/50 transition-colors whitespace-nowrap"
              >
                {/* Rank Badge */}
                <td className="py-4 px-4">
                  <div className="flex items-center justify-center w-8 h-8 font-['Press_Start_2P'] text-xs">
                    {entry.rank === 1 ? (
                      <span className="text-neon-yellow text-sm">🥇 #1</span>
                    ) : entry.rank === 2 ? (
                      <span className="text-slate-300 text-sm">🥈 #2</span>
                    ) : entry.rank === 3 ? (
                      <span className="text-amber-500 text-sm">🥉 #3</span>
                    ) : (
                      <span className="text-muted-foreground">#{entry.rank}</span>
                    )}
                  </div>
                </td>

                {/* Developer Info */}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={entry.avatarUrl}
                      alt={entry.name}
                      className="w-10 h-10 border border-border object-cover shrink-0"
                    />
                    <div>
                      <div className="font-bold text-foreground flex items-center gap-1.5">
                        {entry.name}
                      </div>
                      <span className="text-neon-cyan text-[11px]">
                        @{entry.username}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Archetype */}
                <td className="py-4 px-4 text-muted-foreground">
                  {entry.archetype}
                </td>

                {/* Primary Stack */}
                <td className="py-4 px-4">
                  <span className="px-2 py-0.5 bg-background text-primary border border-border text-[11px]">
                    {entry.topLanguage}
                  </span>
                </td>

                {/* Repos Count */}
                <td className="py-4 px-4 text-muted-foreground">
                  {entry.publicRepos} Repos
                </td>

                {/* Score */}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <span className="font-['Space_Grotesk'] text-xl font-bold text-foreground">
                      {entry.score}
                    </span>
                    <span className="px-1.5 py-0.2 bg-neon-green/20 text-neon-green border border-neon-green/40 text-[10px] font-bold">
                      {entry.grade}
                    </span>
                  </div>
                </td>

                {/* Action Link */}
                <td className="py-4 px-4 text-right">
                  <Link href={`/report/${encodeURIComponent(entry.username)}`}>
                    <Button
                      size="sm"
                      className="bg-card hover:bg-muted border border-border text-foreground hover:text-neon-cyan text-xs py-1 whitespace-nowrap"
                    >
                      View Report
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

