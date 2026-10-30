import axios, { AxiosInstance } from "axios";
import { GitHubUserProfile, GitHubRepoItem } from "@/types/audit";

// In-memory cache with TTL (15 minutes)
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}
const cache = new Map<string, CacheEntry<unknown>>();
const CACHE_TTL_MS = 15 * 60 * 1000;

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCached<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

export class GitHubService {
  private client: AxiosInstance;

  constructor() {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "DevScope-GitHub-Auditor-v1",
    };

    const token = process.env.GITHUB_TOKEN;
    if (token && token.trim() !== "") {
      headers["Authorization"] = `Bearer ${token.trim()}`;
    }

    this.client = axios.create({
      baseURL: "https://api.github.com",
      headers,
      timeout: 12000,
    });
  }

  /**
   * Fetch public user profile
   */
  async getUserProfile(username: string): Promise<GitHubUserProfile> {
    const cleanUser = username.trim().toLowerCase();
    const cacheKey = `user:${cleanUser}`;
    const cached = getCached<GitHubUserProfile>(cacheKey);
    if (cached) return cached;

    try {
      const response = await this.client.get<GitHubUserProfile>(`/users/${encodeURIComponent(cleanUser)}`);
      setCached(cacheKey, response.data);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error(`GitHub user "${username}" was not found.`);
      }
      if (error.response?.status === 403) {
        const rateLimitReset = error.response.headers["x-ratelimit-reset"];
        const resetMinutes = rateLimitReset
          ? Math.ceil((Number(rateLimitReset) * 1000 - Date.now()) / 60000)
          : 60;
        throw new Error(
          `GitHub API rate limit reached. Please set a GITHUB_TOKEN or wait ${resetMinutes} minutes.`
        );
      }
      throw new Error(`Failed to fetch GitHub profile: ${error.message}`);
    }
  }

  /**
   * Fetch public repositories (up to 100 recent)
   */
  async getUserRepositories(username: string, maxCount: number = 30): Promise<GitHubRepoItem[]> {
    const cleanUser = username.trim().toLowerCase();
    const cacheKey = `repos:${cleanUser}`;
    const cached = getCached<GitHubRepoItem[]>(cacheKey);
    if (cached) return cached.slice(0, maxCount);

    try {
      const response = await this.client.get<GitHubRepoItem[]>(
        `/users/${encodeURIComponent(cleanUser)}/repos`,
        {
          params: {
            sort: "updated",
            direction: "desc",
            per_page: Math.min(100, Math.max(maxCount, 50)),
            type: "public",
          },
        }
      );
      setCached(cacheKey, response.data);
      return response.data.slice(0, maxCount);
    } catch (error: any) {
      if (error.response?.status === 404) {
        return [];
      }
      throw new Error(`Failed to fetch repositories for ${username}: ${error.message}`);
    }
  }

  /**
   * Check repository files structure (README, LICENSE, CI/CD workflows, configs)
   */
  async getRepositoryContents(owner: string, repo: string, path: string = ""): Promise<any[]> {
    const cacheKey = `contents:${owner}:${repo}:${path}`;
    const cached = getCached<any[]>(cacheKey);
    if (cached) return cached;

    try {
      const response = await this.client.get(
        `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${path}`
      );
      const data = Array.isArray(response.data) ? response.data : [response.data];
      setCached(cacheKey, data);
      return data;
    } catch {
      return [];
    }
  }

  /**
   * Fetch repository README text
   */
  async getRepositoryReadme(owner: string, repo: string): Promise<string | null> {
    const cacheKey = `readme:${owner}:${repo}`;
    const cached = getCached<string | null>(cacheKey);
    if (cached !== null) return cached;

    try {
      const response = await this.client.get(
        `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/readme`,
        {
          headers: { Accept: "application/vnd.github.v3.raw" },
          responseType: "text",
        }
      );
      const text = typeof response.data === "string" ? response.data : "";
      setCached(cacheKey, text);
      return text;
    } catch {
      setCached(cacheKey, null);
      return null;
    }
  }

  /**
   * Check for GitHub Actions workflows
   */
  async checkWorkflows(owner: string, repo: string): Promise<boolean> {
    const cacheKey = `workflows:${owner}:${repo}`;
    const cached = getCached<boolean>(cacheKey);
    if (cached !== null) return cached;

    try {
      const contents = await this.getRepositoryContents(owner, repo, ".github/workflows");
      const hasWorkflows = contents.length > 0;
      setCached(cacheKey, hasWorkflows);
      return hasWorkflows;
    } catch {
      setCached(cacheKey, false);
      return false;
    }
  }
}

export const gitHubService = new GitHubService();

