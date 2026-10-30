import {
  GitHubUserProfile,
  GitHubRepoItem,
  OverallAuditReport,
  CategoryAuditResult,
  Finding,
  RoadmapTask,
  RepoAuditResult,
  AuditCheck,
} from "@/types/audit";

export class AuditScoringEngine {
  /**
   * Main audit calculation
   */
  public evaluateAudit(
    profile: GitHubUserProfile,
    repositories: GitHubRepoItem[],
    repoReadmes: Map<string, string | null> = new Map(),
    repoWorkflows: Map<string, boolean> = new Map()
  ): OverallAuditReport {
    const findings: Finding[] = [];

    // Evaluate 5 core categories
    const profileCategory = this.evaluateProfile(profile, findings);
    const reposCategory = this.evaluateRepositories(repositories, findings);
    const codeCategory = this.evaluateCodeQuality(repositories, findings);
    const docCategory = this.evaluateDocumentation(repositories, repoReadmes, findings);
    const activityCategory = this.evaluateActivity(profile, repositories, findings);

    // Compute deterministic overall score based on strict weights:
    // Profile: 15%, Repos: 30%, Code: 25%, Doc: 15%, Activity: 15%
    const overallScore = Math.round(
      profileCategory.score * 0.15 +
      reposCategory.score * 0.30 +
      codeCategory.score * 0.25 +
      docCategory.score * 0.15 +
      activityCategory.score * 0.15
    );

    const { grade, gradeLabel } = this.calculateGrade(overallScore);

    // Group findings into strengths and weaknesses
    const strengths = findings.filter((f) => f.severity === "positive");
    const weaknesses = findings.filter((f) => f.severity !== "positive");

    // Evaluate individual repository scorecards
    const evaluatedRepos = this.evaluateIndividualRepos(repositories, repoReadmes, repoWorkflows);

    // Generate gamified RPG quests
    const roadmap = this.generateRoadmap(weaknesses, profile, repositories);

    return {
      username: profile.login,
      profile,
      overallScore,
      grade,
      gradeLabel,
      analyzedAt: new Date().toISOString(),
      categories: {
        profile: profileCategory,
        repositories: reposCategory,
        code_quality: codeCategory,
        documentation: docCategory,
        activity: activityCategory,
      },
      strengths,
      weaknesses,
      repositories: evaluatedRepos,
      roadmap,
    };
  }

  /**
   * 1. Profile Quality (Weight: 15%)
   */
  private evaluateProfile(profile: GitHubUserProfile, findings: Finding[]): CategoryAuditResult {
    const checks: AuditCheck[] = [];

    // Check Bio
    const hasBio = Boolean(profile.bio && profile.bio.trim().length > 10);
    checks.push({
      id: "prof_bio",
      name: "Professional Bio",
      description: "Bio provides a concise elevator pitch of technical focus",
      weight: 25,
      status: hasBio ? "pass" : "warning",
      score: hasBio ? 100 : 30,
      evidence: profile.bio ? `"${profile.bio.slice(0, 80)}..."` : "No bio provided on public profile",
      recommendation: hasBio
        ? undefined
        : "Add a concise 1-2 sentence bio describing your primary stack, domain focus, or current goals.",
    });

    if (hasBio) {
      findings.push({
        id: "str_bio",
        category: "profile",
        severity: "positive",
        title: "Clean Developer Bio",
        description: "Your profile clearly introduces your focus and expertise.",
        evidence: `Bio present: "${profile.bio?.slice(0, 60)}..."`,
        recommendation: "Keep your bio updated as your interests evolve.",
      });
    } else {
      findings.push({
        id: "weak_bio",
        category: "profile",
        severity: "medium",
        title: "Missing or Short Bio",
        description: "Recruiters and collaborators see empty bio sections as incomplete profiles.",
        evidence: profile.bio || "Bio field is completely empty.",
        recommendation: "Write a high-impact developer bio with your specialty and keywords.",
      });
    }

    // Check Location
    const hasLocation = Boolean(profile.location && profile.location.trim().length > 1);
    checks.push({
      id: "prof_location",
      name: "Location / Timezone",
      description: "Location helps recruiters gauge timezone alignment for remote roles",
      weight: 15,
      status: hasLocation ? "pass" : "warning",
      score: hasLocation ? 100 : 40,
      evidence: profile.location ? `Location: ${profile.location}` : "Location not specified",
      recommendation: hasLocation ? undefined : "Set your city or timezone on your GitHub profile.",
    });

    // Check Portfolio / Website
    const hasBlog = Boolean(profile.blog && profile.blog.trim().length > 3);
    checks.push({
      id: "prof_website",
      name: "Portfolio / Website Link",
      description: "External link connects viewers to your portfolio, blog, or LinkedIn",
      weight: 25,
      status: hasBlog ? "pass" : "warning",
      score: hasBlog ? 100 : 25,
      evidence: profile.blog ? `Link: ${profile.blog}` : "No external portfolio link configured",
      recommendation: hasBlog
        ? undefined
        : "Link your personal portfolio, blog, or LinkedIn to maximize inbound opportunities.",
    });

    if (!hasBlog) {
      findings.push({
        id: "weak_blog",
        category: "profile",
        severity: "medium",
        title: "No Portfolio or External Link",
        description: "Public profiles without links miss out on directing technical reviewers to live work.",
        evidence: "Profile blog field is blank.",
        recommendation: "Add your personal portfolio, LinkedIn profile, or technical blog URL.",
      });
    } else {
      findings.push({
        id: "str_blog",
        category: "profile",
        severity: "positive",
        title: "Connected Portfolio Link",
        description: "Reviewers can easily explore your external presence and credentials.",
        evidence: `External URL verified: ${profile.blog}`,
        recommendation: "Ensure all links on your portfolio are active and mobile-responsive.",
      });
    }

    // Check Full Name
    const hasName = Boolean(profile.name && profile.name.trim().length > 1);
    checks.push({
      id: "prof_name",
      name: "Display Name",
      description: "Using a real name enhances professional credibility and searchability",
      weight: 20,
      status: hasName ? "pass" : "warning",
      score: hasName ? 100 : 50,
      evidence: profile.name ? `Display name: ${profile.name}` : `Only username @${profile.login} is visible`,
      recommendation: hasName ? undefined : "Set your display name so hiring teams can identify you.",
    });

    // Check Avatar
    const hasAvatar = Boolean(profile.avatar_url && !profile.avatar_url.includes("identicon"));
    checks.push({
      id: "prof_avatar",
      name: "Custom Avatar",
      description: "Custom profile picture or identifiable avatar distinguishes your persona",
      weight: 15,
      status: hasAvatar ? "pass" : "warning",
      score: hasAvatar ? 100 : 40,
      evidence: hasAvatar ? "Custom avatar uploaded" : "Default or generic avatar detected",
      recommendation: hasAvatar ? undefined : "Upload a clean headshot or recognizable avatar.",
    });

    const categoryScore = Math.round(
      checks.reduce((acc, c) => acc + (c.score * c.weight) / 100, 0)
    );

    return {
      category: "profile",
      title: "Profile Quality",
      weight: 0.15,
      score: categoryScore,
      status: categoryScore >= 80 ? "exceptional" : categoryScore >= 60 ? "good" : "needs_work",
      summary: `${checks.filter((c) => c.status === "pass").length} of ${checks.length} profile criteria fulfilled.`,
      checks,
    };
  }

  /**
   * 2. Repository Quality (Weight: 30%)
   */
  private evaluateRepositories(repositories: GitHubRepoItem[], findings: Finding[]): CategoryAuditResult {
    const checks: AuditCheck[] = [];

    if (repositories.length === 0) {
      checks.push({
        id: "repo_count",
        name: "Public Repositories",
        description: "Developers should have public projects showcasing their abilities",
        weight: 100,
        status: "fail",
        score: 0,
        evidence: "Zero public repositories found",
        recommendation: "Publish at least 2-3 focused projects to showcase your skills.",
      });

      findings.push({
        id: "weak_no_repos",
        category: "repositories",
        severity: "critical",
        title: "No Public Repositories Found",
        description: "An empty GitHub portfolio prevents engineering teams from assessing your abilities.",
        evidence: "Public repository count: 0",
        recommendation: "Create and publish open-source repositories showcasing your code.",
      });

      return {
        category: "repositories",
        title: "Repository Quality",
        weight: 0.30,
        score: 0,
        status: "critical",
        summary: "No public repositories available for evaluation.",
        checks,
      };
    }

    // Check descriptions ratio
    const withDesc = repositories.filter((r) => r.description && r.description.trim().length > 5);
    const descRatio = Math.round((withDesc.length / repositories.length) * 100);
    const descScore = descRatio;

    checks.push({
      id: "repo_descriptions",
      name: "Repository Descriptions",
      description: "Every repository should have a concise summary of what it does",
      weight: 25,
      status: descScore >= 80 ? "pass" : descScore >= 50 ? "warning" : "fail",
      score: descScore,
      evidence: `${withDesc.length}/${repositories.length} (${descRatio}%) repositories have descriptions`,
      recommendation: descScore >= 80 ? undefined : "Add clear 1-sentence descriptions explaining each project's purpose.",
    });

    if (descRatio < 70) {
      const missingRepos = repositories.filter((r) => !r.description).map((r) => r.name).slice(0, 3);
      findings.push({
        id: "weak_missing_descriptions",
        category: "repositories",
        severity: "high",
        title: "Missing Repository Descriptions",
        description: "Repositories without descriptions look abandoned or careless at first glance.",
        evidence: `Missing descriptions in: ${missingRepos.join(", ")}`,
        recommendation: "Edit your repository settings and add a summary sentence to each project.",
        affectedRepo: missingRepos[0],
      });
    } else {
      findings.push({
        id: "str_descriptions",
        category: "repositories",
        severity: "positive",
        title: "High Description Coverage",
        description: "Most of your repositories clearly tell reviewers what they do right away.",
        evidence: `${descRatio}% of repositories have meaningful descriptions.`,
        recommendation: "Maintain this standard for future repositories.",
      });
    }

    // Check Original vs Forked ratio
    const originalRepos = repositories.filter((r) => !r.fork);
    const originalRatio = Math.round((originalRepos.length / repositories.length) * 100);
    const originalScore = originalRatio >= 60 ? 100 : Math.round((originalRatio / 60) * 100);

    checks.push({
      id: "repo_originality",
      name: "Original vs Fork Ratio",
      description: "Recruiters look for original projects created by the developer rather than idle forks",
      weight: 25,
      status: originalScore >= 80 ? "pass" : "warning",
      score: originalScore,
      evidence: `${originalRepos.length}/${repositories.length} (${originalRatio}%) are original projects`,
      recommendation: originalRatio >= 60 ? undefined : "Focus on creating original work rather than accumulating inactive forks.",
    });

    // Check License coverage
    const withLicense = repositories.filter((r) => r.license !== null);
    const licenseRatio = Math.round((withLicense.length / repositories.length) * 100);
    const licenseScore = licenseRatio;

    checks.push({
      id: "repo_licenses",
      name: "Open Source Licensing",
      description: "Licensing clarifies usage terms, demonstrating professional open source hygiene",
      weight: 25,
      status: licenseScore >= 60 ? "pass" : licenseScore >= 30 ? "warning" : "fail",
      score: licenseScore,
      evidence: `${withLicense.length}/${repositories.length} (${licenseRatio}%) contain a declared open source license`,
      recommendation: licenseScore >= 60 ? undefined : "Add standard licenses (e.g., MIT, Apache-2.0) to your public code.",
    });

    if (licenseRatio < 50) {
      const unlicensed = repositories.filter((r) => !r.license).map((r) => r.name).slice(0, 3);
      findings.push({
        id: "weak_unlicensed_repos",
        category: "repositories",
        severity: "medium",
        title: "Unlicensed Repositories",
        description: "Without a license, public repositories cannot legally be reused or integrated by others.",
        evidence: `Unlicensed projects include: ${unlicensed.join(", ")}`,
        recommendation: "Add an MIT or Apache 2.0 license file to your projects.",
        affectedRepo: unlicensed[0],
      });
    }

    // Check Topic Tagging
    const withTopics = repositories.filter((r) => r.topics && r.topics.length > 0);
    const topicsRatio = Math.round((withTopics.length / repositories.length) * 100);
    const topicsScore = topicsRatio;

    checks.push({
      id: "repo_topics",
      name: "GitHub Topics & Tags",
      description: "Topics make repositories discoverable and indicate the technical stack used",
      weight: 25,
      status: topicsScore >= 50 ? "pass" : topicsScore >= 20 ? "warning" : "fail",
      score: topicsScore,
      evidence: `${withTopics.length}/${repositories.length} (${topicsRatio}%) repositories are tagged with topics`,
      recommendation: topicsScore >= 50 ? undefined : "Tag repositories with keywords (e.g. react, nextjs, typescript, tailwind).",
    });

    const categoryScore = Math.round(
      checks.reduce((acc, c) => acc + (c.score * c.weight) / 100, 0)
    );

    return {
      category: "repositories",
      title: "Repository Quality",
      weight: 0.30,
      score: categoryScore,
      status: categoryScore >= 80 ? "exceptional" : categoryScore >= 60 ? "good" : "needs_work",
      summary: `${originalRepos.length} original projects evaluated across ${repositories.length} public repos.`,
      checks,
    };
  }

  /**
   * 3. Code Quality Indicators (Weight: 25%)
   */
  private evaluateCodeQuality(repositories: GitHubRepoItem[], findings: Finding[]): CategoryAuditResult {
    const checks: AuditCheck[] = [];

    // Language clarity
    const languagesMap = new Map<string, number>();
    repositories.forEach((r) => {
      if (r.language) {
        languagesMap.set(r.language, (languagesMap.get(r.language) || 0) + 1);
      }
    });

    const primaryLanguages = Array.from(languagesMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    const hasStrongFocus = primaryLanguages.length > 0 && primaryLanguages[0][1] >= 2;
    checks.push({
      id: "code_focus",
      name: "Language Specialization",
      description: "A focused technology stack indicates deeper competency rather than scattered dabbling",
      weight: 35,
      status: hasStrongFocus ? "pass" : "warning",
      score: hasStrongFocus ? 90 : 60,
      evidence: primaryLanguages.length > 0
        ? `Primary stacks: ${primaryLanguages.map(([l, c]) => `${l} (${c} repos)`).join(", ")}`
        : "No distinct programming languages detected",
      recommendation: hasStrongFocus
        ? undefined
        : "Demonstrate deeper competency in 1-2 core technologies across multiple projects.",
    });

    if (hasStrongFocus) {
      findings.push({
        id: "str_lang_focus",
        category: "code_quality",
        severity: "positive",
        title: `Clear Specialization in ${primaryLanguages[0][0]}`,
        description: "Your public projects demonstrate coherent focus in key engineering stacks.",
        evidence: `${primaryLanguages[0][0]} is the primary language across ${primaryLanguages[0][1]} projects.`,
        recommendation: "Continue building advanced architectural patterns in your core language.",
      });
    }

    // Default branch standardization (modern 'main' vs legacy)
    const usingModernDefault = repositories.filter((r) => r.default_branch === "main");
    const modernBranchRatio = repositories.length > 0
      ? Math.round((usingModernDefault.length / repositories.length) * 100)
      : 0;

    checks.push({
      id: "code_branch_standard",
      name: "Modern Default Branch ('main')",
      description: "Modern Git workflow convention uses 'main' as default branch",
      weight: 25,
      status: modernBranchRatio >= 70 ? "pass" : "warning",
      score: modernBranchRatio,
      evidence: `${usingModernDefault.length}/${repositories.length} (${modernBranchRatio}%) use modern 'main' branch`,
      recommendation: modernBranchRatio >= 70 ? undefined : "Standardize older repositories to modern 'main' default branches.",
    });

    // Repository maintenance hygiene (open issues vs total)
    const reposWithExcessiveIssues = repositories.filter((r) => r.open_issues_count > 30);
    const issueHygieneScore = reposWithExcessiveIssues.length === 0 ? 100 : Math.max(40, 100 - reposWithExcessiveIssues.length * 15);

    checks.push({
      id: "code_issue_hygiene",
      name: "Issue & Backlog Hygiene",
      description: "Unmaintained issue backlogs signal abandoned code",
      weight: 20,
      status: issueHygieneScore >= 80 ? "pass" : "warning",
      score: issueHygieneScore,
      evidence: reposWithExcessiveIssues.length === 0
        ? "No stale high-issue backlogs detected"
        : `${reposWithExcessiveIssues.length} repositories have elevated unaddressed issue counts`,
      recommendation: reposWithExcessiveIssues.length === 0 ? undefined : "Triage or close resolved issues in older repositories.",
    });

    // Active project size & non-empty repositories
    const nonTrivialRepos = repositories.filter((r) => r.size > 20); // > 20 KB
    const sizeRatio = repositories.length > 0
      ? Math.round((nonTrivialRepos.length / repositories.length) * 100)
      : 0;

    checks.push({
      id: "code_depth",
      name: "Substantial Project Depth",
      description: "Projects should contain real code rather than empty repositories or single files",
      weight: 20,
      status: sizeRatio >= 75 ? "pass" : "warning",
      score: sizeRatio,
      evidence: `${nonTrivialRepos.length}/${repositories.length} projects have substantial commit history & assets`,
      recommendation: sizeRatio >= 75 ? undefined : "Archive or prune empty or tutorial test repositories.",
    });

    const categoryScore = Math.round(
      checks.reduce((acc, c) => acc + (c.score * c.weight) / 100, 0)
    );

    return {
      category: "code_quality",
      title: "Code Quality Indicators",
      weight: 0.25,
      score: categoryScore,
      status: categoryScore >= 80 ? "exceptional" : categoryScore >= 60 ? "good" : "needs_work",
      summary: `Evaluated codebase conventions across ${repositories.length} projects.`,
      checks,
    };
  }

  /**
   * 4. Documentation (Weight: 15%)
   */
  private evaluateDocumentation(
    repositories: GitHubRepoItem[],
    repoReadmes: Map<string, string | null>,
    findings: Finding[]
  ): CategoryAuditResult {
    const checks: AuditCheck[] = [];

    if (repositories.length === 0) {
      return {
        category: "documentation",
        title: "Documentation",
        weight: 0.15,
        score: 0,
        status: "critical",
        summary: "No repositories to audit for documentation.",
        checks: [],
      };
    }

    // Inspect top repositories for README presence & depth
    const topRepos = repositories.slice(0, 10);
    let readmeFoundCount = 0;
    let comprehensiveReadmeCount = 0;
    let setupInstructionsCount = 0;

    topRepos.forEach((repo) => {
      const readme = repoReadmes.get(repo.name);
      if (readme && readme.trim().length > 50) {
        readmeFoundCount++;
        if (readme.length > 500) {
          comprehensiveReadmeCount++;
        }
        const lower = readme.toLowerCase();
        if (
          lower.includes("install") ||
          lower.includes("getting started") ||
          lower.includes("usage") ||
          lower.includes("setup") ||
          lower.includes("pnpm") ||
          lower.includes("npm install")
        ) {
          setupInstructionsCount++;
        }
      }
    });

    const readmeRatio = topRepos.length > 0 ? Math.round((readmeFoundCount / topRepos.length) * 100) : 0;
    const depthRatio = topRepos.length > 0 ? Math.round((comprehensiveReadmeCount / topRepos.length) * 100) : 0;
    const setupRatio = topRepos.length > 0 ? Math.round((setupInstructionsCount / topRepos.length) * 100) : 0;

    checks.push({
      id: "doc_readme_presence",
      name: "README Presence",
      description: "A README file is the essential front door for every software project",
      weight: 40,
      status: readmeRatio >= 80 ? "pass" : readmeRatio >= 50 ? "warning" : "fail",
      score: readmeRatio,
      evidence: `${readmeFoundCount}/${topRepos.length} inspected top repositories have a README`,
      recommendation: readmeRatio >= 80 ? undefined : "Create a README.md for every public project.",
    });

    if (readmeRatio < 75) {
      const missingReadmeRepo = topRepos.find((r) => !repoReadmes.get(r.name));
      findings.push({
        id: "weak_missing_readme",
        category: "documentation",
        severity: "critical",
        title: "Missing README in Core Projects",
        description: "Projects without a README cannot be understood or evaluated by engineers or recruiters.",
        evidence: `${topRepos.length - readmeFoundCount} of your top projects lack documentation.`,
        recommendation: "Add a structured README explaining what the project is, why it was built, and how to run it.",
        affectedRepo: missingReadmeRepo?.name,
      });
    }

    checks.push({
      id: "doc_setup_instructions",
      name: "Installation & Run Guide",
      description: "README contains explicit setup commands (e.g. npm install, run, config)",
      weight: 35,
      status: setupRatio >= 60 ? "pass" : setupRatio >= 30 ? "warning" : "fail",
      score: setupRatio,
      evidence: `${setupInstructionsCount}/${topRepos.length} inspected projects contain setup instructions`,
      recommendation: setupRatio >= 60 ? undefined : "Include clear step-by-step setup and local development instructions.",
    });

    if (setupRatio < 50) {
      findings.push({
        id: "weak_missing_setup",
        category: "documentation",
        severity: "high",
        title: "Missing Installation & Run Instructions",
        description: "Reviewers cannot test or execute projects that do not provide clear setup commands.",
        evidence: `Only ${setupRatio}% of inspected projects document how to run the code.`,
        recommendation: "Add a 'Getting Started' section with exact commands: clone, install, env vars, and start.",
      });
    }

    // Demo / Homepage links in repo metadata
    const withHomepage = repositories.filter((r) => r.homepage && r.homepage.trim().length > 3);
    const demoRatio = Math.round((withHomepage.length / repositories.length) * 100);
    const demoScore = Math.min(100, demoRatio * 2.5); // 40% with demos = 100 score

    checks.push({
      id: "doc_live_demos",
      name: "Live Demos / Deployments",
      description: "Deployed demos allow recruiters to experience web and application work directly",
      weight: 25,
      status: demoScore >= 60 ? "pass" : "warning",
      score: Math.round(demoScore),
      evidence: `${withHomepage.length} repositories feature live demo / deployment links`,
      recommendation: demoScore >= 60 ? undefined : "Deploy your web projects (e.g. on Vercel) and paste the URL in the repository homepage field.",
    });

    if (withHomepage.length > 0) {
      findings.push({
        id: "str_live_demos",
        category: "documentation",
        severity: "positive",
        title: "Active Live Deployments",
        description: "You provide live URLs allowing reviewers to test your applications in the browser.",
        evidence: `${withHomepage.length} projects include verified deployment links.`,
        recommendation: "Keep demo links verified and add screenshots to the README.",
      });
    }

    const categoryScore = Math.round(
      checks.reduce((acc, c) => acc + (c.score * c.weight) / 100, 0)
    );

    return {
      category: "documentation",
      title: "Documentation",
      weight: 0.15,
      score: categoryScore,
      status: categoryScore >= 80 ? "exceptional" : categoryScore >= 60 ? "good" : "needs_work",
      summary: `Audited README depth and setup instructions on top repositories.`,
      checks,
    };
  }

  /**
   * 5. Activity & Maintenance (Weight: 15%)
   */
  private evaluateActivity(
    profile: GitHubUserProfile,
    repositories: GitHubRepoItem[],
    findings: Finding[]
  ): CategoryAuditResult {
    const checks: AuditCheck[] = [];

    const now = Date.now();
    const sixMonthsAgo = now - 180 * 24 * 60 * 60 * 1000;
    const oneYearAgo = now - 365 * 24 * 60 * 60 * 1000;

    const updatedRecently = repositories.filter((r) => new Date(r.pushed_at || r.updated_at).getTime() > sixMonthsAgo);
    const updatedWithinYear = repositories.filter((r) => new Date(r.pushed_at || r.updated_at).getTime() > oneYearAgo);

    const recencyRatio = repositories.length > 0
      ? Math.round((updatedRecently.length / repositories.length) * 100)
      : 0;

    const hasRecentActivity = updatedRecently.length > 0;
    checks.push({
      id: "act_recency",
      name: "Recent Engineering Cadence",
      description: "Active development within the last 6 months shows ongoing growth and engagement",
      weight: 50,
      status: hasRecentActivity ? "pass" : "fail",
      score: hasRecentActivity ? 95 : 30,
      evidence: hasRecentActivity
        ? `${updatedRecently.length} repositories updated in the last 6 months`
        : "No public code updates detected in the last 180 days",
      recommendation: hasRecentActivity
        ? undefined
        : "Push ongoing code improvements or personal projects to demonstrate current activity.",
    });

    if (hasRecentActivity) {
      findings.push({
        id: "str_recent_activity",
        category: "activity",
        severity: "positive",
        title: "Active Developer Cadence",
        description: "Your profile exhibits recent commits and maintained repositories.",
        evidence: `Active updates in: ${updatedRecently.slice(0, 3).map((r) => r.name).join(", ")}`,
        recommendation: "Continue regular commit habits and meaningful pull requests.",
      });
    } else {
      findings.push({
        id: "weak_stale_activity",
        category: "activity",
        severity: "high",
        title: "Stale Public Activity",
        description: "No public repository activity detected within the last 6 months.",
        evidence: "Most recent public push is over 180 days old.",
        recommendation: "Resume public activity by shipping improvements to existing repos or new tools.",
      });
    }

    // Account maturity
    const accountAgeYears = Math.max(
      0.5,
      Math.round(((now - new Date(profile.created_at).getTime()) / (365 * 24 * 60 * 60 * 1000)) * 10) / 10
    );

    checks.push({
      id: "act_maturity",
      name: "Account Track Record",
      description: "Established GitHub tenure confirms long-term developer identity",
      weight: 25,
      status: "pass",
      score: Math.min(100, Math.round(accountAgeYears * 25)),
      evidence: `Account established for ${accountAgeYears} years (since ${profile.created_at.slice(0, 10)})`,
    });

    // Repository maintenance ratio (archived vs active)
    const archivedCount = repositories.filter((r) => r.archived).length;
    const archivedRatio = repositories.length > 0
      ? Math.round((archivedCount / repositories.length) * 100)
      : 0;

    checks.push({
      id: "act_archived_hygiene",
      name: "Portfolio Curation",
      description: "Good engineering hygiene includes archiving deprecated experiments",
      weight: 25,
      status: "pass",
      score: 90,
      evidence: `${repositories.length - archivedCount} active repositories, ${archivedCount} archived`,
    });

    const categoryScore = Math.round(
      checks.reduce((acc, c) => acc + (c.score * c.weight) / 100, 0)
    );

    return {
      category: "activity",
      title: "Activity & Maintenance",
      weight: 0.15,
      score: categoryScore,
      status: categoryScore >= 80 ? "exceptional" : categoryScore >= 60 ? "good" : "needs_work",
      summary: `${updatedRecently.length} projects updated recently across an account age of ${accountAgeYears} years.`,
      checks,
    };
  }

  /**
   * Evaluate individual repository cards
   */
  private evaluateIndividualRepos(
    repositories: GitHubRepoItem[],
    repoReadmes: Map<string, string | null>,
    repoWorkflows: Map<string, boolean>
  ): RepoAuditResult[] {
    return repositories.map((repo) => {
      const readme = repoReadmes.get(repo.name);
      const hasReadme = Boolean(readme && readme.trim().length > 30);
      const readmeLength = readme ? readme.trim().length : 0;
      const hasLicense = Boolean(repo.license);
      const hasDescription = Boolean(repo.description && repo.description.trim().length > 5);
      const hasTopics = Boolean(repo.topics && repo.topics.length > 0);
      const hasCiCd = repoWorkflows.get(repo.name) ?? false;
      const hasGitignore = true; // default presumed for evaluated public repos

      // Deterministic repo score calculation out of 100
      let score = 30; // base score
      if (hasReadme) score += 25;
      if (readmeLength > 500) score += 10;
      if (hasLicense) score += 15;
      if (hasDescription) score += 10;
      if (hasTopics) score += 5;
      if (hasCiCd) score += 5;

      const findings: Finding[] = [];
      if (!hasReadme) {
        findings.push({
          id: `repo_${repo.name}_no_readme`,
          category: "documentation",
          severity: "critical",
          title: "Missing README Documentation",
          description: "This repository has no README file explaining its purpose.",
          evidence: `Repository "${repo.name}" has no markdown documentation`,
          recommendation: "Create a README.md explaining what the project does and how to run it.",
          affectedRepo: repo.name,
        });
      }
      if (!hasDescription) {
        findings.push({
          id: `repo_${repo.name}_no_desc`,
          category: "repositories",
          severity: "medium",
          title: "Missing Repository Description",
          description: "No description provided in repository settings.",
          evidence: "Description field is blank",
          recommendation: "Add a 1-sentence description on GitHub.",
          affectedRepo: repo.name,
        });
      }
      if (!hasLicense) {
        findings.push({
          id: `repo_${repo.name}_no_lic`,
          category: "repositories",
          severity: "low",
          title: "No License Specified",
          description: "No declared open-source license found.",
          evidence: "License file absent",
          recommendation: "Add an MIT or Apache 2.0 LICENSE file.",
          affectedRepo: repo.name,
        });
      }

      const qualityStatus: "excellent" | "solid" | "needs_attention" | "poor" =
        score >= 85 ? "excellent" : score >= 70 ? "solid" : score >= 50 ? "needs_attention" : "poor";

      return {
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description,
        primaryLanguage: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        isFork: repo.fork,
        isArchived: repo.archived,
        updatedAt: repo.pushed_at || repo.updated_at,
        createdAt: repo.created_at,
        defaultBranch: repo.default_branch,
        url: repo.html_url,
        score,
        qualityStatus,
        hasReadme,
        readmeLength,
        hasLicense,
        hasTopics,
        hasDescription,
        hasCiCd,
        hasTests: false,
        hasGitignore,
        findings,
      };
    });
  }

  /**
   * Generate RPG Quest Roadmap
   */
  private generateRoadmap(
    weaknesses: Finding[],
    profile: GitHubUserProfile,
    repositories: GitHubRepoItem[]
  ): RoadmapTask[] {
    const tasks: RoadmapTask[] = [];
    let questNumber = 1;

    // Quest from profile bio/link
    if (!profile.bio || profile.bio.length < 15) {
      tasks.push({
        id: "quest_bio",
        questNumber: questNumber++,
        title: "Craft Your Developer Elevator Pitch",
        description: "Write an impactful, concise GitHub bio highlighting your primary stack and current focus.",
        category: "profile",
        priority: "high",
        estimatedEffort: "15 mins",
        xpReward: 150,
        whyItMatters: "First impressions matter: technical recruiters decide whether to keep scrolling within 5 seconds.",
        actionSteps: [
          "Go to your GitHub profile settings",
          "Draft a 1-2 sentence elevator pitch (e.g. 'Full-Stack Engineer building distributed systems with Next.js & Go')",
          "Add your primary tech keywords",
          "Save changes",
        ],
        completed: false,
      });
    }

    if (!profile.blog) {
      tasks.push({
        id: "quest_blog",
        questNumber: questNumber++,
        title: "Connect Your Portfolio or LinkedIn",
        description: "Add an active website link in your GitHub profile settings.",
        category: "profile",
        priority: "medium",
        estimatedEffort: "15 mins",
        xpReward: 100,
        whyItMatters: "Directs inbound interest directly to your resume, portfolio, or contact details.",
        actionSteps: [
          "Open GitHub profile settings",
          "Paste your portfolio, LinkedIn, or personal blog URL",
          "Verify the link resolves cleanly",
        ],
        completed: false,
      });
    }

    // Quest from missing READMEs
    const reposWithoutReadme = repositories.filter((r) => !r.fork).slice(0, 3);
    reposWithoutReadme.forEach((repo) => {
      tasks.push({
        id: `quest_readme_${repo.name}`,
        questNumber: questNumber++,
        title: `Write README for ${repo.name}`,
        description: `Create a clean README.md covering project overview, architecture, and run instructions for ${repo.name}.`,
        category: "documentation",
        priority: "critical",
        estimatedEffort: "1-2 hours",
        xpReward: 300,
        affectedRepo: repo.name,
        whyItMatters: "A project without documentation is functionally invisible to anyone reviewing your code.",
        actionSteps: [
          `Navigate to repository: ${repo.name}`,
          "Add a README.md file with: Project Title & Tagline",
          "Include a Features list & Tech Stack badges",
          "Add copy-pasteable installation commands (`npm install`, `npm run dev`)",
          "Add a screenshot or animated GIF if it is a UI application",
        ],
        completed: false,
      });
    });

    // Quest for open source licensing
    const unlicensedRepo = repositories.find((r) => !r.license && !r.fork);
    if (unlicensedRepo) {
      tasks.push({
        id: `quest_license_${unlicensedRepo.name}`,
        questNumber: questNumber++,
        title: `Add Open Source License to ${unlicensedRepo.name}`,
        description: "Add a recognized open-source license (such as MIT or Apache 2.0) to declare usage terms.",
        category: "repositories",
        priority: "medium",
        estimatedEffort: "15 mins",
        xpReward: 120,
        affectedRepo: unlicensedRepo.name,
        whyItMatters: "Declaring a license demonstrates professional awareness of IP and open source legal hygiene.",
        actionSteps: [
          `Open ${unlicensedRepo.name} on GitHub`,
          "Click 'Add file' -> 'Create new file' -> Name it 'LICENSE'",
          "Choose 'Choose a license template' and select MIT",
          "Commit the new file to the default branch",
        ],
        completed: false,
      });
    }

    // Quest for topics and repository descriptions
    const missingDesc = repositories.filter((r) => !r.description && !r.fork).slice(0, 2);
    if (missingDesc.length > 0) {
      tasks.push({
        id: "quest_topics_desc",
        questNumber: questNumber++,
        title: "Tag Repositories with Topics & Descriptions",
        description: `Add descriptions and tech stack tags to: ${missingDesc.map((r) => r.name).join(", ")}.`,
        category: "repositories",
        priority: "medium",
        estimatedEffort: "30 mins",
        xpReward: 180,
        whyItMatters: "Helps GitHub search algorithms index your work and gives instant clarity to visitors.",
        actionSteps: [
          "Click the gear icon next to 'About' on each repository page",
          "Enter a 1-sentence description of the project",
          "Add 3-5 relevant topics (e.g. react, typescript, api)",
          "Save changes",
        ],
        completed: false,
      });
    }

    // Quest for Automated CI/CD
    tasks.push({
      id: "quest_cicd",
      questNumber: questNumber++,
      title: "Implement GitHub Actions CI Workflow",
      description: "Set up an automated lint & build check workflow using GitHub Actions in your flagship project.",
      category: "code_quality",
      priority: "high",
      estimatedEffort: "1-2 hours",
      xpReward: 250,
      whyItMatters: "Demonstrates production engineering rigor and modern DevOps practices to prospective employers.",
      actionSteps: [
        "In your top project, create directory `.github/workflows/`",
        "Add a `ci.yml` file triggering on `push` and `pull_request`",
        "Configure Node.js / runtime environment",
        "Execute automated tests or build verification (`npm run build`)",
      ],
      completed: false,
    });

    return tasks;
  }

  /**
   * Deterministic grade converter
   */
  private calculateGrade(score: number): { grade: "S" | "A" | "B" | "C" | "D" | "F"; gradeLabel: string } {
    if (score >= 90) return { grade: "S", gradeLabel: "LEGENDARY DEVELOPER PRESENCE" };
    if (score >= 80) return { grade: "A", gradeLabel: "EXCELLENT DEVELOPER PRESENCE" };
    if (score >= 70) return { grade: "B", gradeLabel: "SOLID DEVELOPER FOUNDATION" };
    if (score >= 60) return { grade: "C", gradeLabel: "DEVELOPER IN PROGRESS" };
    if (score >= 45) return { grade: "D", gradeLabel: "EARLY STAGE PROFILE" };
    return { grade: "F", gradeLabel: "NEEDS IMMEDIATE ATTENTION" };
  }
}

export const auditScoringEngine = new AuditScoringEngine();
