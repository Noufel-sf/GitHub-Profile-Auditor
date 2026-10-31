"use client";

import Link from "next/link";
import {
  Terminal,
  ExternalLink,
  Trophy,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/8bit/button";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "@/components/ui/icons";
import { arcadeAudio } from "@/lib/sound/audio";

export default function AboutPage() {
  const socialLinks = [
    {
      platform: "LinkedIn",
      handle: "noufel-seif-el-islam-nasri",
      url: "https://www.linkedin.com/in/noufel-seif-el-islam-nasri/",
      description:
        "Professional career milestones, system architecture insights, and technical discussions.",
      icon: LinkedinIcon,
      accentBorder: "border-[#0A66C2]/60 hover:border-[#0A66C2]",
      badgeColor: "bg-[#0A66C2]/20 text-[#38bdf8] border-[#0A66C2]/40",
      btnClass: "bg-[#0A66C2] text-white hover:bg-[#0A66C2]/80",
    },
    {
      platform: "GitHub",
      handle: "@Noufel-sf",
      url: "https://github.com/Noufel-sf",
      description:
        "40+ public repositories, open-source developer tools, and the DevScope auditing codebase.",
      icon: GithubIcon,
      accentBorder: "border-neon-cyan/60 hover:border-neon-cyan",
      badgeColor: "bg-neon-cyan/20 text-neon-cyan border-neon-cyan/40",
      btnClass: "bg-neon-cyan text-black hover:bg-neon-cyan/80",
    },
    {
      platform: "Instagram",
      handle: "@noufel2.1",
      url: "https://www.instagram.com/noufel2.1/",
      description:
        "Personal journey, tech lifestyle, behind-the-scenes building sessions, and creative updates.",
      icon: InstagramIcon,
      accentBorder: "border-neon-pink/60 hover:border-neon-pink",
      badgeColor: "bg-neon-pink/20 text-neon-pink border-neon-pink/40",
      btnClass: "bg-neon-pink text-white hover:bg-neon-pink/80",
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 sm:space-y-12 overflow-x-hidden">
      {/* Top Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground flex-wrap">
          <Link href="/" className="hover:text-neon-cyan transition-colors">
            HOME
          </Link>
          <span>/</span>
          <span className="text-foreground">ABOUT</span>
          <span>/</span>
          <span className="text-neon-cyan">THE CREATOR</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
          <span className="text-xs font-mono text-neon-green font-bold">
            CREATOR DOSSIER ONLINE
          </span>
        </div>
      </div>

      {/* CREATOR DOSSIER HERO */}
      <div className="bg-card border-2 border-border p-5 sm:p-8 md:p-10 relative overflow-hidden shadow-[0_0_35px_rgba(34,211,238,0.15)]">
        {/* Retro Corner Pixels */}
        <div className="absolute top-0 left-0 w-3 h-3 bg-neon-cyan" />
        <div className="absolute top-0 right-0 w-3 h-3 bg-neon-pink" />
        <div className="absolute bottom-0 left-0 w-3 h-3 bg-neon-green" />
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-neon-yellow" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-center">
          {/* Avatar Column */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-5 group">
              <Image
                src="https://avatars.githubusercontent.com/u/202407807?v=4"
                alt="Noufel seif el islam Nasri"
                width={160}
                height={160}
                priority
                unoptimized
                className="w-32 h-32 sm:w-40 sm:h-40 border-4 border-neon-cyan object-cover shadow-[0_0_25px_rgba(34,211,238,0.35)] transition-transform group-hover:scale-105"
              />
              <div className="absolute -bottom-2 right-2 px-2.5 py-0.5 bg-neon-cyan text-black font-['Press_Start_2P'] text-[9px] font-bold shadow-md">
                CREATOR
              </div>
            </div>

            <h2 className="font-['Press_Start_2P'] text-xs sm:text-sm text-foreground leading-relaxed break-words max-w-full">
              NOUFEL SEIF EL ISLAM
            </h2>
            <span className="text-xs font-mono text-neon-cyan font-bold mt-1 block">
              @Noufel-sf
            </span>
            <span className="text-xs font-mono text-muted-foreground mt-0.5">
              Full-Stack Architect &amp; Engineer
            </span>
          </div>

          {/* Dossier Details */}
          <div className="lg:col-span-2 space-y-4 min-w-0 max-w-full">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary border border-border text-xs font-mono text-primary font-bold">
              <Terminal className="w-3.5 h-3.5 text-neon-cyan shrink-0" />
              <span>SYSTEM ARCHITECT // DEVSCOPE ENGINE</span>
            </div>

            <h1 className="font-['Press_Start_2P'] text-base sm:text-xl md:text-2xl text-foreground tracking-tight leading-relaxed break-words">
              ENGINEERING TRANSPARENCY FOR DEVELOPERS.
            </h1>

            <p className="text-sm text-muted-foreground font-sans leading-relaxed">
              I am <strong>Noufel seif el islam Nasri</strong>, a full-stack engineer and architect passionate about building deterministic developer tools, intuitive developer experiences, and playful retro interfaces.
            </p>

            <p className="text-sm text-muted-foreground font-sans leading-relaxed">
              I created <strong>DevScope</strong> to tackle a major challenge in technical recruiting: generic tutorial clones and surface-level GitHub profiles that fail to reflect a developer's genuine capabilities. DevScope translates raw GitHub activity into actionable engineering scorecards and an RPG quest log to guide real portfolio growth.
            </p>

            {/* Quick Stat Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-4 border-t border-border font-mono text-xs">
              <div className="p-2.5 sm:p-3 bg-secondary border border-border min-w-0 overflow-hidden">
                <span className="text-[10px] text-muted-foreground block truncate">PUBLIC REPOS</span>
                <span className="text-sm sm:text-base font-bold text-foreground truncate block">40+ Projects</span>
              </div>
              <div className="p-2.5 sm:p-3 bg-secondary border border-border min-w-0 overflow-hidden">
                <span className="text-[10px] text-muted-foreground block truncate">PRIMARY STACK</span>
                <span className="text-sm sm:text-base font-bold text-neon-cyan truncate block">Next.js / TS</span>
              </div>
              <div className="p-2.5 sm:p-3 bg-secondary border border-border min-w-0 overflow-hidden">
                <span className="text-[10px] text-muted-foreground block truncate">AUDIT ENGINE</span>
                <span className="text-sm sm:text-base font-bold text-neon-green truncate block">Deterministic</span>
              </div>
              <div className="p-2.5 sm:p-3 bg-secondary border border-border min-w-0 overflow-hidden">
                <span className="text-[10px] text-muted-foreground block truncate">DEVSCOPE RANK</span>
                <span className="text-sm sm:text-base font-bold text-neon-yellow truncate block">Rank S</span>
              </div>
            </div>

            {/* Direct Audit CTA - Fully Responsive with No Overflows */}
            <div className="pt-3  flex flex-col sm:flex-row items-stretch sm:items-center gap-5">
              <Link href="/report/Noufel-sf" className="w-full sm:w-auto">
                <Button
                  onClick={() => arcadeAudio.playClick()}
                  className="w-full sm:w-auto bg-primary text-white hover:bg-primary/90 font-['Press_Start_2P'] text-[10px] sm:text-xs py-3 px-5 shadow-[0_0_15px_rgba(168,85,247,0.4)] cursor-pointer flex items-center justify-center gap-2"
                >
                  <Trophy className="w-3.5 h-3.5 text-neon-yellow shrink-0" />
                  <span>VIEW CREATOR AUDIT</span>
                </Button>
              </Link>

              <Link href="/audit/Noufel-sf" className="w-full sm:w-auto">
                <Button
                  onClick={() => arcadeAudio.playClick()}
                  variant="outline"
                  className="w-full sm:w-auto bg-card text-neon-cyan border-border hover:bg-muted text-xs font-mono font-bold py-3 px-4 flex items-center justify-center gap-2"
                >
                  <Terminal className="w-3.5 h-3.5 text-neon-cyan shrink-0" />
                  <span>Live Console Audit</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* SOCIALS & CHANNELS SECTION */}
      <div>
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-mono text-neon-cyan tracking-widest block mb-2 font-bold uppercase">
            [ DIRECT CHANNELS ]
          </span>
          <h2 className="font-['Press_Start_2P'] text-xl sm:text-2xl text-foreground tracking-tight mb-2">
            CONNECT WITH NOUFEL
          </h2>
          <p className="text-sm text-muted-foreground font-sans">
            Reach out for collaborations, architecture discussions, or follow my software engineering journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {socialLinks.map((social) => {
            const Icon = social.icon;
            return (
              <div
                key={social.platform}
                className={`bg-card border-2 p-6 flex flex-col justify-between transition-all group ${social.accentBorder} shadow-[0_0_20px_rgba(0,0,0,0.15)]`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-secondary border border-border flex items-center justify-center">
                      <Icon className="w-5 h-5 text-foreground group-hover:scale-110 transition-transform" />
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 border font-bold ${social.badgeColor}`}>
                      {social.platform.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="font-['Press_Start_2P'] text-xs text-foreground mb-1">
                    {social.platform}
                  </h3>
                  <span className="text-xs font-mono text-neon-cyan font-bold block mb-3 truncate">
                    {social.handle}
                  </span>

                  <p className="text-xs text-muted-foreground leading-relaxed font-sans mb-6">
                    {social.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-border">
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => arcadeAudio.playClick()}
                    className="block w-full"
                  >
                    <Button
                      size="sm"
                      className={`w-full text-xs font-mono py-2.5 font-bold flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${social.btnClass}`}
                    >
                      <span className="truncate">Connect on {social.platform}</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-1 shrink-0" />
                    </Button>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* WHY DEVSCOPE WAS BUILT */}
      <div className="bg-secondary/40 border-2 border-border p-8 sm:p-10 space-y-6">
        <div className="flex items-center gap-3 text-neon-yellow">
          <Zap className="w-6 h-6 shrink-0" />
          <h3 className="font-['Press_Start_2P'] text-sm sm:text-base text-foreground">
            THE DEVSCOPE PHILOSOPHY
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          <div className="p-4 bg-background border border-border space-y-2">
            <span className="text-primary font-bold text-sm block">01 // NO FLUFF</span>
            <h4 className="font-bold text-foreground text-xs">100% Deterministic</h4>
            <p className="text-muted-foreground leading-relaxed font-sans text-xs">
              Every score metric is backed by tangible GitHub repository evidence: commit frequency, licensing, README structure, and test suite presence.
            </p>
          </div>

          <div className="p-4 bg-background border border-border space-y-2">
            <span className="text-neon-cyan font-bold text-sm block">02 // RPG MOTIVATION</span>
            <h4 className="font-bold text-foreground text-xs">Gamified Quest Progression</h4>
            <p className="text-muted-foreground leading-relaxed font-sans text-xs">
              Instead of overwhelming developers with vague critique, technical debt is transformed into bite-sized RPG quests with XP and rank milestones.
            </p>
          </div>

          <div className="p-4 bg-background border border-border space-y-2">
            <span className="text-neon-green font-bold text-sm block">03 // REAL IMPACT</span>
            <h4 className="font-bold text-foreground text-xs">Recruiter Reality Alignment</h4>
            <p className="text-muted-foreground leading-relaxed font-sans text-xs">
              Tuned directly to what technical recruiters and engineering managers evaluate in the first 60 seconds of reviewing a candidate's GitHub.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

