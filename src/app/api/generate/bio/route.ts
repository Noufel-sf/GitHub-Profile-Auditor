import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, languages, strengths } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && apiKey.trim().length > 0) {
      try {
        const prompt = `
Generate 3 distinct, professional GitHub profile bios for developer @${username || "developer"}.
Primary Stacks: ${(languages || ["TypeScript", "React"]).join(", ")}
Key Strengths: ${(strengths || ["clean architecture", "open source"]).join(", ")}

Return ONLY valid JSON with an array named "bios":
{
  "bios": [
    { "style": "Recruiter-Focused", "text": "1-2 punchy sentences with keywords and impact." },
    { "style": "Open-Source Contributor", "text": "Focus on passion for shipping tools and collaboration." },
    { "style": "Retro Arcade Developer", "text": "A creative, fun developer elevator pitch." }
  ]
}
`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { responseMimeType: "application/json" },
            }),
          }
        );

        if (response.ok) {
          const json = await response.json();
          const raw = json.candidates?.[0]?.content?.parts?.[0]?.text;
          if (raw) {
            const parsed = JSON.parse(raw);
            return NextResponse.json(parsed);
          }
        }
      } catch (err) {
        console.warn("AI bio fallback:", err);
      }
    }

    // High quality deterministic fallback
    const fallback = {
      bios: [
        {
          style: "Recruiter-Focused",
          text: `Software Engineer specializing in ${(languages || ["TypeScript", "Next.js"]).slice(0, 2).join(" & ")}. Passionate about building scalable, production-grade web systems.`,
        },
        {
          style: "Open-Source Contributor",
          text: `Building developer tools and open-source software with ${(languages || ["TypeScript"]).slice(0, 2).join(", ")}. Always learning, always shipping.`,
        },
        {
          style: "Retro Arcade Developer",
          text: `Leveling up codebases one commit at a time. Full-stack builder focused on clean architecture & high-performance applications.`,
        },
      ],
    };

    return NextResponse.json(fallback);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to generate bios" },
      { status: 500 }
    );
  }
}

