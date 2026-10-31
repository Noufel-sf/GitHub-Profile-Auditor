"use client";

import { useState, useEffect } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import { OverallAuditReport } from "@/types/audit";
import { useTheme } from "next-themes";
import { Layers, PieChart } from "lucide-react";

interface AuditChartsProps {
  report: OverallAuditReport;
}

function CustomBarTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
}) {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0];
  const count = item.value;
  const color = item.payload?.color || item.color || "#22D3EE";

  return (
    <div className="bg-card/95 backdrop-blur-md border-2 border-border p-3 shadow-[0_0_20px_rgba(0,0,0,0.7)] font-mono text-xs z-50 min-w-[160px]">
      <div className="flex items-center gap-2 mb-1.5 pb-1 border-b border-border/80">
        <span
          className="w-2.5 h-2.5 shrink-0"
          style={{ backgroundColor: color }}
        />
        <span className="font-bold text-foreground truncate">{label}</span>
      </div>
      <div className="flex items-center justify-between text-muted-foreground gap-3">
        <span>Public Repos:</span>
        <span className="font-bold text-neon-cyan">
          {count} {count === 1 ? "repo" : "repos"}
        </span>
      </div>
    </div>
  );
}

function CustomRadarTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: any[];
}) {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0];
  return (
    <div className="bg-card/95 backdrop-blur-md border-2 border-neon-cyan p-2.5 shadow-[0_0_15px_rgba(34,211,238,0.3)] font-mono text-xs z-50">
      <span className="font-bold text-foreground block mb-1">
        {item.payload?.category} Metric
      </span>
      <div className="flex items-center justify-between gap-3 text-muted-foreground">
        <span>Score:</span>
        <span className="font-bold text-neon-cyan">{item.value}/100</span>
      </div>
    </div>
  );
}

export function AuditCharts({ report }: AuditChartsProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-72 bg-card border-2 border-border flex items-center justify-center font-mono text-xs text-muted-foreground">
        LOADING VISUAL METRICS...
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  // Data for the 5-Category Radar Chart
  const radarData = [
    {
      category: "Profile",
      score: report.categories.profile.score,
      fullMark: 100,
    },
    {
      category: "Repos",
      score: report.categories.repositories.score,
      fullMark: 100,
    },
    {
      category: "Code Quality",
      score: report.categories.code_quality.score,
      fullMark: 100,
    },
    {
      category: "Docs",
      score: report.categories.documentation.score,
      fullMark: 100,
    },
    {
      category: "Activity",
      score: report.categories.activity.score,
      fullMark: 100,
    },
  ];

  // Data for Language Distribution from inspected repositories
  const languageCounts = new Map<string, number>();
  report.repositories.forEach((r) => {
    if (r.primaryLanguage) {
      languageCounts.set(
        r.primaryLanguage,
        (languageCounts.get(r.primaryLanguage) || 0) + 1
      );
    }
  });

  const neonColors = ["#22D3EE", "#A855F7", "#EC4899", "#A3E635", "#FACC15"];

  const languageData = Array.from(languageCounts.entries())
    .map(([name, count], index) => ({
      name,
      count,
      color: neonColors[index % neonColors.length],
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 5-CATEGORY RADAR SPIDER CHART */}
      <div className="bg-card border-2 border-border p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-neon-cyan" />
            <h3 className="font-['Press_Start_2P'] text-xs text-foreground">
              RADAR COMPETENCY MATRIX
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/40">
            5 AXES
          </span>
        </div>
        <p className="text-xs font-mono text-muted-foreground mb-4">
          Visual profile balance across all 5 audited engineering dimensions.
        </p>

        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
              <PolarGrid
                stroke={isDark ? "#27272a" : "#e4e4e7"}
                strokeDasharray="3 3"
              />
              <PolarAngleAxis
                dataKey="category"
                tick={{
                  fill: isDark ? "#a1a1aa" : "#71717a",
                  fontSize: 11,
                  fontFamily: "monospace",
                }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                stroke={isDark ? "#27272a" : "#e4e4e7"}
                tick={{ fill: "#71717a", fontSize: 9 }}
              />
              <Tooltip content={<CustomRadarTooltip />} />
              <Radar
                name="Score"
                dataKey="score"
                stroke="#22D3EE"
                fill="#22D3EE"
                fillOpacity={0.35}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-3 border-t border-border text-[11px] font-mono text-muted-foreground">
          {radarData.map((d, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-none bg-neon-cyan" />
              <span>
                {d.category}: <strong className="text-foreground">{d.score}</strong>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* PRIMARY LANGUAGES BAR CHART */}
      <div className="bg-card border-2 border-border p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            <h3 className="font-['Press_Start_2P'] text-xs text-foreground">
              STACK DISTRIBUTION
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 bg-primary/20 text-primary border border-primary/40">
            TOP STACKS
          </span>
        </div>
        <p className="text-xs font-mono text-muted-foreground mb-4">
          Frequency of primary technologies across public repositories.
        </p>

        {languageData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-xs font-mono text-muted-foreground">
            No primary programming languages detected.
          </div>
        ) : (
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={languageData}
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
              >
                <XAxis
                  dataKey="name"
                  stroke={isDark ? "#71717a" : "#a1a1aa"}
                  tick={{
                    fill: isDark ? "#a1a1aa" : "#71717a",
                    fontSize: 11,
                    fontFamily: "monospace",
                  }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis
                  stroke={isDark ? "#71717a" : "#a1a1aa"}
                  tick={{ fill: "#71717a", fontSize: 10 }}
                  allowDecimals={false}
                />
                <Tooltip
                  content={<CustomBarTooltip />}
                  cursor={{ fill: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)" }}
                />
                <Bar dataKey="count" name="Repositories" radius={[0, 0, 0, 0]}>
                  {languageData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={neonColors[index % neonColors.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-4 pt-3 border-t border-border text-[11px] font-mono text-muted-foreground">
          {languageData.map((l, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-none"
                style={{ backgroundColor: neonColors[i % neonColors.length] }}
              />
              <span>
                {l.name}: <strong className="text-foreground">{l.count} repos</strong>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

