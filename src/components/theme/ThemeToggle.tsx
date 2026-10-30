"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { arcadeAudio } from "@/lib/sound/audio";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-8 h-8 bg-[#111832] border border-[#30395D] opacity-50" />
    );
  }

  const isDark = resolvedTheme === "dark";

  const handleToggle = () => {
    arcadeAudio.playClick();
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      onClick={handleToggle}
      title={isDark ? "Switch to White / Light Mode" : "Switch to Night / Dark Mode"}
      className="p-2 bg-[#111832] border border-[#30395D] hover:border-[#22D3EE] text-[#F8FAFC] transition-colors flex items-center gap-1.5 text-xs font-mono cursor-pointer"
    >
      {isDark ? (
        <>
          <Sun className="w-3.5 h-3.5 text-[#FACC15]" />
          <span className="hidden sm:inline text-[10px] text-[#A5AEC9]">LIGHT</span>
        </>
      ) : (
        <>
          <Moon className="w-3.5 h-3.5 text-[#A855F7]" />
          <span className="hidden sm:inline text-[10px] text-[#475569]">DARK</span>
        </>
      )}
    </button>
  );
}

