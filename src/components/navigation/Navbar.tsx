"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Terminal, Volume2, VolumeX, Menu, X, Sun, Moon, ArrowRight } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/8bit/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { arcadeAudio } from "@/lib/sound/audio";
import { useTheme } from "next-themes";
import { useMobile } from "@/hooks/useMobile";

export function Navbar() {
  const isMobile = useMobile();
  const [muted, setMuted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  // Close mobile menu if resizing to desktop
  useEffect(() => {
    if (!isMobile && mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }, [isMobile, mobileMenuOpen]);

  useEffect(() => {
    setMuted(arcadeAudio.getMuted());
  }, []);

  const handleToggleSound = () => {
    const nextMuted = arcadeAudio.toggleMute();
    setMuted(nextMuted);
  };

  const toggleMobileMenu = () => {
    arcadeAudio.playClick();
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  const isDark = resolvedTheme === "dark";

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" onClick={closeMenu} className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-card border-2 border-neon-cyan flex items-center justify-center relative shadow-[0_0_10px_rgba(34,211,238,0.3)] group-hover:shadow-[0_0_15px_rgba(34,211,238,0.6)] transition-all">
              <span className="text-neon-cyan font-mono text-xl font-bold tracking-tighter">
                &gt;_
              </span>
              <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-neon-pink" />
              <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-neon-green" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-['Press_Start_2P'] text-sm tracking-wider text-foreground">
                  DEV<span className="text-primary">SCOPE</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.2 bg-neon-pink/20 text-neon-pink border border-neon-pink/40 font-mono font-bold">
                  v1.0
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground font-mono">
                GITHUB AUDITING ENGINE
              </p>
            </div>
          </Link>

          {/* Desktop Center Nav */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-wide">
            <Link
              href="/"
              className="text-foreground hover:text-neon-cyan transition-colors flex items-center gap-1.5"
            >
              <span>[01]</span> HOME
            </Link>
            <Link
              href="/#how-it-works"
              className="text-muted-foreground hover:text-neon-cyan transition-colors flex items-center gap-1.5"
            >
              <span>[02]</span> HOW IT WORKS
            </Link>
            <Link
              href="/#categories"
              className="text-muted-foreground hover:text-neon-cyan transition-colors flex items-center gap-1.5"
            >
              <span>[03]</span> AUDIT METRICS
            </Link>
            <Link
              href="/leaderboard"
              className="text-muted-foreground hover:text-neon-cyan transition-colors flex items-center gap-1.5"
            >
              <span>[04]</span> HALL OF FAME
            </Link>
          </nav>

          {/* Desktop Controls & Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />

            <button
              onClick={handleToggleSound}
              title={muted ? "Enable Arcade SFX" : "Mute Arcade SFX"}
              className="p-2 bg-card border border-border hover:border-neon-cyan text-neon-cyan transition-colors flex items-center gap-1.5 text-xs font-mono cursor-pointer"
            >
              {muted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-destructive" />
                  <span className="text-[10px] text-muted-foreground">SFX OFF</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-neon-green" />
                  <span className="text-[10px] text-neon-green">SFX ON</span>
                </>
              )}
            </button>

            <Link href="/audit/torvalds">
              <Button
                variant="outline"
                size="sm"
                className="bg-card text-neon-cyan border-border hover:bg-muted text-[11px]"
              >
                Demo Audit
              </Button>
            </Link>

            <Link href="/#audit-form">
              <Button
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 border-none shadow-[0_0_15px_rgba(168,85,247,0.4)] text-[11px] font-bold"
              >
                <Terminal className="w-3.5 h-3.5 mr-1" />
                START AUDIT
              </Button>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleMobileMenu}
              aria-label="Toggle navigation menu"
              className="p-2 bg-card border-2 border-border hover:border-neon-cyan text-neon-cyan transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-neon-pink" />
              ) : (
                <Menu className="w-5 h-5 text-neon-cyan" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE SIDEBAR DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end">
          {/* Backdrop overlay */}
          <div
            onClick={closeMenu}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Content */}
          <div className="relative w-4/5 max-w-sm h-full bg-secondary border-l-2 border-border shadow-[0_0_30px_rgba(0,0,0,0.8)] flex flex-col justify-between p-6 z-10 overflow-y-auto">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-border/60 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-card border border-neon-cyan flex items-center justify-center font-bold text-xs text-neon-cyan">
                    &gt;
                  </div>
                  <span className="font-['Press_Start_2P'] text-xs text-foreground">
                    ARCADE MENU
                  </span>
                </div>
                <button
                  onClick={closeMenu}
                  className="p-1.5 text-muted-foreground hover:text-neon-pink cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-3 font-mono text-sm mb-8">
                <Link
                  href="/"
                  onClick={closeMenu}
                  className="flex items-center justify-between p-3 bg-card border border-border/60 hover:border-neon-cyan text-foreground transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-neon-cyan text-xs font-bold">[01]</span> HOME
                  </span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </Link>

                <Link
                  href="/#how-it-works"
                  onClick={closeMenu}
                  className="flex items-center justify-between p-3 bg-card border border-border/60 hover:border-neon-cyan text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-primary text-xs font-bold">[02]</span> HOW IT WORKS
                  </span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </Link>

                <Link
                  href="/#categories"
                  onClick={closeMenu}
                  className="flex items-center justify-between p-3 bg-card border border-border/60 hover:border-neon-cyan text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-neon-pink text-xs font-bold">[03]</span> AUDIT METRICS
                  </span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </Link>

                <Link
                  href="/leaderboard"
                  onClick={closeMenu}
                  className="flex items-center justify-between p-3 bg-card border border-border/60 hover:border-neon-cyan text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-neon-yellow text-xs font-bold">[04]</span> HALL OF FAME
                  </span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </Link>
              </nav>

              {/* SYSTEM CONTROLS (Theme & Audio) */}
              <div className="space-y-3 pt-4 border-t border-border/60">
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-1">
                  System Preferences
                </span>

                {/* Mobile Theme Changer */}
                <button
                  onClick={() => {
                    arcadeAudio.playClick();
                    setTheme(isDark ? "light" : "dark");
                  }}
                  className="w-full flex items-center justify-between p-3 bg-card border border-border hover:border-neon-cyan text-xs font-mono transition-colors cursor-pointer"
                >
                  <span className="text-muted-foreground flex items-center gap-2">
                    {isDark ? (
                      <Moon className="w-4 h-4 text-primary" />
                    ) : (
                      <Sun className="w-4 h-4 text-neon-yellow" />
                    )}
                    <span>THEME MODE:</span>
                  </span>
                  <span className={`font-bold ${isDark ? "text-primary" : "text-neon-yellow"}`}>
                    {isDark ? "OBSIDIAN BLACK" : "DAY ARCADE (WHITE)"}
                  </span>
                </button>

                {/* Mobile SFX Sound Toggle */}
                <button
                  onClick={handleToggleSound}
                  className="w-full flex items-center justify-between p-3 bg-card border border-border hover:border-neon-cyan text-xs font-mono transition-colors cursor-pointer"
                >
                  <span className="text-muted-foreground flex items-center gap-2">
                    {muted ? (
                      <VolumeX className="w-4 h-4 text-destructive" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-neon-green" />
                    )}
                    <span>ARCADE SFX:</span>
                  </span>
                  <span className={`font-bold ${muted ? "text-destructive" : "text-neon-green"}`}>
                    {muted ? "MUTED" : "ENABLED"}
                  </span>
                </button>
              </div>
            </div>

            {/* Mobile Bottom Action */}
            <div className="pt-6 border-t border-border/60">
              <Link href="/#audit-form" onClick={closeMenu}>
                <Button
                  size="lg"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 border-none font-['Press_Start_2P'] text-xs py-3.5 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                >
                  <Terminal className="w-3.5 h-3.5 mr-2" />
                  START AUDIT
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
