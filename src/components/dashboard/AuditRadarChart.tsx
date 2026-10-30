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

export function AuditCharts({ report }: AuditChartsProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-72 bg-[#111832] border-2 border-[#30395D] flex items-center justify-center font-mono text-xs text-[#707B9C]">
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

  const languageData = Array.from(languageCounts.entries())
    .map(([name, count]) => ({
      name,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const neonColors = ["#22D3EE", "#A855F7", "#EC4899", "#A3E635", "#FACC15"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 5-CATEGORY RADAR SPIDER CHART */}
      <div className="bg-[#111832] border-2 border-[#30395D] p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-[#22D3EE]" />
            <h3 className="font-['Press_Start_2P'] text-xs text-[#F8FAFC]">
              RADAR COMPETENCY MATRIX
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 bg-[#22D3EE]/20 text-[#22D3EE] border border-[#22D3EE]/40">
            5 AXES
          </span>
        </div>
        <p className="text-xs font-mono text-[#707B9C] mb-4">
          Visual profile balance across all 5 audited engineering dimensions.
        </p>

        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
              <PolarGrid
                stroke={isDark ? "#30395D" : "#CBD5E1"}
                strokeDasharray="3 3"
              />
              <PolarAngleAxis
                dataKey="category"
                tick={{
                  fill: isDark ? "#A5AEC9" : "#475569",
                  fontSize: 11,
                  fontFamily: "monospace",
                }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                stroke={isDark ? "#202A4A" : "#E2E8F0"}
                tick={{ fill: "#707B9C", fontSize: 9 }}
              />
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

        <div className="flex flex-wrap items-center justify-center gap-4 pt-3 border-t border-[#202A4A] text-[11px] font-mono text-[#A5AEC9]">
          {radarData.map((d, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-none bg-[#22D3EE]" />
              <span>
                {d.category}: <strong className="text-[#F8FAFC]">{d.score}</strong>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* PRIMARY LANGUAGES BAR CHART */}
      <div className="bg-[#111832] border-2 border-[#30395D] p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#A855F7]" />
            <h3 className="font-['Press_Start_2P'] text-xs text-[#F8FAFC]">
              STACK DISTRIBUTION
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 bg-[#A855F7]/20 text-[#A855F7] border border-[#A855F7]/40">
            TOP STACKS
          </span>
        </div>
        <p className="text-xs font-mono text-[#707B9C] mb-4">
          Frequency of primary technologies across public repositories.
        </p>

        {languageData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-xs font-mono text-[#707B9C]">
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
                  stroke={isDark ? "#707B9C" : "#64748B"}
                  tick={{
                    fill: isDark ? "#A5AEC9" : "#475569",
                    fontSize: 11,
                    fontFamily: "monospace",
                  }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis
                  stroke={isDark ? "#707B9C" : "#64748B"}
                  tick={{ fill: "#707B9C", fontSize: 10 }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#0D1228" : "#FFFFFF",
                    borderColor: isDark ? "#30395D" : "#CBD5E1",
                    borderRadius: "0px",
                    fontFamily: "monospace",
                    fontSize: "12px",
                    color: isDark ? "#F8FAFC" : "#0F172A",
                  }}
                  cursor={{ fill: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }}
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

        <div className="flex flex-wrap items-center justify-center gap-4 pt-3 border-t border-[#202A4A] text-[11px] font-mono text-[#A5AEC9]">
          {languageData.map((l, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-none"
                style={{ backgroundColor: neonColors[i % neonColors.length] }}
              />
              <span>
                {l.name}: <strong className="text-[#F8FAFC]">{l.count} repos</strong>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

