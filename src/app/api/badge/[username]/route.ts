import { NextRequest, NextResponse } from "next/server";
import { gitHubService } from "@/lib/github/api";
import { auditScoringEngine } from "@/lib/scoring/engine";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const cleanUsername = username.trim().replace(/^@/, "");

    // Quick fetch profile & repos
    const profile = await gitHubService.getUserProfile(cleanUsername);
    const repositories = await gitHubService.getUserRepositories(cleanUsername, 15);

    const report = auditScoringEngine.evaluateAudit(profile, repositories);
    const score = report.overallScore;
    const grade = report.grade;

    // Badge theme colors based on grade
    let gradeColor = "#A3E635"; // Green for S / A
    if (grade === "B") gradeColor = "#22D3EE";
    if (grade === "C") gradeColor = "#FACC15";
    if (grade === "D" || grade === "F") gradeColor = "#EF4444";

    // Generate Crisp 8-bit styled SVG badge
    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="220" height="32" viewBox="0 0 220 32" role="img" aria-label="DevScope: ${score}/100">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&amp;family=Space+Grotesk:wght@700&amp;display=swap');
      .title { font-family: 'Press Start 2P', monospace; font-size: 8px; fill: #fafafa; }
      .score { font-family: 'Space Grotesk', monospace; font-size: 13px; font-weight: bold; fill: #09090b; }
    </style>
  </defs>

  <!-- Left label background -->
  <rect x="0" y="0" width="130" height="32" fill="#121215" stroke="#27272a" stroke-width="2"/>
  
  <!-- Right score background -->
  <rect x="130" y="0" width="90" height="32" fill="${gradeColor}" stroke="#27272a" stroke-width="2"/>

  <!-- Left decorative pixel accents -->
  <rect x="6" y="6" width="3" height="3" fill="#22D3EE"/>
  <rect x="120" y="6" width="3" height="3" fill="#EC4899"/>
  <text x="16" y="19" class="title">DEV SCOPE</text>

  <!-- Right grade & score -->
  <text x="142" y="21" class="score">RANK ${grade} [${score}]</text>
</svg>
    `.trim();

    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error: any) {
    // Fallback badge on error
    const fallbackSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="180" height="32" viewBox="0 0 180 32">
  <rect width="180" height="32" fill="#121215" stroke="#27272a" stroke-width="2"/>
  <text x="15" y="20" fill="#EF4444" font-family="monospace" font-size="11">DEVSCOPE // OFFLINE</text>
</svg>
    `.trim();

    return new NextResponse(fallbackSvg, {
      headers: {
        "Content-Type": "image/svg+xml",
      },
      status: 200,
    });
  }
}

