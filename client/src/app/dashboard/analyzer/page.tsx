"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { 
  UploadCloud, FileText, Loader2, AlertCircle, 
  CheckCircle, ArrowDown, Trash2, HelpCircle
} from "lucide-react";

export default function ResumeAnalyzer() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "keywords" | "structure">("overview");

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

  useEffect(() => {
    fetchResumes();
  }, []);

  useEffect(() => {
    if (selectedResumeId) {
      const fetchReport = async () => {
        setLoadingReport(true);
        setError(null);
        try {
          const reportData = await api.getResumeReport(selectedResumeId);
          setReport(reportData);
        } catch (err: any) {
          console.error(err);
          setError("Failed to load ATS report for this resume.");
          setReport(null);
        } finally {
          setLoadingReport(false);
        }
      };
      fetchReport();
    }
  }, [selectedResumeId]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await handleUpload(e.target.files[0]);
    }
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      await api.uploadResume(file);
      await fetchResumes();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || err.message || "Failed to parse and upload resume.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resume?")) return;
    try {
      await api.deleteResume(id);
      setReport(null);
      await fetchResumes();
    } catch (err: any) {
      console.error(err);
      setError("Failed to delete resume.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Resume ATS Analyzer</h1>
        <p className="text-zinc-500 text-xs mt-1">Get an overall ATS evaluation and optimize your technical keyword coverage.</p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs flex items-center gap-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: Upload & Select */}
        <div className="space-y-6">
          
          {/* Drag Drop Area */}
          <div 
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative p-8 rounded-2xl border-2 border-dashed text-center transition-all ${
              dragActive 
                ? "border-indigo-500 bg-indigo-500/5" 
                : "border-zinc-900 bg-zinc-950/20 hover:border-zinc-800"
            }`}
          >
            <input 
              type="file" 
              accept=".txt,.md,.pdf,.docx" 
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {uploading ? (
              <div className="space-y-3 py-4">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mx-auto" />
                <div className="text-xs text-zinc-400 font-semibold">Running ATS Parsing Models...</div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center mx-auto text-zinc-400 border border-zinc-900">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div className="text-xs font-semibold text-white">Drag & drop your file here</div>
                <div className="text-3xs text-zinc-500">Supports PDF, DOCX, TXT (Max 10MB)</div>
              </div>
            )}
          </div>

          {/* Scanned Resumes List */}
          <div className="space-y-3">
            <h2 className="text-xs font-semibold text-white uppercase tracking-wider">Scanned Resumes</h2>
            {loading ? (
              <div className="py-8 text-center text-zinc-600 text-xs">Syncing items...</div>
            ) : resumes.length === 0 ? (
              <div className="p-6 rounded-xl border border-zinc-900 text-center text-xs text-zinc-500 bg-zinc-950/10">
                No resumes uploaded yet.
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {resumes.map((res) => (
                  <div 
                    key={res._id} 
                    onClick={() => setSelectedResumeId(res._id)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                      selectedResumeId === res._id 
                        ? "bg-indigo-600/10 border-indigo-600/35 text-white" 
                        : "bg-zinc-950/20 border-zinc-900 text-zinc-400 hover:border-zinc-800"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="w-4 h-4 shrink-0 text-indigo-400" />
                      <span className="text-xs font-medium truncate">{res.filename}</span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(res._id);
                      }}
                      className="p-1 rounded text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Side: Score & Reports */}
        <div className="lg:col-span-2 space-y-6">
          {loadingReport ? (
            <div className="py-24 text-center space-y-4">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mx-auto" />
              <p className="text-xs text-zinc-500">Calculating ATS score metrics...</p>
            </div>
          ) : !report ? (
            <div className="p-16 border border-dashed border-zinc-900 rounded-2xl text-center text-zinc-500 text-xs bg-zinc-950/10">
              Select or upload a resume to view the ATS analytics report.
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* ATS Headline Stats */}
              <div className="p-6 rounded-2xl bg-zinc-950/40 border border-zinc-900 glass-panel flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  {/* Circular Score display */}
                  <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
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
                        strokeDasharray={`${report.ats_score}, 100`}
                        strokeWidth="3"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <div className="text-xl font-bold text-white leading-none">{report.ats_score}</div>
                      <div className="text-3xs text-zinc-500 font-medium tracking-wide mt-0.5">ATS</div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-base font-bold text-white">Overall Assessment</div>
                    <p className="text-zinc-500 text-xs max-w-sm">
                      {report.ats_score >= 80 
                        ? "Excellent ATS rating! Your resume is highly structured and keyword-optimized." 
                        : report.ats_score >= 60 
                          ? "Good score, but adding essential keyword densities can boost your rank." 
                          : "Needs improvement. Review the feedback and missing sections below."}
                    </p>
                  </div>
                </div>

                {/* Sub Scores */}
                <div className="grid grid-cols-2 gap-4 shrink-0 border-t border-zinc-900/60 pt-4 md:pt-0 md:border-t-0 md:border-l md:pl-6 border-zinc-900">
                  <div className="text-center">
                    <div className="text-sm font-bold text-white">{report.structure_score}%</div>
                    <div className="text-4xs text-zinc-500 font-semibold uppercase tracking-wider mt-0.5">Formatting</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-white">{report.keyword_score}%</div>
                    <div className="text-4xs text-zinc-500 font-semibold uppercase tracking-wider mt-0.5">Keywords</div>
                  </div>
                </div>
              </div>

              {/* Tabs Section */}
              <div className="space-y-4">
                <div className="flex border-b border-zinc-900 text-xs">
                  <button 
                    onClick={() => setActiveTab("overview")}
                    className={`pb-2.5 px-4 font-semibold border-b-2 transition-colors ${
                      activeTab === "overview" ? "border-indigo-500 text-white" : "border-transparent text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    ATS Recommendations
                  </button>
                  <button 
                    onClick={() => setActiveTab("keywords")}
                    className={`pb-2.5 px-4 font-semibold border-b-2 transition-colors ${
                      activeTab === "keywords" ? "border-indigo-500 text-white" : "border-transparent text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    Skills & Keywords
                  </button>
                  <button 
                    onClick={() => setActiveTab("structure")}
                    className={`pb-2.5 px-4 font-semibold border-b-2 transition-colors ${
                      activeTab === "structure" ? "border-indigo-500 text-white" : "border-transparent text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    Section Scores
                  </button>
                </div>

                <div className="p-6 rounded-2xl bg-zinc-950/40 border border-zinc-900 min-h-[160px]">
                  
                  {activeTab === "overview" && (
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">Key Suggestions</h3>
                      {report.feedback?.suggestions?.length === 0 ? (
                        <p className="text-xs text-zinc-500">No suggestions, format is perfect!</p>
                      ) : (
                        <ul className="space-y-2">
                          {report.feedback?.suggestions?.map((sug: string, idx: number) => (
                            <li key={idx} className="text-xs text-zinc-400 flex items-start gap-2.5 leading-relaxed">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                              <span>{sug}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  {activeTab === "keywords" && (
                    <div className="space-y-5">
                      <div className="space-y-3">
                        <h3 className="text-xs font-bold text-white uppercase tracking-wider">Technical Keywords Detected</h3>
                        <div className="flex flex-wrap gap-1.5">
                          {report.feedback?.skills_found?.technical?.map((s: string, idx: number) => (
                            <span key={idx} className="px-2 py-1 rounded bg-zinc-900 border border-zinc-900/60 text-indigo-400 text-3xs font-medium uppercase tracking-wide">
                              {s}
                            </span>
                          )) || <span className="text-xs text-zinc-500">None detected</span>}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-xs font-bold text-white uppercase tracking-wider">Soft Skills Detected</h3>
                        <div className="flex flex-wrap gap-1.5">
                          {report.feedback?.skills_found?.soft?.map((s: string, idx: number) => (
                            <span key={idx} className="px-2 py-1 rounded bg-zinc-900 border border-zinc-900/60 text-purple-400 text-3xs font-medium uppercase tracking-wide">
                              {s}
                            </span>
                          )) || <span className="text-xs text-zinc-500">None detected</span>}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "structure" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Object.entries(report.section_scores || {}).map(([sec, val]: any) => (
                        <div key={sec} className="p-3.5 rounded-xl bg-zinc-900/30 border border-zinc-900/60 flex items-center justify-between">
                          <span className="text-xs text-zinc-400 capitalize font-medium">{sec.replace('_', ' ')}</span>
                          <span className={`text-xs font-bold ${
                            val >= 80 ? "text-emerald-400" : val >= 50 ? "text-amber-400" : "text-rose-400"
                          }`}>{val}%</span>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
