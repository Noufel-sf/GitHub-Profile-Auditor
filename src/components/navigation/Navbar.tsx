"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Terminal, Volume2, VolumeX } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/8bit/button";
import { arcadeAudio } from "@/lib/sound/audio";

export function Navbar() {
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    setMuted(arcadeAudio.getMuted());
  }, []);

  const handleToggleSound = () => {
    const nextMuted = arcadeAudio.toggleMute();
    setMuted(nextMuted);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#30395D] bg-[#080B20]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
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

        {/* Center Nav */}
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

        {/* Sound Toggle & Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Audio FX Toggle */}
          <button
            onClick={handleToggleSound}
            title={muted ? "Enable Arcade SFX" : "Mute Arcade SFX"}
            className="p-2 bg-[#111832] border border-[#30395D] hover:border-[#22D3EE] text-[#22D3EE] transition-colors flex items-center gap-1.5 text-xs font-mono cursor-pointer"
          >
            {muted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-[#EF4444]" />
                <span className="hidden sm:inline text-[10px] text-[#707B9C]">SFX OFF</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#A3E635]" />
                <span className="hidden sm:inline text-[10px] text-[#A3E635]">SFX ON</span>
              </>
            )}
          </button>

          <Link href="/audit/torvalds">
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:inline-flex bg-[#111832] text-[#22D3EE] border-[#30395D] hover:bg-[#171F3D] text-[11px]"
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
      </div>
    </header>
  );
}
