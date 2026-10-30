import Link from "next/link";
import { Heart, Shield, Terminal, Zap } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";

export function Footer() {
  return (
    <footer className="border-t border-[#30395D] bg-[#080B20] text-[#A5AEC9] text-xs font-mono relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#111832] border border-[#22D3EE] flex items-center justify-center">
                <span className="text-[#22D3EE] font-mono text-xs font-bold">&gt;</span>
              </div>
              <span className="font-['Press_Start_2P'] text-xs text-[#F8FAFC]">
                DEV<span className="text-[#A855F7]">SCOPE</span>
              </span>
            </div>
            <p className="text-xs text-[#707B9C] max-w-md leading-relaxed">
              Transparent, deterministic GitHub profile & repository auditor. Built to provide developers with genuine engineering feedback, actionable roadmaps, and portfolio improvements.
            </p>
            <div className="flex items-center gap-3 pt-2 text-[#707B9C]">
              <span className="inline-flex items-center gap-1 text-[11px] text-[#A3E635]">
                <span className="w-2 h-2 rounded-full bg-[#A3E635] animate-pulse" />
                SYSTEM ONLINE
              </span>
              <span>•</span>
              <span className="text-[11px]">8BITCN READY</span>
              <span>•</span>
              <span className="text-[11px]">NEXT.JS APP ROUTER</span>
            </div>
          </div>

          <div>
            <h4 className="text-[#F8FAFC] font-['Press_Start_2P'] text-[10px] mb-3 text-[#22D3EE]">
              AUDIT CORE
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <Link href="/#categories" className="hover:text-[#F8FAFC] transition-colors">
                  &gt; Profile Quality (15%)
                </Link>
              </li>
              <li>
                <Link href="/#categories" className="hover:text-[#F8FAFC] transition-colors">
                  &gt; Repository Quality (30%)
                </Link>
              </li>
              <li>
                <Link href="/#categories" className="hover:text-[#F8FAFC] transition-colors">
                  &gt; Code Indicators (25%)
                </Link>
              </li>
              <li>
                <Link href="/#categories" className="hover:text-[#F8FAFC] transition-colors">
                  &gt; Documentation (15%)
                </Link>
              </li>
              <li>
                <Link href="/#categories" className="hover:text-[#F8FAFC] transition-colors">
                  &gt; Activity & Hygiene (15%)
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#F8FAFC] font-['Press_Start_2P'] text-[10px] mb-3 text-[#EC4899]">
              TERMINAL
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <Link href="/audit/torvalds" className="hover:text-[#F8FAFC] transition-colors">
                  &gt; Sample: torvalds
                </Link>
              </li>
              <li>
                <Link href="/audit/shadcn" className="hover:text-[#F8FAFC] transition-colors">
                  &gt; Sample: shadcn
                </Link>
              </li>
              <li>
                <Link href="/audit/leerob" className="hover:text-[#F8FAFC] transition-colors">
                  &gt; Sample: leerob
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#F8FAFC] transition-colors flex items-center gap-1"
                >
                  <GithubIcon className="w-3 h-3" /> GitHub Docs
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-[#202A4A] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#707B9C]">
          <p>© 2026 DEVSCOPE. Built with retro arcade aesthetic & modern engineering.</p>
          <p className="flex items-center gap-1">
            Deterministic Engine + AI Insights
          </p>
        </div>
      </div>
    </footer>
  );
}
