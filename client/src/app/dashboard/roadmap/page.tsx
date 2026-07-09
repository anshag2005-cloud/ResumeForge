"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { 
  Compass, FileText, Loader2, AlertCircle, 
  Sparkles, CheckCircle2, ChevronRight, Award, MapPin
} from "lucide-react";

export default function CareerRoadmap() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  
  const [roadmap, setRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);
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

  const handleGenerate = async () => {
    if (!selectedResumeId) {
      setError("Please select a resume to plan.");
      return;
    }

    setLoadingRoadmap(true);
    setError(null);
    try {
      const data = await api.generateCareerRoadmap(selectedResumeId);
      setRoadmap(data.roadmap_json);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || err.message || "Failed to generate AI career roadmap.");
    } finally {
      setLoadingRoadmap(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">AI Career Roadmap Advisor</h1>
        <p className="text-zinc-500 text-xs mt-1">Scan your credentials and layout sequential career milestones to reach target salaries.</p>
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

          <button
            onClick={handleGenerate}
            disabled={loadingRoadmap || resumes.length === 0}
            className="w-full bg-white hover:bg-zinc-200 text-black font-semibold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loadingRoadmap ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Planning Roadmap...</span>
              </>
            ) : (
              <>
                <Compass className="w-4 h-4" />
                <span>Generate Career Path</span>
              </>
            )}
          </button>
        </div>

        {/* Right content details */}
        <div className="lg:col-span-2 space-y-6">
          {!roadmap ? (
            <div className="p-16 border border-dashed border-zinc-900 rounded-2xl text-center text-zinc-500 text-xs bg-zinc-950/10">
              Select your profile to calculate industry certifications and custom step roadmaps.
            </div>
          ) : (
            <div className="space-y-8">
              
              {/* Highlight box */}
              <div className="p-6 rounded-2xl bg-zinc-950/40 border border-zinc-900 glass-panel grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="text-4xs text-zinc-500 font-bold uppercase tracking-wider">Suggested Roles</h3>
                  <div className="space-y-1">
                    {roadmap.suggested_roles?.map((role: string, idx: number) => (
                      <div key={idx} className="text-xs font-semibold text-white">{role}</div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 border-t border-zinc-900/60 pt-4 sm:pt-0 sm:border-t-0 sm:border-l sm:pl-6 border-zinc-900">
                  <h3 className="text-4xs text-zinc-500 font-bold uppercase tracking-wider">Target Salary Band</h3>
                  <div className="text-xl font-bold text-indigo-400 mt-1">{roadmap.salary_range}</div>
                </div>
              </div>

              {/* Education recommendations split */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Certifications card */}
                <div className="p-5 rounded-2xl bg-zinc-950/40 border border-zinc-900 glass-panel space-y-4">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Recommended Certifications</h4>
                  <ul className="space-y-2">
                    {roadmap.certifications?.map((cert: string, idx: number) => (
                      <li key={idx} className="text-xs text-zinc-400 flex items-start gap-2">
                        <Award className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                        <span>{cert}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Courses card */}
                <div className="p-5 rounded-2xl bg-zinc-950/40 border border-zinc-900 glass-panel space-y-4">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Recommended Courses</h4>
                  <ul className="space-y-2">
                    {roadmap.courses?.map((course: string, idx: number) => (
                      <li key={idx} className="text-xs text-zinc-400 flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                        <span>{course}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Sequential Steps Timeline */}
              <div className="p-6 rounded-2xl bg-zinc-950/40 border border-zinc-900 glass-panel space-y-6">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Sequential Milestones</h4>
                <div className="relative border-l border-zinc-900 pl-6 ml-3 space-y-8">
                  {roadmap.roadmap_steps?.map((step: any, idx: number) => (
                    <div key={idx} className="relative space-y-1.5">
                      {/* Circle node pointer */}
                      <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-zinc-950 border-2 border-indigo-500 flex items-center justify-center text-5xs font-bold text-white">
                        {step.step || idx + 1}
                      </span>
                      <div className="text-xs font-bold text-white">{step.title}</div>
                      <p className="text-xs text-zinc-400 leading-relaxed font-light">{step.description}</p>
                    </div>
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
