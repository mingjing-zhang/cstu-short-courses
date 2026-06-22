import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Catalyst · Short AI Courses",
  description:
    "Live, short-format AI courses for founders, marketers, and curious beginners. A CSTU capstone demo.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="paper-grain min-h-screen">{children}</body>
    </html>
  );
}
