"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp, Terminal } from "lucide-react";
import { arcadeAudio } from "@/lib/sound/audio";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "scoring",
    category: "ENGINE",
    question: "How is my overall engineering score calculated?",
    answer:
      "DevScope uses a 100% deterministic scoring engine with transparent, documented category weights: 15% Profile Presentation, 30% Repository Quality, 25% Code Quality Indicators, 15% Documentation Depth, and 15% Activity Cadence. We never ask AI to hallucinate or invent your score. Individual checks produce deterministic pass, warn, or fail results based on measurable GitHub API evidence.",
  },
  {
    id: "privacy",
    category: "PRIVACY",
    question: "Does DevScope access my private repositories or require personal tokens?",
    answer:
      "No! DevScope audits only publicly accessible GitHub profile and repository data via the official GitHub REST API. You never have to sign in with OAuth or grant access to private code, organizations, or personal access tokens. Everything analyzed is public to the open-source community.",
  },
  {
    id: "badge",
    category: "BADGE",
    question: "How do I embed my DevScope badge on my GitHub profile README?",
    answer:
      "Once you run an audit, click 'Share Badge' in your report dashboard. You'll receive a ready-to-paste Markdown snippet (e.g. `[![DevScope Audit](https://devscope.app/api/badge/username)](https://devscope.app/report/username)`). Paste this snippet anywhere into your special GitHub profile README or project READMEs. The SVG badge renders live and updates dynamically whenever your score changes!",
  },
  {
    id: "roadmap",
    category: "QUESTS",
    question: "How does the RPG Quest Roadmap work?",
    answer:
      "Detected issues (such as missing setup commands, lack of LICENSE, or unmaintained repositories) are converted into prioritized quests with effort estimates and XP rewards. As you check off completed quests, your level increases. Once you commit real changes to GitHub, click 'Re-Audit' to have DevScope deterministically verify your upgrades and award score points!",
  },
  {
    id: "ratelimit",
    category: "API",
    question: "Is DevScope free to use? What if GitHub rate-limits my IP?",
    answer:
      "Yes, DevScope is 100% free! We utilize an intelligent in-memory server cache for GitHub API responses to protect public rate limits. In production, server-side GitHub credentials handle up to 5,000 requests per hour, ensuring quick, reliable audits for developers and hiring teams worldwide.",
  },
  {
    id: "squad",
    category: "SQUAD",
    question: "Can I audit and pin my teammates or students?",
    answer:
      "Absolutely. You can audit any developer's public handle. Click 'Pin Profile' on any report to add them to your persistent 'Squad Tracker' on the homepage. DevScope automatically compares subsequent audits and calculates point differentials (e.g. ▲ +12 PTS GAINED) so you can track team growth over time.",
  },
];

export function FaqSection() {
  const [openId, setOpenId] = useState<string | null>("scoring");

  const toggleItem = (id: string) => {
    arcadeAudio.playClick();
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 bg-secondary border border-border text-xs font-mono text-neon-yellow">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>KNOWLEDGE BASE // FAQ</span>
        </div>
        <h2 className="font-['Press_Start_2P'] text-xl sm:text-3xl text-foreground tracking-tight mb-4 leading-relaxed">
          FREQUENTLY ASKED QUESTIONS
        </h2>
        <p className="text-sm text-muted-foreground font-sans max-w-xl mx-auto">
          Clear answers about deterministic scoring, privacy safeguards, dynamic README badges, and RPG quest progression.
        </p>
      </div>

      <div className="space-y-3 font-mono">
        {FAQ_ITEMS.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div
              key={item.id}
              className={`bg-card border-2 transition-all ${
                isOpen ? "border-neon-cyan shadow-[0_0_15px_rgba(34,211,238,0.15)]" : "border-border hover:border-border/80"
              }`}
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-secondary text-primary border border-border font-bold shrink-0 whitespace-nowrap">
                    {item.category}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-foreground">
                    {item.question}
                  </span>
                </div>
                <div className="text-neon-cyan shrink-0">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-5 sm:px-5 sm:pb-6 text-xs text-muted-foreground leading-relaxed border-t border-border/60 pt-4 font-sans">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

