"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { 
  Wrench, FileText, Loader2, AlertCircle, 
  CheckCircle, Copy, FileSignature
} from "lucide-react";

export default function CoverLetterGenerator() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [tone, setTone] = useState("professional");

  const [letterResult, setLetterResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loadingLetter, setLoadingLetter] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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
    if (!selectedResumeId || !companyName || !jobTitle) {
      setError("Please select a resume, enter company name, and enter job title.");
      return;
    }

    setLoadingLetter(true);
    setError(null);
    try {
      const res = await api.generateCoverLetter(
        selectedResumeId,
        companyName,
        jobTitle,
        jobDescription,
        tone
      );
      setLetterResult(res);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || err.message || "Failed to generate cover letter.");
    } finally {
      setLoadingLetter(false);
    }
  };

  const copyToClipboard = () => {
    if (!letterResult) return;
    navigator.clipboard.writeText(letterResult.letter_text || letterResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">AI Cover Letter Generator</h1>
        <p className="text-zinc-500 text-xs mt-1">Generate dynamic cover letters fitted specifically to target corporations and roles.</p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs flex items-center gap-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left Input Form */}
        <div className="p-6 rounded-2xl bg-zinc-950/40 border border-zinc-900 glass-panel">
          <form onSubmit={handleGenerate} className="space-y-5">
            
            {/* Resume Select */}
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

            {/* Company & Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-2xs text-zinc-400 font-semibold uppercase tracking-wide">Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Notion"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-zinc-950/60 border border-zinc-900 rounded-xl py-2.5 px-4 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-2xs text-zinc-400 font-semibold uppercase tracking-wide">Job Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Frontend Engineer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full bg-zinc-950/60 border border-zinc-900 rounded-xl py-2.5 px-4 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            {/* Tone Selector */}
            <div className="space-y-1.5">
              <label className="text-2xs text-zinc-400 font-semibold uppercase tracking-wide">Writing Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-zinc-950/60 border border-zinc-900 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="professional" className="bg-zinc-950 text-white">Professional & Polished</option>
                <option value="enthusiastic" className="bg-zinc-950 text-white">Enthusiastic & Creative</option>
                <option value="technical" className="bg-zinc-950 text-white">Technical & Metrics-Focused</option>
              </select>
            </div>

            {/* Job Context */}
            <div className="space-y-1.5">
              <label className="text-2xs text-zinc-400 font-semibold uppercase tracking-wide">Job Description Context (Optional)</label>
              <textarea
                rows={4}
                placeholder="Paste key responsibilities to align points..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full bg-zinc-950/60 border border-zinc-900 rounded-xl p-4 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-500 transition-colors resize-none leading-relaxed"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loadingLetter || resumes.length === 0}
              className="w-full bg-white hover:bg-zinc-200 text-black font-semibold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loadingLetter ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Drafting Cover Letter...</span>
                </>
              ) : (
                <>
                  <FileSignature className="w-4 h-4" />
                  <span>Generate Cover Letter</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Output Display */}
        <div className="space-y-6">
          {!letterResult ? (
            <div className="p-16 border border-dashed border-zinc-900 rounded-2xl text-center text-zinc-500 text-xs bg-zinc-950/10">
              Provide target coordinates to generate your cover letter.
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-zinc-950/40 border border-zinc-900 glass-panel space-y-4 relative">
              <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">AI Drafted Letter</h3>
                <button 
                  onClick={copyToClipboard}
                  className="text-3xs text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors bg-zinc-900 border border-zinc-900/60 px-2.5 py-1.5 rounded-lg"
                >
                  {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied!" : "Copy Text"}</span>
                </button>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed whitespace-pre-wrap font-mono p-4 bg-[#030303]/60 border border-zinc-900/40 rounded-xl max-h-[380px] overflow-y-auto">
                {letterResult.letter_text || letterResult}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
