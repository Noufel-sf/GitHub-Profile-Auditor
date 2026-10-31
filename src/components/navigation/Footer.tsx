import Link from "next/link";
import { GithubIcon } from "@/components/ui/icons";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background text-muted-foreground text-xs font-mono relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-card border border-neon-cyan flex items-center justify-center">
                <span className="text-neon-cyan font-mono text-xs font-bold">&gt;</span>
              </div>
              <span className="font-['Press_Start_2P'] text-xs text-foreground">
                DEV<span className="text-primary">SCOPE</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground/80 max-w-md leading-relaxed">
              Transparent, deterministic GitHub profile & repository auditor. Built to provide developers with genuine engineering feedback, actionable roadmaps, and portfolio improvements.
            </p>
            <div className="flex items-center gap-3 pt-2 text-muted-foreground/70">
              <span className="inline-flex items-center gap-1 text-[11px] text-neon-green">
                <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                SYSTEM ONLINE
              </span>
              <span>•</span>
              <span className="text-[11px]">8BITCN READY</span>
              <span>•</span>
              <span className="text-[11px]">NEXT.JS APP ROUTER</span>
            </div>
          </div>

          <div>
            <h4 className="text-foreground font-['Press_Start_2P'] text-[10px] mb-3 text-neon-cyan">
              NAVIGATION
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <Link href="/#features" className="hover:text-neon-cyan transition-colors">
                  &gt; Feature Arsenal
                </Link>
              </li>
              <li>
                <Link href="/#why-it-matters" className="hover:text-neon-pink transition-colors">
                  &gt; Recruiter Reality Check
                </Link>
              </li>
              <li>
                <Link href="/#categories" className="hover:text-neon-green transition-colors">
                  &gt; Audit Weights (5-Axis)
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-neon-yellow transition-colors">
                  &gt; Knowledge Base // FAQ
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-primary transition-colors">
                  &gt; Arcade Hall of Fame
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-foreground font-['Press_Start_2P'] text-[10px] mb-3 text-neon-pink">
              LIVE SAMPLES
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <Link href="/audit/torvalds" className="hover:text-foreground transition-colors">
                  &gt; Live Audit: @torvalds
                </Link>
              </li>
              <li>
                <Link href="/report/shadcn" className="hover:text-foreground transition-colors">
                  &gt; Report: @shadcn
                </Link>
              </li>
              <li>
                <Link href="/report/shadcn/roadmap" className="hover:text-foreground transition-colors">
                  &gt; RPG Quests: @shadcn
                </Link>
              </li>
              <li>
                <Link href="/api/badge/torvalds" target="_blank" className="hover:text-foreground transition-colors">
                  &gt; SVG Badge Endpoint
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-foreground transition-colors flex items-center gap-1"
                >
                  <GithubIcon className="w-3 h-3" /> GitHub REST API
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-muted-foreground/70">
          <p>© 2026 DEVSCOPE. Built with retro arcade aesthetic & modern engineering.</p>
          <p className="flex items-center gap-1">
            Deterministic Engine + AI Insights
          </p>
        </div>
      </div>
    </footer>
  );
}
