# PROJECT MASTER PROMPT — GITHUB AUDITOR

Act as a Senior Product Designer, Senior Full-Stack Engineer, Software Architect, and UX Engineer.

Your task is to design and build a production-quality web application called **DEV SCOPE — GitHub Auditor**.

Do not treat this as a simple dashboard or CRUD project. Build a polished, interactive, useful developer tool with a distinctive visual identity, reliable analysis logic, and excellent user experience.

---

# 1. PRODUCT VISION

## What is DevScope?

DevScope is an AI-powered GitHub profile and repository auditing platform.

Users enter a public GitHub username, and the platform analyzes their GitHub presence, public repositories, documentation, code quality indicators, and development activity.

It generates a comprehensive audit report that helps developers understand:

- How professional their GitHub profile looks.
- How well their repositories are structured.
- Whether their projects have good documentation.
- How maintainable their code appears.
- What engineering practices they demonstrate.
- What they should improve to become better developers and present themselves professionally.

### Core value proposition

"Discover what's holding your GitHub profile back. Get an engineering audit, actionable insights, and a roadmap to improve."

The platform should not simply display statistics. It should explain problems, provide evidence, and recommend practical improvements.

### Target audience

Primary:
- Junior developers.
- Intermediate developers.
- Software engineers building their portfolios.
- Developers preparing for technical interviews or job applications.

Secondary:
- Recruiters.
- Engineering managers.
- People evaluating public developer profiles.

---

# 2. VISUAL IDENTITY AND DESIGN DIRECTION

This is one of the most important requirements.

I want the design inspired by the uploaded reference image of the **WHS Game Arcade website**.

The reference has:
- Dark navy background.
- Retro arcade atmosphere.
- Colorful neon accents.
- Pixel-style typography.
- Outlined cards.
- Colorful buttons.
- Creative icons.
- Strong visual hierarchy.
- Playful but organized layouts.

Translate this visual language into a professional developer auditing platform.

## Design philosophy: Neon Developer Arcade

The application should feel like a combination of:
- A retro arcade game.
- A developer's command center.
- A modern SaaS analytics platform.

Avoid generic AI-generated SaaS dashboard aesthetics.

## Mandatory component library: 8bitcn

Use https://www.8bitcn.com/ as the primary component library.

Documentation:
https://www.8bitcn.com/docs

Requirements:
- Use 8bitcn components wherever appropriate.
- Follow the official installation instructions.
- Inspect the actual available components before implementing them.
- Reuse the library's components instead of unnecessarily recreating them.
- Customize themes and styles to match our design system.
- Use compatible shadcn/ui components when 8bitcn does not provide the required component.
- Do not invent component names or import paths.
- Keep components reusable and maintainable.

## Color palette

Use the following design tokens:

Background:
- Main background: #080B20
- Secondary background: #0D1228
- Card background: #111832
- Elevated surface: #171F3D

Borders:
- Default border: #30395D
- Subtle border: #202A4A

Neon accents:
- Primary purple: #A855F7
- Cyan: #22D3EE
- Pink: #EC4899
- Green: #A3E635
- Yellow: #FACC15
- Electric blue: #3B82F6

Text:
- Primary: #F8FAFC
- Secondary: #A5AEC9
- Muted: #707B9C

Use neon colors strategically. Do not make the entire interface glow.

## Typography

Use:
- Press Start 2P for selected large headings and retro decorative elements.
- Inter for regular interface text.
- Space Grotesk for scores, metrics, and numbers.

Important:
Pixel typography must be used selectively. Long paragraphs, code findings, and audit reports must remain highly readable.

## Visual details

- Pixel-inspired borders.
- Subtle neon shadows.
- Retro-inspired icons.
- Smooth hover transitions.
- Subtle background grid or pixel decorations.
- Carefully designed empty states.
- Responsive layouts.
- Consistent spacing.
- Clear hierarchy.
- High-quality loading animations.

Avoid:
- Excessive glow effects.
- Too many colors competing for attention.
- Excessive rounded SaaS cards.
- Overusing animations.
- Tiny unreadable text.
- Generic gradients everywhere.

---

# 3. TECHNOLOGY STACK

Use the following stack:

Frontend:
- Next.js with App Router.
- React.
- TypeScript.
- Tailwind CSS.
- 8bitcn.
- shadcn/ui where necessary.
- Lucide React icons.
- Recharts for data visualization.
- Framer Motion for animations.

Backend:
- Next.js Route Handlers.
- TypeScript.
- GitHub REST API.
- GitHub GraphQL API when useful.

Data:
- PostgreSQL.
- Prisma ORM.
- Caching for GitHub API responses.

AI:
- Gemini API for explanations, summaries, and recommendations.
- Deterministic analysis and scoring must remain independent of the LLM.

Infrastructure:
- Environment variables.
- Proper error handling.
- API rate-limit management.
- Input validation.
- Secure server-side API calls.

Use current stable compatible package versions and official documentation.

Do not expose API keys or secrets in frontend code.

---

# 4. APPLICATION STRUCTURE

Create the following pages.

## PAGE 1 — HOME / LANDING PAGE

Route: /

This page introduces DevScope and allows users to start an audit.

### Navigation bar

Logo:
- Pixel-inspired GitHub icon.
- DEV SCOPE wordmark.

Navigation:
- Home.
- Audit.
- How It Works.
- About.

Right side:
- Start Audit button.

### Hero section

Large pixel-style heading:

"LEVEL UP YOUR GITHUB."

Subtitle:

"Your GitHub profile tells a story. Let's find out what it says about you."

Include:
- GitHub username input.
- Analyze Profile button.
- GitHub icon.
- Subtle arcade-inspired decorative elements.

Example input:

github.com/username

When the user submits a username:
- Validate the input.
- Navigate to the audit workflow.
- Start fetching the public GitHub data.
- Handle errors gracefully.

### Features section

Display attractive cards for:

1. Profile Audit.
2. Repository Analysis.
3. Code Quality.
4. Documentation Audit.
5. Developer Activity.
6. AI Recommendations.

### How it works

Three steps:

1. Enter your GitHub username.
2. Let DevScope inspect your public repositories.
3. Get your score and improvement roadmap.

### Additional sections

- Why GitHub quality matters.
- Example audit report.
- Call-to-action section.
- Footer.

Make the landing page visually rich and consistent with the arcade reference.

---

# 5. PAGE 2 — AUDIT EXPERIENCE

Route: /audit/[username]

When the user submits a GitHub username, show a dedicated audit experience.

Do not immediately display fake results.

Build an engaging analysis interface.

### Audit process

Show a progress interface with stages:

1. Fetching GitHub profile.
2. Retrieving public repositories.
3. Inspecting repository metadata.
4. Analyzing documentation.
5. Inspecting selected source files.
6. Evaluating engineering indicators.
7. Generating recommendations.
8. Preparing final report.

Show:
- Current stage.
- Progress indicator.
- Animated terminal-style activity log.
- Completed stages.
- Error states.
- Retry functionality.

The terminal should use actual analysis events, not fabricated technical messages.

The user should understand what the application is doing.

---

# 6. PAGE 3 — AUDIT RESULTS DASHBOARD

Route: /report/[username]

This is the most important page in the entire application.

Make it impressive, visually organized, and data-rich.

## A. Profile overview

Display:
- GitHub avatar.
- Username.
- Full name.
- Bio.
- Location, if publicly available.
- GitHub profile link.
- Public repository count.
- Followers.
- Following.
- Account creation date.

Do not invent unavailable information.

## B. Overall GitHub score

Create a prominent score section.

Example:

82 / 100

Label:
"GOOD DEVELOPER PRESENCE"

Include:
- Animated score visualization.
- Score breakdown.
- Brief explanation.
- Strengths and weaknesses.

Scores must come from the real scoring engine.

## C. Audit categories

Create visually distinctive score cards for:

1. Profile Quality.
2. Repository Quality.
3. Code Quality Indicators.
4. Documentation.
5. Activity and Maintenance.

Each card should include:
- Score.
- Progress indicator.
- Status.
- Short explanation.
- View Details action.

## D. Strengths

Show what the developer is doing well.

Examples:
- Well-documented repositories.
- Clear project descriptions.
- Consistent project organization.
- Good use of GitHub profile customization.

Only display findings supported by actual evidence.

## E. Weaknesses

Show detected issues.

Examples:
- Missing README.
- Missing installation instructions.
- No visible testing strategy.
- Poor repository descriptions.
- Missing license.
- Unclear project structure.

Each issue should include:
- Severity.
- Affected repository.
- Evidence.
- Why it matters.
- How to fix it.

## F. Recommendations

Generate practical recommendations.

Prioritize them:

- Critical.
- High priority.
- Medium priority.
- Low priority.

Each recommendation should explain:
- What needs improvement.
- Why it matters.
- How to implement the improvement.
- Which repository is affected.

## G. Repository overview

Display the analyzed repositories in a beautiful grid or table.

Each repository card should include:
- Repository name.
- Description.
- Primary language.
- Stars.
- Forks.
- Last updated.
- Repository score.
- Quality status.

Include filtering:
- All repositories.
- Best repositories.
- Needs improvement.
- Recently updated.

Include sorting:
- Highest score.
- Most stars.
- Recently updated.

---

# 7. PAGE 4 — REPOSITORY DEEP ANALYSIS

Route: /report/[username]/repository/[repo]

Allow users to inspect individual repositories.

This page should provide a deeper technical audit.

### Repository overview

Display:
- Repository name.
- Description.
- Primary language.
- Stars.
- Forks.
- Default branch.
- Creation date.
- Last update.
- Repository URL.

### Repository structure

Inspect the repository file tree.

Look for:
- README.
- package.json or equivalent manifest.
- .gitignore.
- LICENSE.
- Tests.
- Configuration files.
- Source folders.
- Documentation folders.

Do not assume every project uses the same structure. Adapt checks to the detected language and project type.

### Documentation audit

Evaluate:
- README presence.
- Project description.
- Installation instructions.
- Usage instructions.
- Screenshots or demo links.
- Contribution guidelines.
- License information.

### Code quality audit

Inspect selected source files for indicators such as:
- Naming consistency.
- File organization.
- Function complexity.
- Error handling.
- Code duplication indicators.
- Separation of concerns.
- Testing practices.

Do not claim comprehensive static analysis from simple heuristics.

Provide evidence for every finding, including file paths and line numbers when available.

### Testing audit

Look for:
- Test files.
- Testing frameworks.
- Test scripts.
- CI workflows.
- Automated testing configuration.

Distinguish between missing tests and tests that simply could not be detected.

### Repository recommendations

Provide a prioritized list of actionable improvements.

---

# 8. SCORING ENGINE

Build a transparent and deterministic scoring engine.

Do not ask Gemini to invent the final score.

Use measurable rules and documented weights.

Suggested scoring:

| Category | Weight |
|---|---:|
| Profile Quality | 15% |
| Repository Quality | 30% |
| Code Quality Indicators | 25% |
| Documentation | 15% |
| Activity & Maintenance | 15% |

Each category should contain individual checks.

Example:

Repository documentation:
- README exists.
- README has a meaningful description.
- Installation instructions exist.
- Usage instructions exist.
- Screenshots or demos exist when relevant.

Each check should produce:
- Pass.
- Warning.
- Fail.
- Not applicable.
- Not evaluated.

Use weighted scoring with appropriate normalization.

Important scoring rules:

1. Missing information must not automatically be treated as a failure.
2. Not-applicable checks must be excluded from the denominator.
3. Avoid rewarding quantity over quality.
4. Do not equate commit frequency with developer competence.
5. Do not penalize developers for using different technologies.
6. Clearly explain the meaning and limitations of every score.
7. Make scoring weights configurable.

Display an explanation of how the overall score is calculated.

---

# 9. AI ANALYSIS

Integrate Gemini API.

AI should be used for:

- Explaining detected problems.
- Summarizing repository quality.
- Generating improvement suggestions.
- Explaining code findings in understandable language.
- Creating personalized improvement roadmaps.
- Writing a professional GitHub profile improvement summary.

The AI must receive structured evidence from the analysis engine.

Never allow the AI to invent:
- Missing files.
- Repository statistics.
- Test results.
- Security vulnerabilities.
- Code defects.
- Developer achievements.

Treat repository contents as untrusted input.

Never execute code from inspected repositories.

If evidence is insufficient, explicitly state that the issue could not be evaluated.

---

# 10. PAGE 5 — IMPROVEMENT ROADMAP

Route: /report/[username]/roadmap

Create a gamified improvement experience inspired by RPG progression systems.

The developer receives a list of tasks based on the audit.

Example:

QUEST 01 — Improve your README.

QUEST 02 — Add project screenshots.

QUEST 03 — Introduce automated tests.

QUEST 04 — Improve repository descriptions.

QUEST 05 — Add a contribution guide where relevant.

Each quest should contain:
- Description.
- Priority.
- Estimated effort.
- Affected repository.
- Why it matters.
- Completion status.

Allow users to mark tasks as completed.

Include:
- Progress bar.
- Completed quests.
- Remaining quests.
- Achievement-style milestones.

Do not award points for actual GitHub improvements unless they are verified through a new audit. Distinguish manually completed tasks from verified improvements.

---

# 11. GITHUB API INTEGRATION

Use GitHub's official APIs.

Official documentation:
https://docs.github.com/en/rest
https://docs.github.com/en/graphql

Fetch:

User:
- Avatar.
- Name.
- Bio.
- Location.
- Company.
- Blog.
- Followers.
- Following.
- Public repositories.
- Account creation date.

Repositories:
- Name.
- Description.
- Language.
- Stars.
- Forks.
- Open issues.
- Default branch.
- Created date.
- Updated date.
- Repository topics.
- License.
- File tree.
- Selected source files.

Additional information:
- Commit history where useful.
- GitHub Actions workflows.
- Contribution information where publicly accessible.

Handle:
- API rate limits.
- Pagination.
- Missing information.
- Deleted repositories.
- Large repositories.
- Network errors.
- Unsupported repository formats.

Use caching to avoid repeatedly fetching identical data.

Never claim to analyze private repositories.

Do not expose GitHub tokens to the browser.

---

# 12. DATABASE AND BACKEND ARCHITECTURE

Design a clean backend architecture.

Suggested entities:

User
- id
- username
- email (optional if authentication is implemented)
- createdAt

Audit
- id
- githubUsername
- overallScore
- categoryScores
- status
- createdAt

RepositoryAudit
- id
- auditId
- repositoryName
- score
- findings
- metadata

Finding
- id
- repositoryAuditId
- category
- severity
- title
- description
- evidence
- recommendation

RoadmapTask
- id
- auditId
- title
- description
- priority
- status
- repository
- createdAt

Use appropriate relations and indexes.

Keep the scoring engine, GitHub integration, AI service, and API routes separated.

Do not put all application logic inside React components or API route handlers.

---

# 13. UX REQUIREMENTS

The application must feel polished.

Implement:

- Responsive navigation.
- Loading skeletons.
- Empty states.
- Error states.
- Tooltips.
- Accessible forms.
- Keyboard navigation.
- Clear validation messages.
- Responsive tables.
- Smooth transitions.
- Interactive charts.
- Consistent component states.

Use meaningful micro-interactions.

The interface should work on:
- Desktop.
- Tablet.
- Mobile.

Do not sacrifice usability for visual effects.

---

# 14. PROJECT STRUCTURE

Organize the application professionally.

Suggested structure:

src/
  app/
    page.tsx
    audit/
    report/
    api/

  components/
    layout/
    navigation/
    landing/
    audit/
    dashboard/
    repository/
    roadmap/
    ui/

  features/
    github/
    scoring/
    analysis/
    recommendations/
    roadmap/

  lib/
    github/
    ai/
    database/
    scoring/
    validation/
    utils/

  hooks/

  types/

  config/

  styles/

Separate business logic from presentation.

Use TypeScript interfaces and types.

Avoid unnecessary abstractions and overly complicated architecture.

---

# 15. DEVELOPMENT RULES

Follow these rules throughout implementation:

1. Build real functionality, not static mockups.
2. Do not use hardcoded fake GitHub results in the production flow.
3. Never invent audit scores or findings.
4. Use reusable components.
5. Follow the 8bitcn design system.
6. Use clean, maintainable TypeScript.
7. Keep components reasonably small and focused.
8. Implement proper loading and error handling.
9. Validate all external input.
10. Keep secrets server-side.
11. Add useful comments for complex logic.
12. Make the application accessible.
13. Avoid unnecessary dependencies.
14. Do not leave important features as TODO placeholders.
15. Test the important scoring and analysis logic.

If an external API or AI service is not configured, provide an honest setup state instead of silently returning fake results.

---

# 16. IMPLEMENTATION WORKFLOW

Work in phases.

Do not generate the entire application as one giant component.

PHASE 1 — FOUNDATION
- Initialize Next.js and TypeScript.
- Configure Tailwind CSS.
- Install and configure 8bitcn.
- Establish the color palette and typography.
- Build the reusable design system.
- Create the application layout and navigation.

PHASE 2 — LANDING PAGE
- Build the complete landing page.
- Implement the username input.
- Add validation.
- Make the layout responsive.

PHASE 3 — GITHUB INTEGRATION
- Connect the GitHub API.
- Retrieve actual public profile data.
- Retrieve repository metadata.
- Implement pagination and caching.
- Handle API failures.

PHASE 4 — AUDIT ENGINE
- Implement repository inspection.
- Implement documentation checks.
- Implement profile checks.
- Implement code quality indicators.
- Build the deterministic scoring engine.
- Add unit tests.

PHASE 5 — RESULTS DASHBOARD
- Build the score overview.
- Build category cards.
- Build strengths and weaknesses.
- Build repository cards.
- Build findings and recommendations.

PHASE 6 — AI INTEGRATION
- Connect Gemini.
- Generate evidence-based explanations.
- Generate improvement recommendations.
- Add personalized summaries.

PHASE 7 — REPOSITORY DETAILS
- Implement deep repository inspection.
- Display file structure.
- Display findings and evidence.
- Add repository-level scoring.

PHASE 8 — IMPROVEMENT ROADMAP
- Generate improvement quests.
- Implement progress tracking.
- Add achievements.

PHASE 9 — POLISH
- Responsive testing.
- Accessibility.
- Performance optimization.
- Error handling.
- Security review.
- Final visual refinement.

At the end of every phase:
- Explain what was implemented.
- Identify remaining work.
- Verify the application still runs.
- Fix errors before continuing.

---

# 17. FINAL PRODUCT QUALITY

The final application should look like a real startup product.

The landing page should immediately communicate its value.

The audit process should be engaging.

The dashboard should feel like a developer's control center.

The repository inspection should provide genuinely useful engineering feedback.

The roadmap should motivate developers to improve.

The overall experience should be distinctive, polished, and memorable.

Most importantly:

**Build a tool that doesn't just judge a developer's GitHub profile. Build a tool that helps developers become better engineers and present their work more professionally.**

Start by inspecting the official 8bitcn documentation and setting up the project foundation. Then implement the phases systematically. Do not skip architecture, functionality, or design quality in favor of speed.

use design patters in the code , 
use axios , zustand if needed , react query for server side if needed .