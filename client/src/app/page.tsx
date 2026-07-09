"use client";

// Vercel Deployment Trigger
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  FileText, Sparkles, Target, Award, ArrowRight, ShieldCheck, 
  Layers, ChevronRight, CheckCircle2, UserCheck, Terminal
} from "lucide-react";

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } }
  } as const;

  return (
    <div className="relative min-h-screen bg-[#030303] overflow-x-hidden flex flex-col justify-between">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/4 w-[50%] h-[50%] glow-blur-purple rounded-full opacity-30 pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[40%] h-[40%] glow-blur-blue rounded-full opacity-20 pointer-events-none" />

      {/* Header */}
      <header className="relative z-50 border-b border-zinc-900 bg-[#030303]/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white text-sm shadow-md">
              RF
            </div>
            <span className="font-bold text-lg text-white group-hover:text-zinc-200 transition-colors">
              ResumeForge
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-400 font-medium">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link 
              href="/register" 
              className="text-sm font-medium bg-white hover:bg-zinc-200 text-black px-4 py-2 rounded-lg transition-all shadow-sm hover:shadow"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="relative pt-20 pb-24 md:pt-32 md:pb-36 max-w-7xl mx-auto px-6 z-10 text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Tagline Badge */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-xs font-semibold uppercase tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Version 2.0 Released - MERN Architecture</span>
            </motion.div>

            {/* Main Title */}
            <motion.h1 variants={itemVariants} className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-[1.1] text-gradient">
              Your AI Career Assistant. <br className="hidden sm:inline" />
              <span className="text-gradient-purple">Unlock Your Ultimate Resume.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p variants={itemVariants} className="text-zinc-400 text-lg sm:text-xl max-w-3xl mx-auto font-light leading-relaxed">
              Upload your resume, analyze ATS compatibility, match job descriptions, identify missing skill keywords, and receive tailored AI suggestions to land your dream role.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link 
                href="/register" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 group"
              >
                <span>Upload Resume</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/login" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 glass-panel hover:bg-zinc-900/60 text-zinc-200 hover:text-white px-8 py-3.5 rounded-xl transition-all"
              >
                <span>Try Demo</span>
              </Link>
            </motion.div>

            {/* Dashboard Mock Preview */}
            <motion.div 
              variants={itemVariants}
              className="pt-16 max-w-5xl mx-auto"
            >
              <div className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-3 shadow-2xl glass-panel relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-purple-500/5 opacity-100 group-hover:opacity-80 transition-opacity" />
                {/* Simulated window header */}
                <div className="flex items-center justify-between pb-3 px-2 border-b border-zinc-900/60">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500/20 border border-rose-500/30" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/30" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/30" />
                  </div>
                  <div className="text-zinc-600 text-2xs font-mono select-none">localhost:3000/dashboard</div>
                  <div className="w-12" />
                </div>
                <div className="bg-[#030303] aspect-video w-full rounded-xl flex items-center justify-center relative overflow-hidden">
                  <div className="text-center space-y-4 px-6 relative z-10">
                    <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400">
                      <FileText className="w-8 h-8" />
                    </div>
                    <h3 className="font-semibold text-lg text-white">Dynamic ATS Ranking Panel</h3>
                    <p className="text-zinc-500 text-xs max-w-md mx-auto">
                      Scan structure checklists, locate matching/missing technical keywords, write AI cover letters, and track progress stats.
                    </p>
                  </div>
                  {/* Subtle Grid backdrop */}
                  <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section id="features" className="border-t border-zinc-900 bg-zinc-950/20 py-24 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Supercharged Job Search Features
              </h2>
              <p className="text-zinc-500 text-base max-w-2xl mx-auto font-light">
                ResumeForge combines fast text calculations and Google Gemini completions to deliver a complete candidate workspace.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-8 rounded-2xl border border-zinc-900 bg-zinc-950/40 glass-card space-y-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-white">ATS Compatibility Score</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Evaluate keyword densities, sections layout, structural lengths, and contact listings to secure an overall score out of 100.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-8 rounded-2xl border border-zinc-900 bg-zinc-950/40 glass-card space-y-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-white">Gemini Profile Optimizer</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Refine career experience descriptions, optimize projects bullets using powerful action verbs, and generate structured career summaries.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-8 rounded-2xl border border-zinc-900 bg-zinc-950/40 glass-card space-y-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-white">Job Matching Engine</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Compare skills between resumes and specific job requirements using vector cosine similarities to locate missing credentials.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-[#030303] py-12 relative z-10 text-center text-xs text-zinc-600">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-400">ResumeForge</span>
            <span>© 2026. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-zinc-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
