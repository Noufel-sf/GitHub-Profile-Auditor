"use client";

import { useEffect, useState } from "react";
import { useMobile } from "@/hooks/useMobile";

export function ArcadeCursor() {
  const isMobile = useMobile();
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // If on mobile or touch device, do not attach desktop cursor listeners
    if (isMobile || typeof window === "undefined") {
      setIsVisible(false);
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest(
          "button, a, input, select, textarea, [role='button'], [tabindex='0'], .cursor-pointer"
        );
        setIsPointer(Boolean(interactive));
      }
    };

    const onMouseDown = () => setIsMouseDown(true);
    const onMouseUp = () => setIsMouseDown(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    document.documentElement.addEventListener("mouseenter", onMouseEnter);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      document.documentElement.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [isMobile, isVisible]);

  // Completely removed on mobile devices
  if (isMobile || !isVisible) {
    return null;
  }

  return (
    <div
      className="pointer-events-none fixed top-0 left-0 z-[9999] transition-transform duration-75 ease-out select-none"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
      }}
    >
      {/* Outer Pixel Box / Reticle */}
      <div
        className={`relative -top-3.5 -left-3.5 transition-all duration-150 flex items-center justify-center ${
          isPointer
            ? "scale-125 rotate-45 text-[#EC4899]"
            : isMouseDown
            ? "scale-90 text-[#A3E635]"
            : "scale-100 text-[#22D3EE]"
        }`}
      >
        {/* Pixel corners */}
        <div className="w-7 h-7 border-2 border-current relative">
          <div className="absolute -top-1 -left-1 w-1.5 h-1.5 bg-current shadow-[0_0_8px_currentColor]" />
          <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-current shadow-[0_0_8px_currentColor]" />
          <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-current shadow-[0_0_8px_currentColor]" />
          <div className="absolute -bottom-1 -right-1 w-1.5 h-1.5 bg-current shadow-[0_0_8px_currentColor]" />
        </div>

        {/* Center Aim Dot */}
        <div
          className={`absolute w-1.5 h-1.5 transition-all ${
            isPointer ? "bg-[#EC4899] shadow-[0_0_10px_#EC4899]" : "bg-[#22D3EE] shadow-[0_0_8px_#22D3EE]"
          }`}
        />
      </div>
    </div>
  );
}
