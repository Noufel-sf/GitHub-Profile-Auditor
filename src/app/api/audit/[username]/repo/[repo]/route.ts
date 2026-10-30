import { NextRequest, NextResponse } from "next/server";
import { gitHubService } from "@/lib/github/api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string; repo: string }> }
) {
  try {
    const { username, repo } = await params;
    const cleanUsername = username.trim().replace(/^@/, "");
    const cleanRepo = repo.trim();

    // Fetch repository root files
    const rootFiles = await gitHubService.getRepositoryContents(cleanUsername, cleanRepo, "");
    const readme = await gitHubService.getRepositoryReadme(cleanUsername, cleanRepo);
    const hasWorkflows = await gitHubService.checkWorkflows(cleanUsername, cleanRepo);

    // Look for key structural files
    const fileNames = rootFiles.map((f: any) => f.name.toLowerCase());
    const hasPackageJson = fileNames.includes("package.json") || fileNames.includes("cargo.toml") || fileNames.includes("go.mod") || fileNames.includes("pyproject.toml");
    const hasGitignore = fileNames.includes(".gitignore");
    const hasLicense = fileNames.includes("license") || fileNames.includes("license.md") || fileNames.includes("license.txt");
    const hasTests = fileNames.some((f: string) => f.includes("test") || f.includes("spec") || f.includes("__tests__"));
    const hasDocs = fileNames.some((f: string) => f.includes("doc") || f.includes("docs"));
    const hasSrc = fileNames.includes("src") || fileNames.includes("lib") || fileNames.includes("app");

    // Analyze README text
    let readmeStats = {
      exists: Boolean(readme && readme.trim().length > 0),
      length: readme ? readme.trim().length : 0,
      hasInstall: false,
      hasUsage: false,
      hasScreenshots: false,
      hasBadges: false,
    };

    if (readme) {
      const lower = readme.toLowerCase();
      readmeStats.hasInstall = lower.includes("install") || lower.includes("npm i") || lower.includes("pnpm add") || lower.includes("getting started") || lower.includes("setup");
      readmeStats.hasUsage = lower.includes("usage") || lower.includes("quick start") || lower.includes("example");
      readmeStats.hasScreenshots = lower.includes(".png") || lower.includes(".jpg") || lower.includes(".gif") || lower.includes("<img");
      readmeStats.hasBadges = lower.includes("shields.io") || lower.includes("github/workflow/status") || lower.includes("[![");
    }

    // Generate Repo Specific Findings & Recommendations
    const repoFindings = [];
    if (!readmeStats.exists) {
      repoFindings.push({
        severity: "critical",
        title: "Missing README.md",
        description: "Reviewers and hiring managers cannot understand what this codebase does or how to run it.",
        fix: "Add a README.md file with project title, purpose, tech stack, and setup steps.",
      });
    } else {
      if (!readmeStats.hasInstall) {
        repoFindings.push({
          severity: "high",
          title: "Missing Installation Guide",
          description: "No installation or run instructions detected in the README.",
          fix: "Add a 'Getting Started' section with step-by-step commands.",
        });
      }
      if (!readmeStats.hasUsage) {
        repoFindings.push({
          severity: "medium",
          title: "No Usage Examples",
          description: "Developers benefit from code snippets showing how to consume or interact with this project.",
          fix: "Include a 'Usage' or 'Quickstart' code block.",
        });
      }
    }

    if (!hasLicense) {
      repoFindings.push({
        severity: "medium",
        title: "No Open-Source License",
        description: "Without a LICENSE, users and recruiters cannot legally evaluate or reuse this software.",
        fix: "Add an MIT, Apache 2.0, or suitable open-source license file.",
      });
    }

    if (!hasWorkflows) {
      repoFindings.push({
        severity: "low",
        title: "No GitHub Actions CI/CD",
        description: "Automated linting and test workflows demonstrate production-ready engineering standards.",
        fix: "Add `.github/workflows/ci.yml` to run tests and builds on pull requests.",
      });
    }

    return NextResponse.json({
      repo: cleanRepo,
      owner: cleanUsername,
      files: rootFiles.map((f: any) => ({ name: f.name, type: f.type, size: f.size })),
      structure: {
        hasPackageJson,
        hasGitignore,
        hasLicense,
        hasTests,
        hasDocs,
        hasSrc,
        hasWorkflows,
      },
      readmeStats,
      findings: repoFindings,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to inspect repository" },
      { status: 500 }
    );
  }
}

