"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Terminal,
  Search,
  FolderGit2,
  Trophy,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  User,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Command,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import { arcadeAudio } from "@/lib/sound/audio";

interface CommandItem {
  id: string;
  category: "ACTIONS" | "PROFILES" | "REPOSITORIES" | "PREFERENCES";
  title: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
}

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { resolvedTheme, setTheme } = useTheme();

  // Listen for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => {
          if (!prev) arcadeAudio.playClick();
          return !prev;
        });
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  // Reset index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  const closePalette = () => {
    setOpen(false);
    setSearch("");
  };

  const isDark = resolvedTheme === "dark";

  const commands: CommandItem[] = [
    {
      id: "action-home",
      category: "ACTIONS",
      title: "Start New Audit",
      subtitle: "Jump to home terminal search input",
      icon: Terminal,
      action: () => {
        router.push("/#audit-form");
        closePalette();
      },
    },
    {
      id: "action-repo",
      category: "ACTIONS",
      title: "Evaluate Specific Repository",
      subtitle: "Inspect any single GitHub repository directly",
      icon: FolderGit2,
      action: () => {
        router.push("/#repo-evaluator");
        closePalette();
      },
    },
    {
      id: "action-leaderboard",
      category: "ACTIONS",
      title: "Arcade Hall of Fame",
      subtitle: "View global developer high scores and rankings",
      icon: Trophy,
      action: () => {
        router.push("/leaderboard");
        closePalette();
      },
    },
    {
      id: "action-about",
      category: "ACTIONS",
      title: "About the Creator (@Noufel-sf)",
      subtitle: "Read creator dossier and connect on LinkedIn / Instagram",
      icon: User,
      action: () => {
        router.push("/about");
        closePalette();
      },
    },
    // Developer Profiles
    {
      id: "profile-noufel",
      category: "PROFILES",
      title: "@Noufel-sf (Creator)",
      subtitle: "Full-Stack Architect • 40+ Public Repos",
      icon: Sparkles,
      action: () => {
        router.push("/report/Noufel-sf");
        closePalette();
      },
    },
    {
      id: "profile-torvalds",
      category: "PROFILES",
      title: "@torvalds (Linus Torvalds)",
      subtitle: "Linux & Git Creator • Rank S Sovereign",
      icon: User,
      action: () => {
        router.push("/report/torvalds");
        closePalette();
      },
    },
    {
      id: "profile-shadcn",
      category: "PROFILES",
      title: "@shadcn",
      subtitle: "Design System & UI Components Pioneer",
      icon: User,
      action: () => {
        router.push("/report/shadcn");
        closePalette();
      },
    },
    {
      id: "profile-leerob",
      category: "PROFILES",
      title: "@leerob (Lee Robinson)",
      subtitle: "VP of Product • Next.js Advocate",
      icon: User,
      action: () => {
        router.push("/report/leerob");
        closePalette();
      },
    },
    // Repositories
    {
      id: "repo-devscope",
      category: "REPOSITORIES",
      title: "Noufel-sf / GitHub-Profile-Auditor",
      subtitle: "DevScope Engine • Full-Stack Next.js 16 Codebase",
      icon: FolderGit2,
      action: () => {
        router.push("/report/Noufel-sf/repository/GitHub-Profile-Auditor");
        closePalette();
      },
    },
    {
      id: "repo-shadcn",
      category: "REPOSITORIES",
      title: "shadcn / ui",
      subtitle: "Beautifully designed components for React & Tailwind",
      icon: FolderGit2,
      action: () => {
        router.push("/report/shadcn/repository/ui");
        closePalette();
      },
    },
    // Preferences
    {
      id: "pref-theme",
      category: "PREFERENCES",
      title: isDark ? "Switch to Day Arcade (Light Mode)" : "Switch to Obsidian Black (Dark Mode)",
      subtitle: "Toggle application visual palette",
      icon: isDark ? Sun : Moon,
      action: () => {
        setTheme(isDark ? "light" : "dark");
        arcadeAudio.playClick();
        closePalette();
      },
    },
    {
      id: "pref-sfx",
      category: "PREFERENCES",
      title: arcadeAudio.getMuted() ? "Enable Arcade SFX" : "Mute Arcade SFX",
      subtitle: "Toggle Web Audio synthetics sound effects",
      icon: arcadeAudio.getMuted() ? Volume2 : VolumeX,
      action: () => {
        arcadeAudio.toggleMute();
        closePalette();
      },
    },
  ];

  const filtered = commands.filter((cmd) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    return (
      cmd.title.toLowerCase().includes(q) ||
      (cmd.subtitle && cmd.subtitle.toLowerCase().includes(q)) ||
      cmd.category.toLowerCase().includes(q)
    );
  });

  const handleSelect = (cmd: CommandItem) => {
    arcadeAudio.playClick();
    cmd.action();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (filtered.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSelect(filtered[selectedIndex]);
    }
  };

  if (!open) return null;

  return (
    <div
      onClick={closePalette}
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-card border-2 border-neon-cyan shadow-[0_0_35px_rgba(34,211,238,0.25)] relative overflow-hidden font-mono text-xs"
      >
        {/* Pixel corners */}
        <div className="absolute top-0 left-0 w-2.5 h-2.5 bg-neon-cyan" />
        <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-neon-pink" />
        <div className="absolute bottom-0 left-0 w-2.5 h-2.5 bg-neon-green" />
        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-neon-yellow" />

        {/* Search Input Box */}
        <div className="flex items-center gap-3 p-4 border-b border-border bg-background">
          <Search className="w-4 h-4 text-neon-cyan shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Type a command, developer, repo, or preference..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-foreground placeholder:text-muted-foreground/60 text-xs focus:outline-none"
          />
          <button
            onClick={closePalette}
            className="p-1 text-muted-foreground hover:text-neon-pink cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Commands List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No matching commands or developers found for "{search}".
            </div>
          ) : (
            filtered.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  onClick={() => handleSelect(cmd)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 border transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-secondary border-neon-cyan text-foreground"
                      : "border-transparent hover:bg-secondary/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-7 h-7 border flex items-center justify-center shrink-0 ${
                        isSelected
                          ? "border-neon-cyan text-neon-cyan bg-neon-cyan/10"
                          : "border-border text-muted-foreground bg-background"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-foreground truncate flex items-center gap-2">
                        <span>{cmd.title}</span>
                        <span className="text-[9px] px-1.5 py-0.2 bg-background border border-border text-muted-foreground">
                          {cmd.category}
                        </span>
                      </div>
                      {cmd.subtitle && (
                        <p className="text-[11px] text-muted-foreground truncate">
                          {cmd.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <ArrowRight
                    className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                      isSelected ? "text-neon-cyan translate-x-0.5" : "text-transparent"
                    }`}
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 bg-secondary border-t border-border flex items-center justify-between text-[10px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1 py-0.5 bg-background border border-border">↑</kbd>{" "}
              <kbd className="px-1 py-0.5 bg-background border border-border">↓</kbd> Navigate
            </span>
            <span>
              <kbd className="px-1 py-0.5 bg-background border border-border">ENTER</kbd> Select
            </span>
          </div>
          <span>
            <kbd className="px-1 py-0.5 bg-background border border-border">ESC</kbd> Close
          </span>
        </div>
      </div>
    </div>
  );
}

