export interface GitHubUserProfile {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepoItem {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string | null;
  fork: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  archived: boolean;
  disabled: boolean;
  open_issues_count: number;
  license: {
    key: string;
    name: string;
    spdx_id: string;
    url: string | null;
  } | null;
  topics: string[];
  default_branch: string;
}

export type CheckStatus = "pass" | "warning" | "fail" | "not_applicable" | "not_evaluated";

export interface AuditCheck {
  id: string;
  name: string;
  description: string;
  weight: number;
  status: CheckStatus;
  score: number; // 0 to 100
  evidence: string;
  recommendation?: string;
}

export interface CategoryAuditResult {
  category: "profile" | "repositories" | "code_quality" | "documentation" | "activity";
  title: string;
  weight: number; // e.g. 0.15 for 15%
  score: number; // 0 to 100
  status: "exceptional" | "good" | "needs_work" | "critical";
  summary: string;
  checks: AuditCheck[];
}

export type FindingSeverity = "critical" | "high" | "medium" | "low" | "positive";

export interface Finding {
  id: string;
  category: "profile" | "repositories" | "code_quality" | "documentation" | "activity";
  severity: FindingSeverity;
  title: string;
  description: string;
  evidence: string;
  recommendation: string;
  affectedRepo?: string;
  affectedFile?: string;
  impactScore?: number;
}

export interface RepoAuditResult {
  name: string;
  fullName: string;
  description: string | null;
  primaryLanguage: string | null;
  stars: number;
  forks: number;
  isFork: boolean;
  isArchived: boolean;
  updatedAt: string;
  createdAt: string;
  defaultBranch: string;
  url: string;
  score: number;
  qualityStatus: "excellent" | "solid" | "needs_attention" | "poor";
  hasReadme: boolean;
  readmeLength?: number;
  hasLicense: boolean;
  hasTopics: boolean;
  hasDescription: boolean;
  hasCiCd: boolean;
  hasTests: boolean;
  hasGitignore: boolean;
  findings: Finding[];
}

export interface RoadmapTask {
  id: string;
  questNumber: number;
  title: string;
  description: string;
  category: "profile" | "repositories" | "code_quality" | "documentation" | "activity";
  priority: "critical" | "high" | "medium" | "low";
  estimatedEffort: "15 mins" | "30 mins" | "1-2 hours" | "Half day" | "Multi-day";
  xpReward: number;
  affectedRepo?: string;
  whyItMatters: string;
  actionSteps: string[];
  completed: boolean;
  verifiedByAudit?: boolean;
}

export interface OverallAuditReport {
  username: string;
  profile: GitHubUserProfile;
  overallScore: number; // 0 to 100
  grade: "S" | "A" | "B" | "C" | "D" | "F";
  gradeLabel: string;
  analyzedAt: string;
  categories: {
    profile: CategoryAuditResult;
    repositories: CategoryAuditResult;
    code_quality: CategoryAuditResult;
    documentation: CategoryAuditResult;
    activity: CategoryAuditResult;
  };
  strengths: Finding[];
  weaknesses: Finding[];
  repositories: RepoAuditResult[];
  roadmap: RoadmapTask[];
  aiAnalysis?: {
    summary: string;
    executiveTakeaway: string;
    developerArchetype: string;
    interviewReadiness: string;
    keyRecommendations: string[];
  };
}
