"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, Sparkles, Target, Award, ArrowRight, ShieldCheck, 
  Layers, ChevronRight, CheckCircle2, UserCheck, Terminal, 
  HelpCircle, ChevronDown, Check, X, RefreshCw, Star, ArrowUpRight, Code
} from "lucide-react";

export default function LandingPage() {
  // ATS Simulator States
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStep, setScanStep] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [atsScore, setAtsScore] = useState(0);

  // FAQ Accordion State
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Bullet Point Optimizer State (Bento Grid)
  const [hoveredBullet, setHoveredBullet] = useState(false);

  // Simulation Steps Timeline
  const simulationSteps = [
    { progress: 15, text: "Parsing resume layout and metadata..." },
    { progress: 40, text: "Identifying section headers and contact details..." },
    { progress: 65, text: "Running semantic matching on skills database..." },
    { progress: 85, text: "Comparing keywords with job description vector space..." },
    { progress: 100, text: "Generating Google Gemini AI improvement reports..." }
  ];

  const startSimulation = () => {
    setIsScanning(true);
    setScanProgress(0);
    setScanStep("Initializing scanner...");
    setShowResults(false);
    setAtsScore(0);
  };

  useEffect(() => {
    if (!isScanning) return;

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        const next = prev + 2;
        
        // Find current step text based on progress
        const currentStep = simulationSteps.find(step => next <= step.progress);
        if (currentStep) {
          setScanStep(currentStep.text);
        }

        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsScanning(false);
            setShowResults(true);
            // Animate score from 0 to 86
            let currentScore = 0;
            const scoreInterval = setInterval(() => {
              if (currentScore >= 86) {
                clearInterval(scoreInterval);
              } else {
                currentScore += 2;
                setAtsScore(currentScore);
              }
            }, 15);
          }, 800);
          return 100;
        }
        return next;
      });
    }, 45);

    return () => clearInterval(interval);
  }, [isScanning]);

  const faqs = [
    {
      question: "How does the ATS score matching work?",
      answer: "ResumeForge parses your uploaded PDF or Word document, breaks it down into standard sections, and runs a TF-IDF keyword match against standard industry schemas. When you match against a job description, we use semantic NLP vector similarities to identify missing skills and matching gaps."
    },
    {
      question: "Is my personal data secure on ResumeForge?",
      answer: "Yes, absolutely. We do not store or sell your personal data or resume contents to third parties. Uploaded files are temporarily parsed to generate your analysis report, and all details are tied securely to your encrypted JWT-authenticated user account."
    },
    {
      question: "What AI model powers the suggestions?",
      answer: "ResumeForge is integrated with Google Gemini AI models. It processes your specific resume sections and job descriptions in real-time to suggest structural revisions, stronger active verbs, and tailored cover letters."
    },
    {
      question: "Can I use ResumeForge for free?",
      answer: "Yes! Our core features—including ATS checks, keyword density scans, and basic AI resume edits—are completely free to use. Premium templates, full mock interview runs, and infinite custom roadmaps are available on our Pro plan."
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#020202] text-[#fafafa] overflow-x-hidden flex flex-col justify-between font-sans selection:bg-indigo-500/30">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-[60%] h-[40%] rounded-full bg-indigo-900/10 blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[40%] h-[40%] rounded-full bg-purple-900/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[50%] h-[30%] rounded-full bg-blue-900/5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-50 border-b border-zinc-900 bg-[#020202]/70 backdrop-blur-lg sticky top-0">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white text-sm shadow-md shadow-indigo-500/10 group-hover:scale-105 transition-all">
              RF
            </div>
            <span className="font-bold text-base text-white tracking-tight group-hover:text-zinc-200 transition-colors font-display">
              ResumeForge
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs text-zinc-400 font-semibold uppercase tracking-wider">
            <a href="#simulator" className="hover:text-white transition-colors">ATS Scanner</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#faqs" className="hover:text-white transition-colors">FAQs</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link 
              href="/register" 
              className="text-xs font-semibold uppercase tracking-wider bg-white hover:bg-zinc-200 text-black px-4.5 py-2.5 rounded-xl transition-all shadow-sm hover:shadow"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 max-w-7xl mx-auto px-6 z-10 text-center">
          <div className="space-y-8 max-w-4xl mx-auto">
            {/* Tagline Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Next-Gen MERN Stack & Gemini AI Integration</span>
            </motion.div>

            {/* Main Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05] font-display"
            >
              Transform Your Resume.<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                Unlock Your Next Career.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed"
            >
              An AI-powered candidate workspace. Parse structure checklists, identify missing technical keywords, draft custom revisions, and analyze ATS scores in real-time.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Link 
                href="/register" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold px-8 py-4 rounded-xl transition-all shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 group"
              >
                <span>Optimize My Resume Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a 
                href="#simulator" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 hover:text-white text-sm font-semibold px-8 py-4 rounded-xl transition-all"
              >
                <span>Try Live Simulator</span>
              </a>
            </motion.div>
          </div>
        </section>

        {/* Live ATS Scanner Simulator */}
        <section id="simulator" className="py-12 max-w-5xl mx-auto px-6 relative z-10 scroll-mt-20">
          <div className="text-center mb-8 space-y-2">
            <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Interactive Sandbox</h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Live ATS Scanner Simulator</h3>
            <p className="text-zinc-500 text-xs max-w-md mx-auto">Upload a mock file or click to run a simulated real-time ATS audit on a candidate resume.</p>
          </div>

          <div className="rounded-2xl border border-zinc-900 bg-zinc-950/30 p-4 sm:p-6 shadow-2xl glass-panel relative overflow-hidden">
            {/* Ambient glows inside mock */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 blur-[50px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 blur-[50px] pointer-events-none" />

            {/* Window header */}
            <div className="flex items-center justify-between pb-4 px-2 border-b border-zinc-900/80 mb-5">
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/20 border border-rose-500/30" />
                <span className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/30" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/30" />
              </div>
              <div className="text-zinc-500 text-3xs font-mono select-none flex items-center gap-1.5 bg-zinc-900/40 px-3 py-1 rounded-md border border-zinc-900/60">
                <Terminal className="w-3 h-3 text-indigo-400" />
                <span>ats-analyzer-sandbox.exe</span>
              </div>
              <div className="w-12 hidden sm:block" />
            </div>

            {/* Simulator Window Content */}
            <div className="min-h-[300px] flex flex-col justify-center items-center relative">
              <AnimatePresence mode="wait">
                {/* 1. Default State: Ready to Scan */}
                {!isScanning && !showResults && (
                  <motion.div 
                    key="ready"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-10 space-y-6 max-w-md"
                  >
                    <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400">
                      <FileText className="w-7 h-7" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-white text-base">Sample_Fullstack_Resume.pdf</h4>
                      <p className="text-zinc-500 text-xs">A simulated standard 2-page developer resume containing contact details, skill matrices, and project descriptions.</p>
                    </div>
                    <button
                      onClick={startSimulation}
                      className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-6 py-3 rounded-xl transition-all shadow-md shadow-indigo-600/10"
                    >
                      <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
                      <span>Start Scanning Simulation</span>
                    </button>
                  </motion.div>
                )}

                {/* 2. Scanning State */}
                {isScanning && (
                  <motion.div 
                    key="scanning"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full max-w-lg py-12 space-y-8"
                  >
                    <div className="space-y-3 text-center">
                      <h4 className="font-semibold text-white text-sm">Scanning & Parsing Resume Content...</h4>
                      <p className="text-zinc-500 text-3xs font-mono">{scanStep}</p>
                    </div>
                    
                    {/* Simulated scanning animation line */}
                    <div className="relative h-20 w-full bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden p-3 flex flex-col justify-center font-mono text-3xs text-zinc-500">
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-[0_0_12px_rgba(99,102,241,1)] animate-scan-beam" />
                      <div>{"{ \"name\": \"Devansh Agarwal\", \"skills\": [\"React\", \"Node.js\", \"Next.js\"] }"}</div>
                      <div className="opacity-40">{"{ \"experience\": \"Architected scalable systems...\", \"location\": \"Remote\" }"}</div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-3xs font-mono text-zinc-500">
                        <span>COMPLETION STATUS</span>
                        <span>{scanProgress}%</span>
                      </div>
                      <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full transition-all duration-300"
                          style={{ width: `${scanProgress}%` }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 3. Results State */}
                {showResults && (
                  <motion.div 
                    key="results"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="w-full space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                      
                      {/* Radial Progress Score */}
                      <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-900/60 text-center space-y-3 flex flex-col items-center">
                        <span className="text-3xs text-zinc-500 font-semibold uppercase tracking-wider">Overall ATS Score</span>
                        <div className="relative w-28 h-28 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" stroke="#18181b" strokeWidth="8" fill="transparent" />
                            <circle 
                              cx="50" 
                              cy="50" 
                              r="40" 
                              stroke="url(#gradient)" 
                              strokeWidth="8" 
                              fill="transparent" 
                              strokeDasharray={251.2}
                              strokeDashoffset={251.2 - (251.2 * atsScore) / 100}
                              className="transition-all duration-1000"
                            />
                            <defs>
                              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#6366f1" />
                                <stop offset="100%" stopColor="#a855f7" />
                              </linearGradient>
                            </defs>
                          </svg>
                          <div className="absolute text-center">
                            <span className="text-2xl font-bold text-white">{atsScore}</span>
                            <span className="text-zinc-500 text-3xs block font-semibold">/ 100</span>
                          </div>
                        </div>
                        <span className="text-3xs text-emerald-400 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Structure: Good</span>
                        </span>
                      </div>

                      {/* Keyword Analysis */}
                      <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-900/60 space-y-4 md:col-span-2">
                        <div className="space-y-1">
                          <h5 className="text-xs font-bold text-white">Keyword Comparison Results</h5>
                          <p className="text-zinc-500 text-3xs">We scanned your technical skills list against the target Fullstack Developer profile.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <span className="text-3xs text-emerald-400 font-semibold uppercase tracking-wider block">Found Keywords</span>
                            <div className="flex flex-wrap gap-1.5">
                              {["React", "Node.js", "MongoDB", "Express", "Next.js"].map((kw) => (
                                <span key={kw} className="text-3xs px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
                                  {kw}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <span className="text-3xs text-rose-400 font-semibold uppercase tracking-wider block">Missing Keywords (Gaps)</span>
                            <div className="flex flex-wrap gap-1.5">
                              {["Docker", "Redis", "CI/CD Pipeline", "TypeScript"].map((kw) => (
                                <span key={kw} className="text-3xs px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 font-medium">
                                  {kw}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Gemini Suggestion Alert */}
                    <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/15 flex items-start gap-3">
                      <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <span className="text-3xs text-indigo-400 font-bold uppercase tracking-wider">Gemini AI Revision Tip</span>
                        <p className="text-zinc-400 text-xs leading-relaxed">
                          "Your project bullet points are currently too generic. Add quantified achievements (e.g., 'Architected Next.js system, reducing load times by 42%') and explicitly declare TypeScript in your tech stacks to bridge key semantic matching gaps."
                        </p>
                      </div>
                    </div>

                    {/* Reset Button */}
                    <div className="text-center pt-2">
                      <button
                        onClick={startSimulation}
                        className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white text-3xs font-bold uppercase tracking-wider border border-zinc-800 hover:border-zinc-700 bg-zinc-900/30 hover:bg-zinc-900/60 px-4 py-2.5 rounded-xl transition-all"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Run Another Scan</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section id="features" className="py-24 border-t border-zinc-900 bg-zinc-950/20 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Built For Candidates</h2>
              <h3 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Supercharge Your Job Application Workflow
              </h3>
              <p className="text-zinc-500 text-xs sm:text-sm max-w-xl mx-auto font-light">
                ResumeForge combines fast structure analysis, semantic keyword scoring, and Gemini AI endpoints into a comprehensive workspace.
              </p>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Card 1: ATS Checker (Double width on desktop) */}
              <div className="lg:col-span-2 p-6 rounded-2xl border border-zinc-900 bg-zinc-950/40 glass-card flex flex-col justify-between space-y-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[40px] pointer-events-none" />
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Target className="w-5 h-5" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-lg font-bold text-white">Full-Scale ATS Checklists</h4>
                    <p className="text-zinc-400 text-xs leading-relaxed max-w-md">
                      Scan your resume files across structural parameters including layout constraints, section names, date ranges, and typography margins to ensure parsing systems read it flawlessly.
                    </p>
                  </div>
                </div>

                {/* Interactive checklist mockup */}
                <div className="bg-[#040404]/80 rounded-xl p-3 border border-zinc-900/60 space-y-2.5 font-mono text-3xs text-zinc-500">
                  <div className="flex items-center justify-between text-zinc-400 border-b border-zinc-900 pb-2">
                    <span className="font-semibold">STRUCTURE AUDIT</span>
                    <span className="text-emerald-400 font-bold">PASSING</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Section layout matches standard industry hierarchy (Experience, Education)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Contact information parsed successfully (Email, LinkedIn, Phone)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <X className="w-3.5 h-3.5 text-rose-500" />
                    <span className="text-zinc-400">No technical project metrics found (Recommended: Include numeric indicators)</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Before/After Bullet Optimizer (Standard size) */}
              <div 
                className="p-6 rounded-2xl border border-zinc-900 bg-zinc-950/40 glass-card flex flex-col justify-between space-y-6 cursor-pointer group"
                onMouseEnter={() => setHoveredBullet(true)}
                onMouseLeave={() => setHoveredBullet(false)}
                onClick={() => setHoveredBullet(!hoveredBullet)}
              >
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-lg font-bold text-white">Gemini Bullet Point Optimizer</h4>
                    <p className="text-zinc-400 text-xs leading-relaxed">
                      Tap/Hover to see how our Gemini AI rewrite system transforms boring responsibilities into impactful, metric-based achievements.
                    </p>
                  </div>
                </div>

                {/* Interactive Before/After toggle */}
                <div className="relative min-h-[90px] bg-[#040404]/80 rounded-xl p-3 border border-zinc-900/60 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {!hoveredBullet ? (
                      <motion.div 
                        key="before"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-1.5 w-full"
                      >
                        <span className="text-4xs text-zinc-500 font-bold uppercase tracking-wider block">Before (Weak)</span>
                        <p className="text-zinc-400 text-3xs font-mono leading-relaxed">"Responsible for building frontends and coding pages."</p>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="after"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-1.5 w-full"
                      >
                        <span className="text-4xs text-emerald-400 font-bold uppercase tracking-wider block">After (Gemini Optimized)</span>
                        <p className="text-zinc-200 text-3xs font-mono leading-relaxed font-medium">
                          "Architected 12+ React Next.js interfaces using TypeScript, decreasing client load times by 42%."
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Card 3: Similarity Matcher (Standard size) */}
              <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-950/40 glass-card flex flex-col justify-between space-y-6 group">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-lg font-bold text-white">Semantic Similarity Scan</h4>
                    <p className="text-zinc-400 text-xs leading-relaxed">
                      Compare your resume against specific job requirements using vector similarity metrics to find index ratings.
                    </p>
                  </div>
                </div>

                <div className="bg-[#040404]/80 rounded-xl p-3.5 border border-zinc-900/60 space-y-3 font-mono text-3xs">
                  <div className="flex justify-between items-center text-zinc-500">
                    <span>JOB DESC SIMILARITY</span>
                    <span className="text-indigo-400 font-bold font-sans text-2xs">74%</span>
                  </div>
                  <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                    <div className="w-[74%] h-full bg-indigo-500 group-hover:bg-indigo-400 transition-colors" />
                  </div>
                </div>
              </div>

              {/* Card 4: Cover Letter Writer (Double width on desktop) */}
              <div className="lg:col-span-2 p-6 rounded-2xl border border-zinc-900 bg-zinc-950/40 glass-card flex flex-col justify-between space-y-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-[40px] pointer-events-none" />
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <Code className="w-5 h-5" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-lg font-bold text-white">AI Cover Letter Drafter</h4>
                    <p className="text-zinc-400 text-xs leading-relaxed max-w-md">
                      Instantly draft highly tailored, company-specific cover letters mapping back to details inside your target role description.
                    </p>
                  </div>
                </div>

                <div className="bg-[#040404]/80 rounded-xl p-3 border border-zinc-900/60 font-mono text-3xs text-zinc-500 relative min-h-[90px] flex flex-col justify-between">
                  <div className="flex items-center justify-between text-zinc-400 border-b border-zinc-900 pb-1.5 mb-1.5">
                    <span>COVER_LETTER_DRAFT.TXT</span>
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping" />
                  </div>
                  <p className="leading-relaxed text-zinc-400 select-none">
                    "Dear Hiring Team, I am writing to express my strong interest in the Software Engineer position. Based on my Next.js and Node.js experience, I am confident in..."
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* FAQs Accordion */}
        <section id="faqs" className="py-24 max-w-4xl mx-auto px-6 relative z-10 scroll-mt-20">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Got Questions?</h2>
            <h3 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h3>
            <p className="text-zinc-500 text-xs max-w-sm mx-auto">Everything you need to know about the ResumeForge workspace analysis metrics.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div 
                  key={index} 
                  className="rounded-xl border border-zinc-900 bg-zinc-950/20 overflow-hidden transition-all duration-300 hover:border-zinc-800"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left font-semibold text-xs sm:text-sm text-white focus:outline-none"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform duration-300 ${isOpen ? "transform rotate-180 text-indigo-400" : ""}`} />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="px-5 pb-5 pt-0.5 text-xs text-zinc-400 leading-relaxed border-t border-zinc-900/50">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* Bottom CTA Panel */}
        <section className="py-20 relative max-w-5xl mx-auto px-6">
          <div className="rounded-3xl border border-zinc-900 bg-gradient-to-tr from-indigo-950/25 to-purple-950/15 p-8 sm:p-12 text-center space-y-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[#020202]/30 backdrop-blur-3xl -z-10" />
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto">
              <Award className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white font-display">Land Your Dream Job Today</h3>
              <p className="text-zinc-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                Unlock ATS scores, align missing technical keywords, draft Gemini revisions, and optimize your application flow.
              </p>
            </div>
            <div className="pt-2">
              <Link 
                href="/register" 
                className="inline-flex items-center gap-2 bg-white hover:bg-zinc-200 text-black text-xs font-bold px-8 py-3.5 rounded-xl transition-all shadow-md"
              >
                <span>Get Started For Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-[#020202] py-12 relative z-10 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">ResumeForge</span>
            <span>© 2026. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
