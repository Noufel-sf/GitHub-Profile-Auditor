import { NextRequest, NextResponse } from "next/server";
import { gitHubService } from "@/lib/github/api";

const GENERIC_NAMES = [
  "app",
  "my-app",
  "test",
  "test-app",
  "demo",
  "project",
  "code",
  "tutorial",
  "learn",
  "temp",
  "sample",
  "portfolio",
  "new-project",
  "repo",
  "github",
  "assignment",
  "lab",
  "exercise",
];

const CONVENTIONAL_REGEX =
  /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([a-z0-9_-]+\))?: .+/i;

const LAZY_REGEX =
  /^(initial commit|first commit|commit|update|updates|fix|fixes|wip|test|tests|changes|done|temp|asdf|bug fix|patch|cleanup|styling|testing|wip \d+|work in progress)$/i;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string; repo: string }> }
) {
  try {
    const { username, repo } = await params;
    const cleanUsername = username.trim().replace(/^@/, "");
    const cleanRepo = repo.trim();

    // Fetch repository data in parallel
    const [rootFiles, readme, hasWorkflows, repoDetails, recentCommitsRaw] = await Promise.all([
      gitHubService.getRepositoryContents(cleanUsername, cleanRepo, ""),
      gitHubService.getRepositoryReadme(cleanUsername, cleanRepo),
      gitHubService.checkWorkflows(cleanUsername, cleanRepo),
      gitHubService.getRepositoryDetails(cleanUsername, cleanRepo),
      gitHubService.getRepositoryCommits(cleanUsername, cleanRepo, 25),
    ]);

    // 1. Structure Analysis
    const fileNames = rootFiles.map((f: any) => f.name.toLowerCase());
    const hasPackageJson =
      fileNames.includes("package.json") ||
      fileNames.includes("cargo.toml") ||
      fileNames.includes("go.mod") ||
      fileNames.includes("pyproject.toml") ||
      fileNames.includes("pom.xml") ||
      fileNames.includes("gemfile");
    const hasGitignore = fileNames.includes(".gitignore");
    const hasLicense =
      fileNames.includes("license") ||
      fileNames.includes("license.md") ||
      fileNames.includes("license.txt");
    const hasTests = fileNames.some(
      (f: string) => f.includes("test") || f.includes("spec") || f.includes("__tests__")
    );
    const hasDocs = fileNames.some((f: string) => f.includes("doc") || f.includes("docs"));
    const hasSrc =
      fileNames.includes("src") ||
      fileNames.includes("lib") ||
      fileNames.includes("app") ||
      fileNames.includes("pkg");

    // 2. README Analysis
    const readmeStats = {
      exists: Boolean(readme && readme.trim().length > 0),
      length: readme ? readme.trim().length : 0,
      hasInstall: false,
      hasUsage: false,
      hasScreenshots: false,
      hasBadges: false,
    };

    if (readme) {
      const lower = readme.toLowerCase();
      readmeStats.hasInstall =
        lower.includes("install") ||
        lower.includes("npm i") ||
        lower.includes("pnpm add") ||
        lower.includes("yarn add") ||
        lower.includes("cargo build") ||
        lower.includes("getting started") ||
        lower.includes("setup");
      readmeStats.hasUsage =
        lower.includes("usage") ||
        lower.includes("quick start") ||
        lower.includes("example") ||
        lower.includes("how to use") ||
        lower.includes("demo");
      readmeStats.hasScreenshots =
        lower.includes(".png") ||
        lower.includes(".jpg") ||
        lower.includes(".gif") ||
        lower.includes("<img") ||
        lower.includes(".webp") ||
        lower.includes(".svg");
      readmeStats.hasBadges =
        lower.includes("shields.io") ||
        lower.includes("github/workflow/status") ||
        lower.includes("[![") ||
        lower.includes("badgen.net");
    }

    // 3. Metadata & "About" Section Analysis
    const description = repoDetails?.description?.trim() || "";
    const topics: string[] = Array.isArray(repoDetails?.topics) ? repoDetails.topics : [];
    const homepage = repoDetails?.homepage?.trim() || "";
    const defaultBranch = repoDetails?.default_branch || "main";
    const stars = repoDetails?.stargazers_count ?? 0;
    const forks = repoDetails?.forks_count ?? 0;
    const openIssues = repoDetails?.open_issues_count ?? 0;
    const isArchived = Boolean(repoDetails?.archived);

    const hasDescription = description.length > 0;
    const hasTopics = topics.length > 0;
    const hasHomepage = homepage.length > 0;

    // 4. Name Quality Evaluation
    const lowerRepo = cleanRepo.toLowerCase();
    const isGenericName = GENERIC_NAMES.includes(lowerRepo);
    let nameScore = 100;
    let nameStatus: "excellent" | "good" | "generic" | "poor" = "excellent";

    if (isGenericName) {
      nameScore = 30;
      nameStatus = "generic";
    } else if (cleanRepo.length < 3) {
      nameScore = 40;
      nameStatus = "poor";
    } else if (cleanRepo.length > 45) {
      nameScore = 65;
      nameStatus = "good";
    } else if (cleanRepo.includes(" ") || cleanRepo.includes("_")) {
      nameScore = 75;
      nameStatus = "good";
    }

    // 5. Commit Quality & History Analysis
    const analyzedCommits = recentCommitsRaw.map((c: any) => {
      const message = c.commit?.message?.split("\n")[0] || "";
      const isConventional = CONVENTIONAL_REGEX.test(message);
      const isLazy = LAZY_REGEX.test(message) || message.trim().length <= 6;
      return {
        sha: c.sha ? c.sha.substring(0, 7) : "",
        message,
        date: c.commit?.author?.date || "",
        author: c.commit?.author?.name || "",
        isConventional,
        isLazy,
      };
    });

    const totalCommitsAudited = analyzedCommits.length;
    const conventionalCount = analyzedCommits.filter((c: any) => c.isConventional).length;
    const lazyCount = analyzedCommits.filter((c: any) => c.isLazy).length;
    const conventionalRatio =
      totalCommitsAudited > 0
        ? Math.round((conventionalCount / totalCommitsAudited) * 100)
        : 0;

    let commitQualityScore = 75; // baseline
    if (totalCommitsAudited > 0) {
      const conventionalScore = (conventionalCount / totalCommitsAudited) * 50;
      const lazyPenalty = (lazyCount / totalCommitsAudited) * 40;
      const branchBonus = defaultBranch === "main" ? 10 : 0;
      commitQualityScore = Math.max(
        15,
        Math.min(100, Math.round(50 + conventionalScore - lazyPenalty + branchBonus))
      );
    }

    // 6. Calculate Weighted Repo Health Score (0 - 100)
    let structurePoints = 0;
    if (hasPackageJson) structurePoints += 25;
    if (hasGitignore) structurePoints += 20;
    if (hasLicense) structurePoints += 20;
    if (hasTests) structurePoints += 20;
    if (hasWorkflows) structurePoints += 15;

    let readmePoints = 0;
    if (readmeStats.exists) readmePoints += 30;
    if (readmeStats.hasInstall) readmePoints += 25;
    if (readmeStats.hasUsage) readmePoints += 20;
    if (readmeStats.hasScreenshots) readmePoints += 15;
    if (readmeStats.hasBadges) readmePoints += 10;

    let metadataPoints = 0;
    if (hasDescription && description.length >= 15) metadataPoints += 45;
    else if (hasDescription) metadataPoints += 25;
    if (hasTopics && topics.length >= 3) metadataPoints += 35;
    else if (hasTopics) metadataPoints += 20;
    if (hasHomepage) metadataPoints += 20;

    const overallScore = Math.min(
      100,
      Math.max(
        10,
        Math.round(
          structurePoints * 0.3 +
            readmePoints * 0.25 +
            commitQualityScore * 0.25 +
            metadataPoints * 0.15 +
            (nameScore >= 80 ? 5 : 0)
        )
      )
    );

    let grade: "S" | "A" | "B" | "C" | "D" = "C";
    if (overallScore >= 90) grade = "S";
    else if (overallScore >= 75) grade = "A";
    else if (overallScore >= 60) grade = "B";
    else if (overallScore >= 40) grade = "C";
    else grade = "D";

    // 7. Generate Targeted Findings & Actionable Recommendations
    const repoFindings: Array<{
      severity: "critical" | "high" | "medium" | "low";
      category: "metadata" | "commits" | "readme" | "architecture" | "naming";
      title: string;
      description: string;
      fix: string;
    }> = [];

    // Description Finding
    if (!hasDescription) {
      repoFindings.push({
        severity: "high",
        category: "metadata",
        title: "Missing Repository Description",
        description:
          "The 'About' section has no description. Repositories without descriptions suffer from low discoverability and recruiters cannot instantly determine what the codebase does.",
        fix: "Click the gear icon next to 'About' on GitHub and add a concise 1-sentence summary of what this application does.",
      });
    } else if (description.length < 15) {
      repoFindings.push({
        severity: "medium",
        category: "metadata",
        title: "Description Too Brief",
        description: `Current description is only ${description.length} characters ("${description}"). Providing a clearer summary boosts SEO and understanding.`,
        fix: "Expand the description to mention the primary technology stack and key feature.",
      });
    }

    // Topics Finding
    if (!hasTopics) {
      repoFindings.push({
        severity: "medium",
        category: "metadata",
        title: "Zero GitHub Topics Configured",
        description:
          "No topics/tags detected. GitHub topics (e.g., 'nextjs', 'typescript', 'tailwind') are critical for GitHub search indexing and highlight key proficiencies at a glance.",
        fix: "Add 3-6 relevant topic tags in the repository's 'About' settings.",
      });
    }

    // Live Demo Finding
    if (!hasHomepage) {
      repoFindings.push({
        severity: "medium",
        category: "metadata",
        title: "No Live Demo / Website URL",
        description:
          "Recruiters, reviewers, and contributors cannot interact with a running deployment without a homepage link.",
        fix: "Deploy the project to Vercel/Netlify/Pages and link the URL under the repository 'Website' field.",
      });
    }

    // Name Quality Finding
    if (isGenericName) {
      repoFindings.push({
        severity: "high",
        category: "naming",
        title: `Generic Repository Name ("${cleanRepo}")`,
        description:
          "Generic names like 'app', 'code', or 'test' appear like unmaintained tutorial starter code to recruiters and hiring managers.",
        fix: "Rename the repository to reflect its unique engineering domain (e.g. 'devscope-auditor' or 'task-tracker-api').",
      });
    }

    // Commit Quality Findings
    if (lazyCount > 1 || (totalCommitsAudited > 0 && lazyCount / totalCommitsAudited > 0.25)) {
      repoFindings.push({
        severity: "high",
        category: "commits",
        title: `Vague / Lazy Commit Messages (${lazyCount} Detected)`,
        description: `${lazyCount} of the last ${totalCommitsAudited} commits use non-descriptive messages like 'update', 'fix', or 'first commit'.`,
        fix: "Adopt the Conventional Commits standard (e.g. 'feat: implement repo evaluation' or 'fix: resolve navbar wrap').",
      });
    }

    if (totalCommitsAudited > 3 && conventionalRatio < 35) {
      repoFindings.push({
        severity: "medium",
        category: "commits",
        title: "Low Conventional Commit Adherence",
        description: `Only ${conventionalRatio}% of recent commits follow structured prefixes (feat:, fix:, chore:, docs:).`,
        fix: "Use commitizen, commitlint, or standard prefixes to structure your Git change history.",
      });
    }

    if (defaultBranch === "master") {
      repoFindings.push({
        severity: "low",
        category: "commits",
        title: "Legacy Default Branch ('master')",
        description:
          "Modern GitHub repositories standardize on 'main' as the primary branch.",
        fix: "Rename the default branch from 'master' to 'main' in Settings -> Branches.",
      });
    }

    // README Findings
    if (!readmeStats.exists) {
      repoFindings.push({
        severity: "critical",
        category: "readme",
        title: "Missing README.md",
        description:
          "Reviewers and hiring managers cannot understand what this codebase does or how to run it without a README file.",
        fix: "Add a README.md file with project title, purpose, tech stack, and setup steps.",
      });
    } else {
      if (!readmeStats.hasInstall) {
        repoFindings.push({
          severity: "high",
          category: "readme",
          title: "Missing Installation / Setup Guide",
          description: "No installation or run instructions detected in the README text.",
          fix: "Add a 'Getting Started' section with step-by-step commands (e.g. npm install && npm run dev).",
        });
      }
      if (!readmeStats.hasUsage) {
        repoFindings.push({
          severity: "medium",
          category: "readme",
          title: "No Usage or Architecture Section",
          description:
            "Engineers and recruiters benefit from code snippets or architecture specs showing how the application functions.",
          fix: "Include a 'Usage' or 'Architecture' section in the README.",
        });
      }
    }

    // License Finding
    if (!hasLicense) {
      repoFindings.push({
        severity: "medium",
        category: "architecture",
        title: "Missing Open-Source License",
        description:
          "Without a LICENSE file, third parties and hiring teams cannot legally evaluate, inspect, or reuse this codebase.",
        fix: "Add an MIT, Apache 2.0, or suitable open-source license file.",
      });
    }

    // CI/CD Finding
    if (!hasWorkflows) {
      repoFindings.push({
        severity: "low",
        category: "architecture",
        title: "No GitHub Actions CI/CD Pipeline",
        description:
          "Automated linting and test workflows demonstrate production-ready engineering hygiene and team standards.",
        fix: "Add `.github/workflows/ci.yml` to automatically run tests and builds on pull requests.",
      });
    }

    // Test Suite Finding
    if (!hasTests) {
      repoFindings.push({
        severity: "medium",
        category: "architecture",
        title: "No Automated Test Suite Detected",
        description:
          "No test files or directories (test, spec, __tests__) detected in the root tree.",
        fix: "Add basic unit tests (Vitest, Jest, Pytest) to demonstrate code reliability.",
      });
    }

    return NextResponse.json({
      repo: cleanRepo,
      owner: cleanUsername,
      overallScore,
      grade,
      metadata: {
        description: description || null,
        topics,
        homepage: homepage || null,
        stars,
        forks,
        openIssues,
        defaultBranch,
        isArchived,
        hasDescription,
        hasTopics,
        hasHomepage,
      },
      nameQuality: {
        score: nameScore,
        status: nameStatus,
        isGeneric: isGenericName,
      },
      commitQuality: {
        score: commitQualityScore,
        totalAudited: totalCommitsAudited,
        conventionalCount,
        lazyCount,
        conventionalRatio,
        recentCommits: analyzedCommits,
      },
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
      files: rootFiles.map((f: any) => ({
        name: f.name,
        type: f.type,
        size: f.size,
      })),
      findings: repoFindings,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to inspect repository" },
      { status: 500 }
    );
  }
}
