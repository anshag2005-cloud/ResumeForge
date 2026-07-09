"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { 
  Sparkles, FileText, Loader2, AlertCircle, 
  CheckCircle, RefreshCw, Copy, PlusCircle
} from "lucide-react";

export default function ResumeBuilder() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  
  const [improvements, setImprovements] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loadingImprove, setLoadingImprove] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

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

  const handleImprove = async () => {
    if (!selectedResumeId) {
      setError("Please select a resume to improve.");
      return;
    }

    setLoadingImprove(true);
    setError(null);
    try {
      const data = await api.improveResume(selectedResumeId);
      setImprovements(data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || err.message || "Failed to generate AI improvements.");
    } finally {
      setLoadingImprove(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">AI Resume Builder & Optimizer</h1>
        <p className="text-zinc-500 text-xs mt-1">Refine your bullets, generate powerful summary headlines, and draft resumes using action verbs.</p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs flex items-center gap-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left selector */}
        <div className="p-6 rounded-2xl bg-zinc-950/40 border border-zinc-900 glass-panel space-y-5">
          <div className="space-y-1.5">
            <label className="text-2xs text-zinc-400 font-semibold uppercase tracking-wide">Select Base Resume</label>
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

          <button
            onClick={handleImprove}
            disabled={loadingImprove || resumes.length === 0}
            className="w-full bg-white hover:bg-zinc-200 text-black font-semibold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loadingImprove ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating Upgrades...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Optimize Resume Bullets</span>
              </>
            )}
          </button>
        </div>

        {/* Right content suggestions */}
        <div className="lg:col-span-2 space-y-6">
          {!improvements ? (
            <div className="p-16 border border-dashed border-zinc-900 rounded-2xl text-center text-zinc-500 text-xs bg-zinc-950/10">
              Select a resume and click optimize to draft professional metrics-driven bullet structures.
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Summary Card */}
              <div className="p-6 rounded-2xl bg-zinc-950/40 border border-zinc-900 glass-panel space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">AI-Drafted Summary</h3>
                  <button 
                    onClick={() => copyToClipboard(improvements.improved_summary, "summary")}
                    className="text-3xs text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors bg-zinc-900 border border-zinc-900/60 px-2.5 py-1.5 rounded-lg"
                  >
                    {copiedIndex === "summary" ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedIndex === "summary" ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed bg-[#030303]/50 p-4 rounded-xl border border-zinc-900/50">
                  {improvements.improved_summary}
                </p>
              </div>

              {/* Experience Bullets Card */}
              <div className="p-6 rounded-2xl bg-zinc-950/40 border border-zinc-900 glass-panel space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Optimized Work Experience Bullets</h3>
                <div className="space-y-3">
                  {improvements.experience_bullets?.map((bullet: string, idx: number) => (
                    <div key={idx} className="p-4 rounded-xl bg-[#030303]/50 border border-zinc-900/50 flex justify-between items-start gap-4 hover:border-zinc-800 transition-colors">
                      <p className="text-xs text-zinc-400 leading-relaxed">{bullet}</p>
                      <button 
                        onClick={() => copyToClipboard(bullet, `exp_${idx}`)}
                        className="text-zinc-500 hover:text-white shrink-0"
                      >
                        {copiedIndex === `exp_${idx}` ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Power Verbs */}
              <div className="p-6 rounded-2xl bg-zinc-950/40 border border-zinc-900 glass-panel space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Suggested Action Verbs</h3>
                <div className="flex flex-wrap gap-2">
                  {improvements.power_verbs?.map((verb: string, idx: number) => (
                    <span key={idx} className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-900/60 text-indigo-400 text-3xs font-semibold uppercase tracking-wide">
                      {verb}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
