import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { repo, owner, description, language, hasLicense } = body;

    if (!repo) {
      return NextResponse.json({ error: "Repository name is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && apiKey.trim().length > 0) {
      try {
        const prompt = `
Generate a clean, high-impact, professional GitHub README.md for a project called "${repo}".
Owner: @${owner || "developer"}
Description: ${description || "A modern software application."}
Primary Stack: ${language || "TypeScript"}
License: ${hasLicense ? "MIT" : "Open Source"}

Requirements:
- Project title & catchy elevator pitch
- Key Features list
- Badges (license, build, stack)
- Quickstart / Installation commands
- Architecture & Project Structure
- Usage example code block
- Contributing guide
Return ONLY markdown content without additional commentary.
`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
            }),
          }
        );

        if (response.ok) {
          const json = await response.json();
          const generated = json.candidates?.[0]?.content?.parts?.[0]?.text;
          if (generated) {
            return NextResponse.json({ markdown: generated.trim() });
          }
        }
      } catch (err) {
        console.warn("AI generation fallback:", err);
      }
    }

    // High quality deterministic fallback template
    const fallbackMarkdown = `
# ${repo}

> ${description || "A modern software solution engineered for performance and scalability."}

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Stack](https://img.shields.io/badge/Stack-${encodeURIComponent(language || "TypeScript")}-blue.svg)](#)
[![Built with Care](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](#)

---

## ⚡ Overview

**${repo}** provides a clean, robust architecture designed to solve core workflows efficiently. Built by [@${owner || "developer"}](https://github.com/${owner || "developer"}).

## ✨ Key Features

- **Modular Architecture**: Well-structured source files designed for separation of concerns.
- **Type-Safe Implementation**: Built with modern engineering patterns.
- **Developer-First**: Simple configuration and clear local development workflows.

## 🚀 Quick Start

### Prerequisites

Ensure you have your runtime environment installed:
\`\`\`bash
node -v # Recommended: Node 20+
\`\`\`

### Installation

\`\`\`bash
# 1. Clone the repository
git clone https://github.com/${owner || "developer"}/${repo}.git

# 2. Enter directory
cd ${repo}

# 3. Install dependencies
npm install # or pnpm install

# 4. Start development server
npm run dev
\`\`\`

## 📁 Project Structure

\`\`\`text
${repo}/
├── src/           # Core source code
├── tests/         # Automated unit & integration tests
├── .gitignore     # Git ignore rules
├── package.json   # Project dependencies
└── README.md      # Documentation
\`\`\`

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/${owner || "developer"}/${repo}/issues).

## 📄 License

Distributed under the MIT License.
    `.trim();

    return NextResponse.json({ markdown: fallbackMarkdown });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to generate README" },
      { status: 500 }
    );
  }
}
