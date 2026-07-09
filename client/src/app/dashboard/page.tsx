"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { 
  FileText, Target, Wrench, ChevronRight, 
  ArrowUpRight, Clock, Star, Play
} from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    resumes: 0,
    avgAts: 0,
    matches: 0,
    letters: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentResumes, setRecentResumes] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resumes, matches, letters] = await Promise.all([
          api.getResumes(),
          api.getMatchHistory(),
          api.getCoverLetters()
        ]);
        
        setRecentResumes(resumes.slice(0, 3));

        // Calculate average ATS score
        let scoreSum = 0;
        let reportsCount = 0;
        
        for (const res of resumes) {
          try {
            const report = await api.getResumeReport(res._id);
            if (report && report.ats_score) {
              scoreSum += report.ats_score;
              reportsCount++;
            }
          } catch {
            // ignore missing reports
          }
        }

        setStats({
          resumes: resumes.length,
          avgAts: reportsCount > 0 ? Math.round(scoreSum / reportsCount) : 0,
          matches: matches.length,
          letters: letters.length
        });
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Overview Dashboard</h1>
        <p className="text-zinc-500 text-xs mt-1">Get a bird's eye view of your resume analysis and application match stats.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1 */}
        <motion.div 
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.05 }}
          className="p-5 rounded-2xl bg-zinc-950/40 border border-zinc-900 glass-card relative overflow-hidden"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-2xs text-zinc-500 font-semibold uppercase tracking-wide">Resumes Scanned</span>
              <div className="text-2xl font-bold text-white">{loading ? "..." : stats.resumes}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
        </motion.div>

        {/* Metric 2 */}
        <motion.div 
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.1 }}
          className="p-5 rounded-2xl bg-zinc-950/40 border border-zinc-900 glass-card relative overflow-hidden"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-2xs text-zinc-500 font-semibold uppercase tracking-wide">Average ATS Score</span>
              <div className="text-2xl font-bold text-white">{loading ? "..." : `${stats.avgAts}/100`}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Star className="w-4 h-4" />
            </div>
          </div>
        </motion.div>

        {/* Metric 3 */}
        <motion.div 
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.15 }}
          className="p-5 rounded-2xl bg-zinc-950/40 border border-zinc-900 glass-card relative overflow-hidden"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-2xs text-zinc-500 font-semibold uppercase tracking-wide">Job Comparisons</span>
              <div className="text-2xl font-bold text-white">{loading ? "..." : stats.matches}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Target className="w-4 h-4" />
            </div>
          </div>
        </motion.div>

        {/* Metric 4 */}
        <motion.div 
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.2 }}
          className="p-5 rounded-2xl bg-zinc-950/40 border border-zinc-900 glass-card relative overflow-hidden"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-2xs text-zinc-500 font-semibold uppercase tracking-wide">Cover Letters AI</span>
              <div className="text-2xl font-bold text-white">{loading ? "..." : stats.letters}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main layout split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Resumes list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wide">Recent Resumes</h2>
            <Link href="/dashboard/analyzer" className="text-2xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1">
              <span>Go to analyzer</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="py-12 border border-dashed border-zinc-900 rounded-2xl text-center text-zinc-500 text-xs">
                Syncing items...
              </div>
            ) : recentResumes.length === 0 ? (
              <div className="p-8 border border-dashed border-zinc-900 rounded-2xl text-center space-y-3 bg-zinc-950/20">
                <FileText className="w-8 h-8 text-zinc-600 mx-auto" />
                <p className="text-xs text-zinc-500">No resumes scanned yet.</p>
                <Link href="/dashboard/analyzer" className="inline-flex items-center gap-1 text-2xs bg-white text-black font-semibold px-3.5 py-1.5 rounded-lg hover:bg-zinc-200 transition-colors">
                  <Play className="w-3 h-3 fill-black" />
                  <span>Scan Resume</span>
                </Link>
              </div>
            ) : (
              recentResumes.map((res) => (
                <div key={res._id} className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-900 flex items-center justify-between hover:border-zinc-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/15">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">{res.filename}</div>
                      <div className="text-3xs text-zinc-500 flex items-center gap-2 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(res.uploadedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <Link href={`/dashboard/analyzer`} className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors border border-zinc-900">
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Launchpad list */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wide">Quick Launchpad</h2>
          <div className="p-5 rounded-2xl bg-zinc-950/40 border border-zinc-900 glass-panel space-y-3.5">
            <Link href="/dashboard/matcher" className="flex items-center justify-between p-2.5 rounded-lg hover:bg-zinc-900/50 text-xs transition-colors group">
              <span className="font-medium text-zinc-400 group-hover:text-white">Run Job Matching</span>
              <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
            </Link>
            <Link href="/dashboard/coverletter" className="flex items-center justify-between p-2.5 rounded-lg hover:bg-zinc-900/50 text-xs transition-colors group">
              <span className="font-medium text-zinc-400 group-hover:text-white">AI Cover Letter</span>
              <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
            </Link>
            <Link href="/dashboard/interview" className="flex items-center justify-between p-2.5 rounded-lg hover:bg-zinc-900/50 text-xs transition-colors group">
              <span className="font-medium text-zinc-400 group-hover:text-white">Interview Questions</span>
              <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
            </Link>
            <Link href="/dashboard/roadmap" className="flex items-center justify-between p-2.5 rounded-lg hover:bg-zinc-900/50 text-xs transition-colors group">
              <span className="font-medium text-zinc-400 group-hover:text-white">AI Career Roadmap</span>
              <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
