import type { Metadata } from "next";
import { Inter, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const notoBengali = Noto_Sans_Bengali({
  variable: "--font-bengali",
  subsets: ["bengali"],
  weight: ["400", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Smriti-NER (স্মৃতি) — AI Cognitive Wellness Platform",
  description:
    "AI-Enabled Cognitive Gaming & Memory Assistance Platform for Elderly Dementia Patients in the North Eastern Region. SIH 2026 — PS ID 26003 — MDoNER.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${notoBengali.variable}`}>
      <body>{children}</body>
    </html>
  );
}
