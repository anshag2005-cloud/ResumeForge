"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { 
  Target, FileText, Loader2, AlertCircle, 
  Sparkles, CheckCircle2, AlertTriangle, PlusCircle
} from "lucide-react";

export default function JobMatcher() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobContent, setJobContent] = useState("");
  
  const [matchResult, setMatchResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMatch, setLoadingMatch] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResumes = async () => {
      setLoading(true);
      try {
        const data = await api.getResumes();
        setResumes(data);
        if (data.length > 0) {
          setSelectedResumeId(data[0]._id);
        }
      } catch (err: any) {
        console.error(err);
        setError("Failed to fetch resumes list.");
      } finally {
        setLoading(false);
      }
    };
    fetchResumes();
  }, []);

  const handleMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResumeId || !title || !jobContent) {
      setError("Please select a resume, enter a job title, and paste the description.");
      return;
    }

    setLoadingMatch(true);
    setError(null);
    try {
      const res = await api.matchResume(selectedResumeId, title, company, jobContent);
      setMatchResult(res);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || err.message || "Job description match calculation failed.");
    } finally {
      setLoadingMatch(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Job Description Matcher</h1>
        <p className="text-zinc-500 text-xs mt-1">Paste target job descriptions to analyze matching keywords and gaps.</p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs flex items-center gap-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left: Input Form */}
        <div className="p-6 rounded-2xl bg-zinc-950/40 border border-zinc-900 glass-panel">
          <form onSubmit={handleMatch} className="space-y-5">
            {/* Resume Select */}
            <div className="space-y-1.5">
              <label className="text-2xs text-zinc-400 font-semibold uppercase tracking-wide">Select Resume</label>
              {loading ? (
                <div className="text-xs text-zinc-500">Loading resumes...</div>
              ) : resumes.length === 0 ? (
                <div className="text-xs text-zinc-500 p-2 border border-zinc-900 rounded-lg">
                  No resumes found. Scan one first in the Resume Analyzer.
                </div>
              ) : (
                <select
                  required
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  className="w-full bg-zinc-950/60 border border-zinc-900 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  {resumes.map((res) => (
                    <option key={res._id} value={res._id} className="bg-zinc-950 text-white">
                      {res.filename}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Title & Company */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-2xs text-zinc-400 font-semibold uppercase tracking-wide">Job Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Backend Engineer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-zinc-950/60 border border-zinc-900 rounded-xl py-2.5 px-4 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-2xs text-zinc-400 font-semibold uppercase tracking-wide">Company (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Stripe"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-zinc-950/60 border border-zinc-900 rounded-xl py-2.5 px-4 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-2xs text-zinc-400 font-semibold uppercase tracking-wide">Job Description</label>
              <textarea
                required
                rows={8}
                placeholder="Paste the job description details here..."
                value={jobContent}
                onChange={(e) => setJobContent(e.target.value)}
                className="w-full bg-zinc-950/60 border border-zinc-900 rounded-xl p-4 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-500 transition-colors resize-none leading-relaxed"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loadingMatch || resumes.length === 0}
              className="w-full bg-white hover:bg-zinc-200 text-black font-semibold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loadingMatch ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Matching Vectors...</span>
                </>
              ) : (
                <>
                  <Target className="w-4 h-4" />
                  <span>Analyze Compatibility</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Compatibility Results */}
        <div className="space-y-6">
          {!matchResult ? (
            <div className="p-16 border border-dashed border-zinc-900 rounded-2xl text-center text-zinc-500 text-xs bg-zinc-950/10">
              Provide job details to render the compatibility matches.
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Overall Match Circle Card */}
              <div className="p-6 rounded-2xl bg-zinc-950/40 border border-zinc-900 glass-panel flex items-center gap-6">
                <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-zinc-900"
                      strokeWidth="3"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-indigo-500 transition-all duration-500"
                      strokeDasharray={`${matchResult.match_score}, 100`}
                      strokeWidth="3"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <div className="text-lg font-bold text-white leading-none">{matchResult.match_score}%</div>
                    <div className="text-4xs text-zinc-500 font-semibold uppercase tracking-wider mt-0.5">Match</div>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Similarity Score</h3>
                  <p className="text-zinc-400 text-xs max-w-sm">
                    {matchResult.match_score >= 85 
                      ? "Excellent! Your resume heavily aligns with the requirements of this role." 
                      : matchResult.match_score >= 60 
                        ? "Good fit. Try incorporating the missing keywords highlighted below to increase matches." 
                        : "Low compatibility. This description contains tech requirements not found on your profile."}
                  </p>
                </div>
              </div>

              {/* Skills breakdown */}
              <div className="p-6 rounded-2xl bg-zinc-950/40 border border-zinc-900 glass-panel space-y-6">
                
                {/* Matching Skills */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Matching Technologies ({matchResult.matching_skills?.length})</span>
                  </div>
                  {matchResult.matching_skills?.length === 0 ? (
                    <p className="text-xs text-zinc-500">No matching technologies detected.</p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {matchResult.matching_skills?.map((s: string, idx: number) => (
                        <span key={idx} className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-3xs font-medium uppercase tracking-wide">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Missing Keywords */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Missing Skills & Keywords ({matchResult.missing_keywords?.length})</span>
                  </div>
                  {matchResult.missing_keywords?.length === 0 ? (
                    <p className="text-xs text-zinc-500">No missing keywords found.</p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {matchResult.missing_keywords?.map((s: string, idx: number) => (
                        <span key={idx} className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-3xs font-medium uppercase tracking-wide">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Suggestions List */}
                <div className="space-y-3 border-t border-zinc-900/60 pt-5">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Recommendations</h4>
                  <ul className="space-y-2">
                    {matchResult.suggestions?.map((sug: string, idx: number) => (
                      <li key={idx} className="text-xs text-zinc-400 flex items-start gap-2.5 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                        <span>{sug}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
