"use client";

import { useState } from "react";
import { Sparkles, Copy, Check, X, FileText, UserCheck, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/8bit/button";
import { arcadeAudio } from "@/lib/sound/audio";

interface AiGeneratorModalProps {
  type: "readme" | "bio";
  isOpen: boolean;
  onClose: () => void;
  repoData?: {
    repo: string;
    owner: string;
    description: string | null;
    language: string | null;
    hasLicense: boolean;
  };
  userData?: {
    username: string;
    languages: string[];
    strengths: string[];
  };
}

export function AiGeneratorModal({
  type,
  isOpen,
  onClose,
  repoData,
  userData,
}: AiGeneratorModalProps) {
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [generatedReadme, setGeneratedReadme] = useState<string | null>(null);
  const [generatedBios, setGeneratedBios] = useState<Array<{ style: string; text: string }> | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    arcadeAudio.playClick();
    setLoading(true);
    setCopiedIndex(null);

    try {
      if (type === "readme") {
        const res = await fetch("/api/generate/readme", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(repoData || {}),
        });
        const data = await res.json();
        setGeneratedReadme(data.markdown || "Failed to generate README.");
      } else {
        const res = await fetch("/api/generate/bio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData || {}),
        });
        const data = await res.json();
        setGeneratedBios(data.bios || []);
      }
    } catch {
      // error handled gracefully
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    arcadeAudio.playClick();
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-card border-2 border-border p-6 shadow-[0_0_35px_rgba(168,85,247,0.2)] font-mono max-h-[85vh] flex flex-col justify-between">
        {/* Pixel Corners */}
        <div className="absolute -top-1 -left-1 w-2 h-2 bg-neon-cyan" />
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-neon-pink" />
        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-neon-green" />
        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-neon-yellow" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="font-['Press_Start_2P'] text-xs text-foreground">
              {type === "readme" ? "AI README GENERATOR" : "AI PROFILE BIO GENERATOR"}
            </h3>
          </div>
          <button
            onClick={() => {
              arcadeAudio.playClick();
              onClose();
            }}
            className="p-1 text-muted-foreground hover:text-neon-pink cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto space-y-4 my-2 pr-1">
          {type === "readme" ? (
            <div>
              <p className="text-xs text-muted-foreground mb-4">
                Generate an architectural, production-ready <code className="text-neon-cyan">README.md</code> for{" "}
                <strong className="text-foreground">{repoData?.repo}</strong>.
              </p>

              {!generatedReadme && !loading && (
                <div className="p-8 text-center bg-secondary border border-border space-y-4">
                  <FileText className="w-10 h-10 text-neon-cyan mx-auto opacity-70" />
                  <p className="text-xs text-muted-foreground">
                    Click below to generate a tailored README with quickstart guides, architecture specs, and badges.
                  </p>
                  <Button
                    onClick={handleGenerate}
                    className="bg-neon-cyan text-black hover:bg-neon-cyan/80 font-bold text-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 mr-1" /> Generate README.md
                  </Button>
                </div>
              )}

              {loading && (
                <div className="p-12 text-center bg-secondary border border-border space-y-3">
                  <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto" />
                  <p className="text-xs text-neon-cyan">Synthesizing technical documentation...</p>
                </div>
              )}

              {generatedReadme && !loading && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neon-green font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Generated Documentation Ready
                    </span>
                    <Button
                      size="sm"
                      onClick={() => handleCopy(generatedReadme, 0)}
                      className="bg-neon-green text-black hover:bg-neon-green/80 font-bold text-xs"
                    >
                      {copiedIndex === 0 ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                      {copiedIndex === 0 ? "Copied!" : "Copy Markdown"}
                    </Button>
                  </div>
                  <pre className="p-4 bg-background border border-border text-[11px] text-muted-foreground overflow-x-auto max-h-80 whitespace-pre-wrap select-all font-mono">
                    {generatedReadme}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div>
              <p className="text-xs text-muted-foreground mb-4">
                Generate 3 high-impact bios tailored for technical recruiters and open-source teams.
              </p>

              {!generatedBios && !loading && (
                <div className="p-8 text-center bg-secondary border border-border space-y-4">
                  <UserCheck className="w-10 h-10 text-primary mx-auto opacity-70" />
                  <p className="text-xs text-muted-foreground">
                    Analyze your audited tech stack and generate high-conversion elevator pitches.
                  </p>
                  <Button
                    onClick={handleGenerate}
                    className="bg-primary text-white hover:bg-primary/90 font-bold text-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 mr-1" /> Generate Bio Suggestions
                  </Button>
                </div>
              )}

              {loading && (
                <div className="p-12 text-center bg-secondary border border-border space-y-3">
                  <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto" />
                  <p className="text-xs text-neon-cyan">Crafting developer elevator pitches...</p>
                </div>
              )}

              {generatedBios && !loading && (
                <div className="space-y-3">
                  {generatedBios.map((bio, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-secondary border border-border space-y-2 hover:border-neon-cyan transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-muted text-neon-cyan border border-border">
                          {bio.style}
                        </span>
                        <Button
                          size="sm"
                          onClick={() => handleCopy(bio.text, idx)}
                          className="bg-card border border-border hover:border-neon-cyan text-foreground text-[10px] py-1 px-2"
                        >
                          {copiedIndex === idx ? (
                            <span className="text-neon-green flex items-center gap-1">
                              <Check className="w-3 h-3" /> Copied
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <Copy className="w-3 h-3" /> Copy
                            </span>
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-foreground leading-relaxed">
                        "{bio.text}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>Gemini-Powered Technical Synthesis</span>
          <Button
            size="sm"
            variant="outline"
            onClick={onClose}
            className="bg-card text-muted-foreground border-border text-xs"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

