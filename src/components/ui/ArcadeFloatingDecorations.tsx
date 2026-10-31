"use client";

import React from "react";

interface ArcadeFloatingDecorationsProps {
  className?: string;
  variant?: "hero" | "compact";
}

export function ArcadeFloatingDecorations({
  className = "",
  variant = "hero",
}: ArcadeFloatingDecorationsProps) {
  if (variant === "compact") {
    return (
      <div
        aria-hidden="true"
        className={`pointer-events-none select-none absolute inset-0 overflow-hidden z-0 ${className}`}
      >
        {/* Top-left Zigzag */}
        <div className="absolute top-4 left-6 arcade-float opacity-80">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-neon-yellow drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]">
            <path d="M4 16L9 9L14 15L20 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Top-right Cyan Triangle */}
        <div className="absolute top-5 right-8 arcade-float-slow opacity-85">
          <svg width="20" height="20" viewBox="0 0 22 22" fill="none" className="text-neon-cyan drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]">
            <polygon points="11,3 20,18 2,18" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Bottom-left Pink Diamond */}
        <div className="absolute bottom-5 left-10 arcade-float-fast opacity-80">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="text-neon-pink drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]">
            <rect x="3" y="3" width="13" height="13" transform="rotate(25 10 10)" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>

        {/* Bottom-right Green Dot & Blue Donut */}
        <div className="absolute bottom-4 right-12 arcade-pulse-slow opacity-85 flex items-center gap-3">
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none" className="text-neon-blue drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]">
            <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="2.5" />
          </svg>
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="text-neon-green">
            <circle cx="6" cy="6" r="4.5" fill="currentColor" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none absolute inset-0 overflow-hidden z-0 ${className}`}
    >
      {/* ================= LEFT SIDE SCATTER ================= */}

      {/* 1. Neon Yellow Zigzag (Top-Left) */}
      <div className="absolute top-6 left-4 sm:left-10 lg:left-16 arcade-float opacity-90">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="text-neon-yellow drop-shadow-[0_0_10px_rgba(250,204,21,0.6)]">
          <path d="M4 16L9 9L14 15L20 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* 2. Neon Cyan Solid Small Dot (Near Top-Left) */}
      <div className="absolute top-14 left-14 sm:left-24 lg:left-36 arcade-pulse-slow opacity-80">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="text-neon-cyan drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]">
          <circle cx="5" cy="5" r="4" fill="currentColor" />
        </svg>
      </div>

      {/* 3. Neon Pink Tilted Diamond / Square (Mid-Left Upper) */}
      <div className="absolute top-32 left-3 sm:left-8 lg:left-14 arcade-float-slow opacity-90">
        <svg width="22" height="22" viewBox="0 0 20 20" fill="none" className="text-neon-pink drop-shadow-[0_0_10px_rgba(244,63,94,0.6)]">
          <rect x="3" y="3" width="13" height="13" transform="rotate(25 10 10)" stroke="currentColor" strokeWidth="2.2" />
        </svg>
      </div>

      {/* 4. Neon Purple Circle Donut Ring (Mid-Left Lower) */}
      <div className="absolute top-48 left-8 sm:left-20 lg:left-28 arcade-float-fast opacity-85">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-neon-purple drop-shadow-[0_0_8px_rgba(168,85,247,0.7)]">
          <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="2.5" />
        </svg>
      </div>

      {/* 5. Neon Green Solid Dot (Bottom-Left Outer) */}
      <div className="absolute top-64 left-4 sm:left-12 lg:left-20 arcade-pulse-slow opacity-85">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-neon-green drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]">
          <circle cx="6" cy="6" r="4.5" fill="currentColor" />
        </svg>
      </div>

      {/* 6. Neon Blue Pill / Oval Capsule (Bottom-Left Lower) */}
      <div className="hidden sm:block absolute bottom-12 left-10 lg:left-24 arcade-float-slow opacity-80">
        <svg width="26" height="16" viewBox="0 0 26 16" fill="none" className="text-neon-blue drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">
          <rect x="2" y="2" width="22" height="12" rx="6" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      {/* 7. Neon Yellow Cross / Plus (Bottom-Left Inner) */}
      <div className="hidden md:block absolute bottom-28 left-28 lg:left-44 arcade-float opacity-80">
        <svg width="16" height="16" viewBox="0 0 18 18" fill="none" className="text-neon-yellow drop-shadow-[0_0_6px_rgba(250,204,21,0.6)]">
          <path d="M9 3v12M3 9h12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* ================= RIGHT SIDE SCATTER ================= */}

      {/* 8. Neon Cyan Triangle / Delta (Top-Right) */}
      <div className="absolute top-8 right-6 sm:right-12 lg:right-20 arcade-float-slow opacity-90">
        <svg width="24" height="24" viewBox="0 0 22 22" fill="none" className="text-neon-cyan drop-shadow-[0_0_10px_rgba(34,211,238,0.7)]">
          <polygon points="11,3 20,18 2,18" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      </div>

      {/* 9. Neon Pink Solid Dot (Top-Right Upper) */}
      <div className="absolute top-12 right-16 sm:right-28 lg:right-40 arcade-pulse-slow opacity-85">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-neon-pink drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]">
          <circle cx="6" cy="6" r="4.5" fill="currentColor" />
        </svg>
      </div>

      {/* 10. Neon Blue Donut Ring (Mid-Right Upper) */}
      <div className="absolute top-28 right-4 sm:right-10 lg:right-16 arcade-float opacity-90">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="text-neon-blue drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]">
          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2.5" />
        </svg>
      </div>

      {/* 11. Neon Yellow Tiny Dot (Mid-Right Inner) */}
      <div className="hidden sm:block absolute top-40 right-20 sm:right-32 lg:right-44 arcade-pulse-slow opacity-85">
        <svg width="9" height="9" viewBox="0 0 10 10" fill="none" className="text-neon-yellow drop-shadow-[0_0_6px_rgba(250,204,21,0.8)]">
          <circle cx="5" cy="5" r="3.5" fill="currentColor" />
        </svg>
      </div>

      {/* 12. Neon Pink Hollow Donut / Oval (Mid-Right Lower) */}
      <div className="absolute top-52 right-8 sm:right-16 lg:right-28 arcade-float-fast opacity-90">
        <svg width="22" height="18" viewBox="0 0 22 18" fill="none" className="text-neon-pink drop-shadow-[0_0_8px_rgba(236,72,153,0.7)]">
          <ellipse cx="11" cy="9" rx="8" ry="6" stroke="currentColor" strokeWidth="2.2" />
        </svg>
      </div>

      {/* 13. Neon Green Rotated Diamond (Bottom-Right Outer) */}
      <div className="absolute top-68 right-4 sm:right-12 lg:right-18 arcade-float-slow opacity-85">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-neon-green drop-shadow-[0_0_8px_rgba(74,222,128,0.7)]">
          <rect x="3" y="3" width="11" height="11" transform="rotate(45 9 9)" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      {/* 14. Neon Cyan Ring Donut (Bottom-Right Lower) */}
      <div className="hidden sm:block absolute bottom-12 right-12 lg:right-24 arcade-float opacity-85">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-neon-cyan drop-shadow-[0_0_8px_rgba(34,211,238,0.7)]">
          <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      {/* 15. Neon Purple Star Sparkle (Bottom-Right Inner) */}
      <div className="hidden md:block absolute bottom-24 right-28 lg:right-40 arcade-float-fast opacity-80">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-neon-purple drop-shadow-[0_0_8px_rgba(168,85,247,0.7)]">
          <path d="M9 2v14M2 9h14M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}
