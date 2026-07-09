import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans" 
});

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: "--font-display" 
});

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
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans min-h-full bg-[#030303] text-[#fafafa] flex flex-col antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

