"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { arcadeAudio } from "@/lib/sound/audio";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    arcadeAudio.playClick();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      title="Scroll to Top"
      className="fixed bottom-6 right-6 z-40 p-2.5 bg-card/90 backdrop-blur-md border-2 border-neon-cyan hover:border-primary text-neon-cyan hover:text-primary shadow-[0_0_15px_rgba(34,211,238,0.35)] hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all cursor-pointer group flex items-center gap-1.5 font-mono text-[10px] font-bold"
    >
      <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
      <span className="hidden sm:inline">▲ TOP</span>
    </button>
  );
}

