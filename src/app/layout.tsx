import type { Metadata } from "next";
import { Press_Start_2P, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import { ArcadeCursor } from "@/components/effects/ArcadeCursor";
import { SoundEffectsProvider } from "@/components/effects/SoundEffectsProvider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const pressStart2P = Press_Start_2P({
  weight: "400",
  variable: "--font-pixel",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-score",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DEV SCOPE — GitHub Auditor & Engineering Review",
  description:
    "AI-powered GitHub profile & repository auditor. Discover what's holding your profile back, level up your developer presence, and unlock actionable engineering roadmaps.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${pressStart2P.variable} ${inter.variable} ${spaceGrotesk.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-primary/30 selection:text-neon-cyan transition-colors duration-200">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <div className="scanlines fixed inset-0 z-50 pointer-events-none opacity-20 dark:opacity-20" />
          <ArcadeCursor />
          <SoundEffectsProvider>
            <Navbar />
            <main className="flex-1 flex flex-col relative z-10">{children}</main>
            <Footer />
          </SoundEffectsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
