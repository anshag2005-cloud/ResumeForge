"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { 
  HelpCircle, FileText, Loader2, AlertCircle, 
  Sparkles, CheckCircle2, ChevronDown, ChevronUp
} from "lucide-react";

export default function InterviewPrep() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  
  const [prepData, setPrepData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loadingPrep, setLoadingPrep] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

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

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResumeId || !jobTitle) {
      setError("Please select a resume and enter a target job title.");
      return;
    }

    setLoadingPrep(true);
    setError(null);
    setExpandedIndex(null);
    try {
      const res = await api.generateInterviewPrep(selectedResumeId, jobTitle, jobDescription);
      setPrepData(res);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || err.message || "Failed to generate interview prep questions.");
    } finally {
      setLoadingPrep(false);
    }
  };

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">AI Interview Preparation</h1>
        <p className="text-zinc-500 text-xs mt-1">Generate custom technical and behavioral interview questions mapped to your target profile.</p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs flex items-center gap-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Form panel */}
        <div className="p-6 rounded-2xl bg-zinc-950/40 border border-zinc-900 glass-panel space-y-5">
          <form onSubmit={handleGenerate} className="space-y-5">
            {/* Resume Select */}
            <div className="space-y-1.5">
              <label className="text-2xs text-zinc-400 font-semibold uppercase tracking-wide">Select Base Profile</label>
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

            {/* Job Title */}
            <div className="space-y-1.5">
              <label className="text-2xs text-zinc-400 font-semibold uppercase tracking-wide">Target Role</label>
              <input
                type="text"
                required
                placeholder="e.g. Frontend Specialist"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full bg-zinc-950/60 border border-zinc-900 rounded-xl py-2.5 px-4 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-2xs text-zinc-400 font-semibold uppercase tracking-wide">Job Description Context (Optional)</label>
              <textarea
                rows={4}
                placeholder="Paste key responsibilities to extract niche questions..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full bg-zinc-950/60 border border-zinc-900 rounded-xl p-4 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-500 transition-colors resize-none leading-relaxed"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loadingPrep || resumes.length === 0}
              className="w-full bg-white hover:bg-zinc-200 text-black font-semibold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loadingPrep ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Drafting Questions...</span>
                </>
              ) : (
                <>
                  <HelpCircle className="w-4 h-4" />
                  <span>Generate Interview Prep</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Questions list */}
        <div className="lg:col-span-2 space-y-4">
          {!prepData ? (
            <div className="p-16 border border-dashed border-zinc-900 rounded-2xl text-center text-zinc-500 text-xs bg-zinc-950/10">
              Select details to generate standard Q&A outlines.
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Generated Questions</h3>
              <div className="space-y-3">
                {prepData.questions?.map((item: any, idx: number) => {
                  const isExpanded = expandedIndex === idx;
                  return (
                    <div 
                      key={idx} 
                      className="rounded-2xl border border-zinc-900 bg-zinc-950/40 overflow-hidden transition-all"
                    >
                      {/* Header click toggle */}
                      <div 
                        onClick={() => toggleExpand(idx)}
                        className="p-4 flex items-center justify-between cursor-pointer hover:bg-zinc-900/35 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0 pr-3">
                          <span className={`px-2 py-0.5 rounded text-4xs font-semibold uppercase tracking-wider shrink-0 ${
                            item.type === "Technical" ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                          }`}>
                            {item.type}
                          </span>
                          <span className="text-xs font-medium text-white truncate">{item.question}</span>
                        </div>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
                      </div>

                      {/* Expandable answer */}
                      {isExpanded && (
                        <div className="p-4 bg-[#030303]/60 border-t border-zinc-900/60 space-y-2">
                          <div className="text-4xs text-zinc-500 font-bold uppercase tracking-wider">Ideal Response Outline</div>
                          <p className="text-xs text-zinc-400 leading-relaxed font-light">{item.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
