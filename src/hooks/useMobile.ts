"use client";

import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;

/**
 * Custom hook to detect mobile viewport or touch devices
 */
export function useMobile(breakpoint: number = MOBILE_BREAKPOINT): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkMobile = () => {
      const isSmallScreen = window.innerWidth < breakpoint;
      const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
      setIsMobile(isSmallScreen || isTouchDevice);
    };

    checkMobile();

    const mqlScreen = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const mqlPointer = window.matchMedia("(pointer: coarse)");

    const onChange = () => checkMobile();

    mqlScreen.addEventListener("change", onChange);
    mqlPointer.addEventListener("change", onChange);
    window.addEventListener("resize", onChange);

    return () => {
      mqlScreen.removeEventListener("change", onChange);
      mqlPointer.removeEventListener("change", onChange);
      window.removeEventListener("resize", onChange);
    };
  }, [breakpoint]);

  return isMobile;
}

