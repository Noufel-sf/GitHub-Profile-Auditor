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
      <div className="w-8 h-8 bg-card border border-border opacity-50" />
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
      className="p-2 bg-card border border-border hover:border-neon-cyan text-foreground transition-colors flex items-center gap-1.5 text-xs font-mono cursor-pointer"
    >
      {isDark ? (
        <>
          <Sun className="w-3.5 h-3.5 text-neon-yellow" />
          <span className="hidden sm:inline text-[10px] text-muted-foreground">LIGHT</span>
        </>
      ) : (
        <>
          <Moon className="w-3.5 h-3.5 text-primary" />
          <span className="hidden sm:inline text-[10px] text-muted-foreground">DARK</span>
        </>
      )}
    </button>
  );
}

