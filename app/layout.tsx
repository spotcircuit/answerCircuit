import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navigation from "@/components/layout/Navigation";
import type { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AnswerCircuit - Optimize Your Content",
  description: "Discover trending topics, manage FAQs, and optimize your content strategy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className="flex h-screen bg-gray-50">
            <Navigation />
            <div className="flex-1 overflow-auto">
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
