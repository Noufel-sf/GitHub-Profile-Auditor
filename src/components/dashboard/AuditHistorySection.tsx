"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  History,
  Star,
  Trash2,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowRight,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/8bit/button";
import {
  StoredAuditRecord,
  getAuditHistory,
  togglePinAudit,
  removeAuditFromHistory,
  clearAuditHistory,
} from "@/lib/storage/auditHistory";
import { arcadeAudio } from "@/lib/sound/audio";

interface AuditHistorySectionProps {
  currentUsername?: string;
}

export function AuditHistorySection({ currentUsername }: AuditHistorySectionProps) {
  const [history, setHistory] = useState<StoredAuditRecord[]>([]);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "pinned">("all");

  useEffect(() => {
    setMounted(true);
    setHistory(getAuditHistory());
  }, []);

  const handleTogglePin = (username: string) => {
    arcadeAudio.playClick();
    const updated = togglePinAudit(username);
    setHistory([...updated]);
  };

  const handleRemove = (username: string) => {
    arcadeAudio.playClick();
    const updated = removeAuditFromHistory(username);
    setHistory([...updated]);
  };

  const handleClearAll = () => {
    arcadeAudio.playClick();
    if (window.confirm("Clear all recorded audit history from your browser?")) {
      clearAuditHistory();
      setHistory([]);
    }
  };

  if (!mounted || history.length === 0) {
    return null; // Don't take up space if there's no history yet
  }

  const pinnedItems = history.filter((item) => item.isPinned);
  const displayedItems =
    activeTab === "pinned"
      ? pinnedItems
      : [...history].sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return b.auditedAt - a.auditedAt;
        });

  const timeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="w-full bg-card border-2 border-border p-6 relative overflow-hidden shadow-[0_0_25px_rgba(34,211,238,0.1)]">
      {/* Corner Pixel Accents */}
      <div className="absolute top-0 left-0 w-2.5 h-2.5 bg-neon-cyan" />
      <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-neon-pink" />
      <div className="absolute bottom-0 left-0 w-2.5 h-2.5 bg-neon-green" />
      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-neon-yellow" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-secondary border border-border flex items-center justify-center text-neon-cyan">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-['Press_Start_2P'] text-xs text-foreground flex items-center gap-2">
              AUDIT HISTORY &amp; PINNED SQUAD
              <span className="text-[10px] font-mono px-2 py-0.5 bg-secondary text-primary border border-border font-bold">
                {history.length} SAVED
              </span>
            </h3>
            <p className="font-mono text-xs text-muted-foreground mt-0.5">
              Track developer score progress over time and bookmark team profiles.
            </p>
          </div>
        </div>

        {/* Tab switcher & Clear Action */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={() => {
              arcadeAudio.playClick();
              setActiveTab("all");
            }}
            className={`px-3 py-1.5 uppercase text-[11px] cursor-pointer border ${
              activeTab === "all"
                ? "bg-neon-cyan text-black border-neon-cyan font-bold"
                : "bg-secondary text-muted-foreground border-border hover:text-foreground"
            }`}
          >
            All Audits ({history.length})
          </button>
          <button
            onClick={() => {
              arcadeAudio.playClick();
              setActiveTab("pinned");
            }}
            className={`px-3 py-1.5 uppercase text-[11px] cursor-pointer border flex items-center gap-1 ${
              activeTab === "pinned"
                ? "bg-neon-yellow text-black border-neon-yellow font-bold"
                : "bg-secondary text-muted-foreground border-border hover:text-foreground"
            }`}
          >
            <Star className="w-3 h-3 fill-current" />
            Pinned ({pinnedItems.length})
          </button>
          <button
            onClick={handleClearAll}
            title="Clear all saved audit history"
            className="p-1.5 text-muted-foreground hover:text-destructive border border-transparent hover:border-border transition-colors cursor-pointer ml-1"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid of Audit Cards */}
      {displayedItems.length === 0 ? (
        <div className="p-8 text-center bg-secondary border border-border font-mono text-xs text-muted-foreground">
          {activeTab === "pinned"
            ? "No pinned profiles yet. Click the star icon on any audit record to pin it."
            : "No audit records found."}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedItems.map((record) => {
            const isCurrent =
              currentUsername &&
              record.username.toLowerCase() === currentUsername.toLowerCase();

            return (
              <div
                key={record.username}
                className={`bg-secondary border p-4 flex flex-col justify-between transition-all group ${
                  record.isPinned
                    ? "border-neon-yellow/60 shadow-[0_0_12px_rgba(250,204,21,0.15)]"
                    : isCurrent
                    ? "border-neon-cyan/60"
                    : "border-border hover:border-neon-cyan"
                }`}
              >
                <div>
                  {/* Top Bar: Pin, Timestamp, and Delete */}
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-border/60 text-xs font-mono">
                    <button
                      onClick={() => handleTogglePin(record.username)}
                      title={record.isPinned ? "Unpin profile" : "Pin to squad"}
                      className={`flex items-center gap-1 cursor-pointer transition-transform hover:scale-110 ${
                        record.isPinned
                          ? "text-neon-yellow font-bold"
                          : "text-muted-foreground hover:text-neon-yellow"
                      }`}
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          record.isPinned ? "fill-neon-yellow" : ""
                        }`}
                      />
                      <span className="text-[10px]">
                        {record.isPinned ? "PINNED" : "PIN"}
                      </span>
                    </button>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground">
                        {timeAgo(record.auditedAt)}
                      </span>
                      <button
                        onClick={() => handleRemove(record.username)}
                        title="Remove from history"
                        className="text-muted-foreground hover:text-destructive cursor-pointer opacity-60 hover:opacity-100"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Profile info & avatar */}
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={record.avatarUrl}
                      alt={record.username}
                      className="w-11 h-11 border-2 border-border object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1 font-mono">
                      <div className="font-bold text-sm text-foreground truncate">
                        {record.name || record.username}
                      </div>
                      <div className="text-xs text-neon-cyan truncate">
                        @{record.username}
                      </div>
                    </div>

                    {/* Overall Score & Rank */}
                    <div className="text-right shrink-0">
                      <div className="font-['Space_Grotesk'] text-xl font-bold text-foreground">
                        {record.overallScore}
                        <span className="text-xs text-muted-foreground">/100</span>
                      </div>
                      <span className="px-1.5 py-0.2 bg-card border border-border text-[10px] font-mono font-bold text-primary">
                        RANK {record.grade}
                      </span>
                    </div>
                  </div>

                  {/* Progress Delta Badge */}
                  <div className="p-2 bg-background border border-border mb-3 font-mono text-[11px] flex items-center justify-between">
                    <span className="text-muted-foreground">PROGRESS:</span>
                    {record.scoreDiff !== undefined ? (
                      record.scoreDiff > 0 ? (
                        <span className="text-neon-green font-bold flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5" />+{record.scoreDiff} PTS GAINED
                        </span>
                      ) : record.scoreDiff < 0 ? (
                        <span className="text-destructive font-bold flex items-center gap-1">
                          <TrendingDown className="w-3.5 h-3.5" />
                          {record.scoreDiff} PTS
                        </span>
                      ) : (
                        <span className="text-neon-cyan font-bold flex items-center gap-1">
                          <Minus className="w-3.5 h-3.5" /> MAINTAINED ({record.overallScore})
                        </span>
                      )
                    ) : (
                      <span className="text-neon-yellow flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> INITIAL AUDIT
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-border/60">
                  <Link
                    href={`/report/${encodeURIComponent(record.username)}`}
                    className="flex-1"
                  >
                    <Button
                      size="sm"
                      className="w-full bg-card hover:bg-muted border border-border hover:border-neon-cyan text-foreground text-xs font-mono py-1"
                    >
                      View Report <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>

                  <Link href={`/audit/${encodeURIComponent(record.username)}`}>
                    <Button
                      size="sm"
                      variant="outline"
                      title="Run a fresh re-audit"
                      className="bg-card text-neon-cyan border-border hover:bg-muted p-2"
                    >
                      <RefreshCw className="w-3 h-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
