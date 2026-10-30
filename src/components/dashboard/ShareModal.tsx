"use client";

import { useState } from "react";
import { X, Check, Copy, Share2, Sparkles, Trophy } from "lucide-react";
import { Button } from "@/components/ui/8bit/button";
import { arcadeAudio } from "@/lib/sound/audio";

interface ShareModalProps {
  username: string;
  score: number;
  grade: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareModal({
  username,
  score,
  grade,
  isOpen,
  onClose,
}: ShareModalProps) {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!isOpen) return null;

  const origin = typeof window !== "undefined" ? window.location.origin : "https://devscope.app";
  const badgeUrl = `${origin}/api/badge/${username}`;
  const reportUrl = `${origin}/report/${username}`;

  const markdownSnippet = `[![DevScope Audit](${badgeUrl})](${reportUrl})`;
  const htmlSnippet = `<a href="${reportUrl}"><img src="${badgeUrl}" alt="DevScope Audit Score" /></a>`;

  const handleCopy = (text: string, type: string) => {
    arcadeAudio.playClick();
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const shareText = encodeURIComponent(
    `Just audited my GitHub engineering presence with DEV SCOPE! 🎮\n\nScore: ${score}/100 [Rank ${grade}]\nCheck out my audit report & RPG quest roadmap:\n`
  );
  const twitterUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(reportUrl)}`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(reportUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-[#0D1228] border-2 border-[#30395D] p-6 shadow-[0_0_35px_rgba(34,211,238,0.2)] font-mono">
        {/* Pixel Corners */}
        <div className="absolute -top-1 -left-1 w-2 h-2 bg-[#22D3EE]" />
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#EC4899]" />
        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-[#A3E635]" />
        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#FACC15]" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#202A4A] mb-5">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#FACC15]" />
            <h3 className="font-['Press_Start_2P'] text-xs text-[#F8FAFC]">
              SHARE &amp; EMBED BADGE
            </h3>
          </div>
          <button
            onClick={() => {
              arcadeAudio.playClick();
              onClose();
            }}
            className="p-1 text-[#707B9C] hover:text-[#EC4899] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live SVG Badge Preview */}
        <div className="mb-6 p-4 bg-[#080B20] border border-[#202A4A] text-center space-y-2">
          <span className="text-[10px] text-[#707B9C] uppercase block">
            Live GitHub README Badge Preview:
          </span>
          <div className="flex items-center justify-center py-2">
            <img
              src={`/api/badge/${encodeURIComponent(username)}`}
              alt="DevScope Badge Preview"
              className="inline-block shadow-[0_0_10px_rgba(34,211,238,0.2)]"
            />
          </div>
        </div>

        {/* Markdown Snippet */}
        <div className="space-y-4 mb-6">
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-[#22D3EE] font-bold">1. MARKDOWN (for GitHub README.md)</span>
              {copiedType === "md" && (
                <span className="text-[11px] text-[#A3E635] flex items-center gap-1 font-bold">
                  <Check className="w-3 h-3" /> COPIED!
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={markdownSnippet}
                className="w-full bg-[#111832] border border-[#30395D] px-3 py-2 text-xs text-[#A5AEC9] select-all focus:outline-none"
              />
              <Button
                size="sm"
                onClick={() => handleCopy(markdownSnippet, "md")}
                className="bg-[#22D3EE] text-[#080B20] hover:bg-[#06b6d4] font-bold text-xs shrink-0"
              >
                <Copy className="w-3.5 h-3.5 mr-1" /> Copy
              </Button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-[#A855F7] font-bold">2. DIRECT AUDIT LINK</span>
              {copiedType === "url" && (
                <span className="text-[11px] text-[#A3E635] flex items-center gap-1 font-bold">
                  <Check className="w-3 h-3" /> COPIED!
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={reportUrl}
                className="w-full bg-[#111832] border border-[#30395D] px-3 py-2 text-xs text-[#A5AEC9] select-all focus:outline-none"
              />
              <Button
                size="sm"
                onClick={() => handleCopy(reportUrl, "url")}
                className="bg-[#A855F7] text-white hover:bg-[#9333ea] font-bold text-xs shrink-0"
              >
                <Copy className="w-3.5 h-3.5 mr-1" /> Copy
              </Button>
            </div>
          </div>
        </div>

        {/* Social Share Buttons */}
        <div className="pt-4 border-t border-[#202A4A] flex flex-col sm:flex-row items-center gap-3">
          <span className="text-xs text-[#707B9C]">SHARE DIRECTLY:</span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href={twitterUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-none"
            >
              <Button
                size="sm"
                className="w-full bg-[#111832] border border-[#30395D] hover:border-[#22D3EE] text-[#22D3EE] text-xs font-mono"
              >
                Post on 𝕏
              </Button>
            </a>
            <a
              href={linkedInUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-none"
            >
              <Button
                size="sm"
                className="w-full bg-[#111832] border border-[#30395D] hover:border-[#A855F7] text-[#A855F7] text-xs font-mono"
              >
                LinkedIn
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

