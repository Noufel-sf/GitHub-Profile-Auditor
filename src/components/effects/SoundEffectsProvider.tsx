"use client";

import { useEffect } from "react";
import { arcadeAudio } from "@/lib/sound/audio";

export function SoundEffectsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      // Play retro arcade click sound
      arcadeAudio.playClick();
    };

    window.addEventListener("click", handleGlobalClick, { passive: true });

    return () => {
      window.removeEventListener("click", handleGlobalClick);
    };
  }, []);

  return <>{children}</>;
}

