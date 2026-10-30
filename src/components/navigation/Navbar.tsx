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
      <header className="sticky top-0 z-40 w-full border-b border-[#30395D] bg-[#080B20]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" onClick={closeMenu} className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#111832] border-2 border-[#22D3EE] flex items-center justify-center relative shadow-[0_0_10px_rgba(34,211,238,0.3)] group-hover:shadow-[0_0_15px_rgba(34,211,238,0.6)] transition-all">
              <span className="text-[#22D3EE] font-mono text-xl font-bold tracking-tighter">
                &gt;_
              </span>
              <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-[#EC4899]" />
              <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-[#A3E635]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-['Press_Start_2P'] text-sm tracking-wider text-[#F8FAFC]">
                  DEV<span className="text-[#A855F7]">SCOPE</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.2 bg-[#EC4899]/20 text-[#EC4899] border border-[#EC4899]/40 font-mono font-bold">
                  v1.0
                </span>
              </div>
              <p className="text-[10px] text-[#707B9C] font-mono">
                GITHUB AUDITING ENGINE
              </p>
            </div>
          </Link>

          {/* Desktop Center Nav */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-wide">
            <Link
              href="/"
              className="text-[#F8FAFC] hover:text-[#22D3EE] transition-colors flex items-center gap-1.5"
            >
              <span>[01]</span> HOME
            </Link>
            <Link
              href="/#how-it-works"
              className="text-[#A5AEC9] hover:text-[#22D3EE] transition-colors flex items-center gap-1.5"
            >
              <span>[02]</span> HOW IT WORKS
            </Link>
            <Link
              href="/#categories"
              className="text-[#A5AEC9] hover:text-[#22D3EE] transition-colors flex items-center gap-1.5"
            >
              <span>[03]</span> AUDIT METRICS
            </Link>
            <Link
              href="/audit/torvalds"
              className="text-[#A5AEC9] hover:text-[#22D3EE] transition-colors flex items-center gap-1.5"
            >
              <span>[04]</span> DEMO
            </Link>
          </nav>

          {/* Desktop Controls & Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />

            <button
              onClick={handleToggleSound}
              title={muted ? "Enable Arcade SFX" : "Mute Arcade SFX"}
              className="p-2 bg-[#111832] border border-[#30395D] hover:border-[#22D3EE] text-[#22D3EE] transition-colors flex items-center gap-1.5 text-xs font-mono cursor-pointer"
            >
              {muted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-[#EF4444]" />
                  <span className="text-[10px] text-[#707B9C]">SFX OFF</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#A3E635]" />
                  <span className="text-[10px] text-[#A3E635]">SFX ON</span>
                </>
              )}
            </button>

            <Link href="/audit/torvalds">
              <Button
                variant="outline"
                size="sm"
                className="bg-[#111832] text-[#22D3EE] border-[#30395D] hover:bg-[#171F3D] text-[11px]"
              >
                Demo Audit
              </Button>
            </Link>

            <Link href="/#audit-form">
              <Button
                size="sm"
                className="bg-[#A855F7] text-white hover:bg-[#9333ea] border-none shadow-[0_0_15px_rgba(168,85,247,0.4)] text-[11px] font-bold"
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
              className="p-2 bg-[#111832] border-2 border-[#30395D] hover:border-[#22D3EE] text-[#22D3EE] transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-[#EC4899]" />
              ) : (
                <Menu className="w-5 h-5 text-[#22D3EE]" />
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Content */}
          <div className="relative w-4/5 max-w-sm h-full bg-[#0D1228] border-l-2 border-[#30395D] shadow-[0_0_30px_rgba(0,0,0,0.8)] flex flex-col justify-between p-6 z-10 overflow-y-auto">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#202A4A] mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-[#111832] border border-[#22D3EE] flex items-center justify-center font-bold text-xs text-[#22D3EE]">
                    &gt;
                  </div>
                  <span className="font-['Press_Start_2P'] text-xs text-[#F8FAFC]">
                    ARCADE MENU
                  </span>
                </div>
                <button
                  onClick={closeMenu}
                  className="p-1.5 text-[#707B9C] hover:text-[#EC4899] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-3 font-mono text-sm mb-8">
                <Link
                  href="/"
                  onClick={closeMenu}
                  className="flex items-center justify-between p-3 bg-[#111832] border border-[#202A4A] hover:border-[#22D3EE] text-[#F8FAFC] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-[#22D3EE] text-xs font-bold">[01]</span> HOME
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#707B9C]" />
                </Link>

                <Link
                  href="/#how-it-works"
                  onClick={closeMenu}
                  className="flex items-center justify-between p-3 bg-[#111832] border border-[#202A4A] hover:border-[#22D3EE] text-[#A5AEC9] hover:text-[#F8FAFC] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-[#A855F7] text-xs font-bold">[02]</span> HOW IT WORKS
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#707B9C]" />
                </Link>

                <Link
                  href="/#categories"
                  onClick={closeMenu}
                  className="flex items-center justify-between p-3 bg-[#111832] border border-[#202A4A] hover:border-[#22D3EE] text-[#A5AEC9] hover:text-[#F8FAFC] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-[#EC4899] text-xs font-bold">[03]</span> AUDIT METRICS
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#707B9C]" />
                </Link>

                <Link
                  href="/audit/torvalds"
                  onClick={closeMenu}
                  className="flex items-center justify-between p-3 bg-[#111832] border border-[#202A4A] hover:border-[#22D3EE] text-[#A5AEC9] hover:text-[#F8FAFC] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-[#A3E635] text-xs font-bold">[04]</span> SAMPLE DEMO
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#707B9C]" />
                </Link>
              </nav>

              {/* SYSTEM CONTROLS (Theme & Audio) */}
              <div className="space-y-3 pt-4 border-t border-[#202A4A]">
                <span className="text-[10px] font-mono text-[#707B9C] uppercase tracking-wider block mb-1">
                  System Preferences
                </span>

                {/* Mobile Theme Changer */}
                <button
                  onClick={() => {
                    arcadeAudio.playClick();
                    setTheme(isDark ? "light" : "dark");
                  }}
                  className="w-full flex items-center justify-between p-3 bg-[#111832] border border-[#30395D] hover:border-[#22D3EE] text-xs font-mono transition-colors cursor-pointer"
                >
                  <span className="text-[#A5AEC9] flex items-center gap-2">
                    {isDark ? (
                      <Moon className="w-4 h-4 text-[#A855F7]" />
                    ) : (
                      <Sun className="w-4 h-4 text-[#FACC15]" />
                    )}
                    <span>THEME MODE:</span>
                  </span>
                  <span className={`font-bold ${isDark ? "text-[#A855F7]" : "text-[#FACC15]"}`}>
                    {isDark ? "NIGHT ARCADE" : "DAY ARCADE (WHITE)"}
                  </span>
                </button>

                {/* Mobile SFX Sound Toggle */}
                <button
                  onClick={handleToggleSound}
                  className="w-full flex items-center justify-between p-3 bg-[#111832] border border-[#30395D] hover:border-[#22D3EE] text-xs font-mono transition-colors cursor-pointer"
                >
                  <span className="text-[#A5AEC9] flex items-center gap-2">
                    {muted ? (
                      <VolumeX className="w-4 h-4 text-[#EF4444]" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-[#A3E635]" />
                    )}
                    <span>ARCADE SFX:</span>
                  </span>
                  <span className={`font-bold ${muted ? "text-[#EF4444]" : "text-[#A3E635]"}`}>
                    {muted ? "MUTED" : "ENABLED"}
                  </span>
                </button>
              </div>
            </div>

            {/* Mobile Bottom Action */}
            <div className="pt-6 border-t border-[#202A4A]">
              <Link href="/#audit-form" onClick={closeMenu}>
                <Button
                  size="lg"
                  className="w-full bg-[#A855F7] text-white hover:bg-[#9333ea] border-none font-['Press_Start_2P'] text-xs py-3.5 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
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
