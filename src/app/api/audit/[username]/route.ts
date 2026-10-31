import { NextRequest, NextResponse } from "next/server";
import { gitHubService } from "@/lib/github/api";
import { auditScoringEngine } from "@/lib/scoring/engine";
import { geminiAuditService } from "@/lib/ai/gemini";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    if (!username || username.trim().length === 0) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim().replace(/^@/, "");

    // 1. Fetch Profile
    const profile = await gitHubService.getUserProfile(cleanUsername);

    // 2. Fetch Repositories (up to 50)
    const repositories = await gitHubService.getUserRepositories(cleanUsername, 50);

    // 3. Concurrently fetch READMEs and Workflows for top 10 repos
    const topRepos = repositories.slice(0, 10);
    const readmes = new Map<string, string | null>();
    const workflows = new Map<string, boolean>();

    await Promise.all(
      topRepos.map(async (repo) => {
        try {
          const [readmeText, hasWorkflow] = await Promise.all([
            gitHubService.getRepositoryReadme(cleanUsername, repo.name),
            gitHubService.checkWorkflows(cleanUsername, repo.name),
          ]);
          readmes.set(repo.name, readmeText);
          workflows.set(repo.name, hasWorkflow);
        } catch {
          readmes.set(repo.name, null);
          workflows.set(repo.name, false);
        }
      })
    );

    // 4. Run Deterministic Scoring
    const report = auditScoringEngine.evaluateAudit(
      profile,
      repositories,
      readmes,
      workflows
    );

    // 5. Generate AI Insights via Gemini
    try {
      const aiAnalysis = await geminiAuditService.generateReportAnalysis(report);
      report.aiAnalysis = aiAnalysis;
    } catch (e) {
      console.warn("AI analysis fallback triggered:", e);
    }

    return NextResponse.json(report);
  } catch (error: any) {
    const status = error.message?.includes("not found") ? 404 : 500;
    return NextResponse.json(
      { error: error.message || "Failed to audit GitHub profile" },
      { status }
    );
  }
}

