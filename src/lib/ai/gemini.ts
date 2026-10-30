import { OverallAuditReport, Finding } from "@/types/audit";

interface AiAnalysisResult {
  summary: string;
  executiveTakeaway: string;
  developerArchetype: string;
  interviewReadiness: string;
  keyRecommendations: string[];
}

export class GeminiAuditService {
  private apiKey: string | null;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || null;
  }

  /**
   * Check if Gemini API is configured
   */
  public isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  /**
   * Generate AI analysis based strictly on audited findings & evidence
   */
  public async generateReportAnalysis(
    report: OverallAuditReport
  ): Promise<AiAnalysisResult> {
    if (!this.isConfigured()) {
      return this.generateDeterministicFallback(report);
    }

    try {
      const prompt = `
You are DEV SCOPE's Senior Engineering Architect & Career Auditor.
Analyze the following real, deterministic GitHub audit report for user @${report.username}.

Profile Data:
- Name: ${report.profile.name || "N/A"}
- Public Repos: ${report.profile.public_repos}
- Bio: ${report.profile.bio || "None"}
- Website: ${report.profile.blog || "None"}
- Followers: ${report.profile.followers}

Audited Scores:
- Overall Score: ${report.overallScore}/100 (Grade ${report.grade})
- Profile Quality: ${report.categories.profile.score}/100
- Repository Quality: ${report.categories.repositories.score}/100
- Code Quality Indicators: ${report.categories.code_quality.score}/100
- Documentation: ${report.categories.documentation.score}/100
- Activity: ${report.categories.activity.score}/100

Key Strengths Detected:
${report.strengths.map((s) => `- ${s.title}: ${s.evidence}`).join("\n")}

Key Weaknesses Detected:
${report.weaknesses.map((w) => `- [${w.severity.toUpperCase()}] ${w.title}: ${w.evidence} (Fix: ${w.recommendation})`).join("\n")}

Respond ONLY with valid JSON with these keys:
{
  "summary": "2-3 sentences summarizing their current GitHub impression to technical recruiters.",
  "executiveTakeaway": "1 sharp punchy sentence highlighting what will level them up most.",
  "developerArchetype": "A catchy retro 8-bit RPG title for their current stage (e.g. 'Novice Code Crafter', 'System Builder in Training', 'Specialized Full-Stack Sorcerer').",
  "interviewReadiness": "Brief objective assessment of how ready their portfolio is for technical hiring review.",
  "keyRecommendations": ["3 concrete, prioritized bullet points"]
}
`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.2,
            },
          }),
        }
      );

      if (!response.ok) {
        return this.generateDeterministicFallback(report);
      }

      const json = await response.json();
      const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) return this.generateDeterministicFallback(report);

      const parsed = JSON.parse(rawText) as AiAnalysisResult;
      return parsed;
    } catch {
      return this.generateDeterministicFallback(report);
    }
  }

  /**
   * Deterministic evidence-backed fallback when AI key is absent
   */
  private generateDeterministicFallback(report: OverallAuditReport): AiAnalysisResult {
    const score = report.overallScore;

    let archetype = "Adventuring Developer (Level 1)";
    let readiness = "Needs core portfolio cleanup before senior technical reviews.";
    if (score >= 85) {
      archetype = "Master Code Architect (Rank S)";
      readiness = "High interview readiness. Public portfolio presents professional polish and good engineering hygiene.";
    } else if (score >= 70) {
      archetype = "Skilled Software Vanguard (Rank A)";
      readiness = "Moderate readiness. Flagship projects are visible, but documentation and repository metadata need tightening.";
    } else if (score >= 55) {
      archetype = "Emerging Code Crafter (Rank B)";
      readiness = "Early readiness. Active projects exist, but missing READMEs and uncurated repos diminish first impressions.";
    }

    const keyRecommendations: string[] = [];
    if (report.weaknesses.length > 0) {
      report.weaknesses.slice(0, 3).forEach((w) => {
        keyRecommendations.push(`${w.title}: ${w.recommendation}`);
      });
    } else {
      keyRecommendations.push("Maintain continuous GitHub activity with documented pull requests.");
      keyRecommendations.push("Add CI/CD build badges and automated unit test coverage.");
    }

    return {
      summary: `@${report.username} currently scores ${score}/100 (${report.gradeLabel}). The profile shows ${report.strengths.length} notable strengths, with ${report.weaknesses.length} identified areas for immediate engineering improvement.`,
      executiveTakeaway:
        report.weaknesses.length > 0
          ? `Focusing on ${report.weaknesses[0].title.toLowerCase()} will generate the largest immediate boost to your profile's credibility.`
          : "Your portfolio exhibits strong fundamentals; keep expanding comprehensive architectural case studies.",
      developerArchetype: archetype,
      interviewReadiness: readiness,
      keyRecommendations,
    };
  }
}

export const geminiAuditService = new GeminiAuditService();
