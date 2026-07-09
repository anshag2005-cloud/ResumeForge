import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ResumeForge - AI-Powered Resume Builder & ATS Optimizer",
  description: "Transform your resume, optimize ATS score, match job descriptions, and write cover letters with generative AI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-[#030303]">
      <body className={`${inter.className} min-h-full bg-[#030303] text-[#fafafa] flex flex-col antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
