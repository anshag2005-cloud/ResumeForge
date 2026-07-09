"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  Settings, User, Mail, Globe, GitBranch, 
  Shield, AlertCircle, CheckCircle, Loader2
} from "lucide-react";

const Linkedin = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);


export default function ProfileSettings() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [portfolio, setPortfolio] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    // Mock API delay for client validation feedback
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1000);
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Profile Settings</h1>
        <p className="text-zinc-500 text-xs mt-1">Configure your personal information, links, and system preferences.</p>
      </div>

      {success && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs flex items-center gap-3">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>Profile configuration saved successfully!</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs flex items-center gap-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid splits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Settings Form */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-zinc-950/40 border border-zinc-900 glass-panel">
          <form onSubmit={handleUpdate} className="space-y-5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-zinc-900 pb-3">Personal Details</h3>
            
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-2xs text-zinc-400 font-semibold uppercase tracking-wide">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-950/60 border border-zinc-900 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Email (Readonly) */}
            <div className="space-y-1.5 opacity-60">
              <label className="text-2xs text-zinc-400 font-semibold uppercase tracking-wide">Email Address (Read-only)</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  readOnly
                  value={user?.email || ""}
                  className="w-full bg-zinc-950/60 border border-zinc-900 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none select-none cursor-not-allowed"
                />
              </div>
            </div>

            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-zinc-900 pb-3 pt-4">Social Profiles</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-2xs text-zinc-400 font-semibold uppercase tracking-wide">LinkedIn Profile</label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="https://linkedin.com/..."
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="w-full bg-zinc-950/60 border border-zinc-900 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-2xs text-zinc-400 font-semibold uppercase tracking-wide">GitHub Link</label>
                <div className="relative">
                  <GitBranch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="https://github.com/..."
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    className="w-full bg-zinc-950/60 border border-zinc-900 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-2xs text-zinc-400 font-semibold uppercase tracking-wide">Portfolio Web</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="https://yoursite.com"
                    value={portfolio}
                    onChange={(e) => setPortfolio(e.target.value)}
                    className="w-full bg-zinc-950/60 border border-zinc-900 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-700 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-white hover:bg-zinc-200 text-black font-semibold text-xs py-2.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Updates...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </form>
        </div>

        {/* Security details card */}
        <div className="p-6 rounded-2xl bg-zinc-950/40 border border-zinc-900 glass-panel space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-zinc-900 pb-3">Session & Security</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-500">Account Role</span>
              <span className="font-semibold text-white capitalize">{user?.role}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-500">Encryption Method</span>
              <span className="font-semibold text-white">Bcrypt hashing</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-500">Token Type</span>
              <span className="font-semibold text-white">JWT bearer token</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
