"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { 
  ClipboardList, Plus, Trash2, Loader2, AlertCircle, 
  MapPin, DollarSign, Bookmark, ArrowRight, HelpCircle
} from "lucide-react";

const STAGES = ["Wishlist", "Applied", "Interviewing", "Offered", "Rejected"];

export default function AppTracker() {
  const [applications, setApplications] = useState<any[]>([]);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [salary, setSalary] = useState("");
  const [status, setStatus] = useState("Applied");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const data = await api.getApplications();
      setApplications(data);
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch applications tracker list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleAddApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !role) {
      setError("Company and Role are required.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await api.createApplication({
        company,
        role,
        status,
        salary,
        notes
      });
      // Clear inputs
      setCompany("");
      setRole("");
      setSalary("");
      setNotes("");
      setShowAddForm(false);
      await fetchApplications();
    } catch (err: any) {
      console.error(err);
      setError("Failed to save application tracker details.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await api.updateApplication(id, { status: newStatus });
      await fetchApplications();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this application tracker entry?")) return;
    try {
      await api.deleteApplication(id);
      await fetchApplications();
    } catch (err) {
      console.error("Failed to delete application:", err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Job Application Tracker</h1>
          <p className="text-zinc-500 text-xs mt-1">Track pipeline stages, salary estimates, and bookmarks for your targets.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-1.5 self-start bg-white hover:bg-zinc-200 text-black font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Position</span>
        </button>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs flex items-center gap-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Add Position Modal Overlay */}
      {showAddForm && (
        <div className="p-6 rounded-2xl bg-zinc-950/40 border border-zinc-900 glass-panel max-w-xl mx-auto space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">New Target Position</h3>
          <form onSubmit={handleAddApplication} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-4xs text-zinc-400 font-semibold uppercase tracking-wide">Company</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stripe"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-zinc-950/60 border border-zinc-900 rounded-xl py-2 px-3 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-4xs text-zinc-400 font-semibold uppercase tracking-wide">Role Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Backend Dev"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-zinc-950/60 border border-zinc-900 rounded-xl py-2 px-3 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-4xs text-zinc-400 font-semibold uppercase tracking-wide">Pipeline Stage</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-zinc-950/60 border border-zinc-900 rounded-xl py-2 px-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {STAGES.map(s => <option key={s} value={s} className="bg-zinc-950 text-white">{s}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-4xs text-zinc-400 font-semibold uppercase tracking-wide">Salary Target (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. $120k/yr"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  className="w-full bg-zinc-950/60 border border-zinc-900 rounded-xl py-2 px-3 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-4xs text-zinc-400 font-semibold uppercase tracking-wide">Notes (Optional)</label>
              <textarea
                rows={3}
                placeholder="Mention interview dates, contacts, or references..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-zinc-950/60 border border-zinc-900 rounded-xl p-3 text-xs text-white placeholder-zinc-700 focus:outline-none"
              />
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all border border-zinc-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white text-black hover:bg-zinc-200 transition-all disabled:opacity-50"
              >
                {submitting ? "Saving..." : "Save Position"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const stageApps = applications.filter(app => app.status === stage);
          return (
            <div 
              key={stage} 
              className="flex flex-col gap-3 min-w-[200px]"
            >
              {/* Header column title */}
              <div className="flex items-center justify-between pb-2 border-b border-zinc-900/60 px-1">
                <span className="text-2xs font-semibold text-zinc-400 uppercase tracking-wider">{stage}</span>
                <span className="text-3xs text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded font-mono">{stageApps.length}</span>
              </div>

              {/* Column cards container */}
              <div className="space-y-2.5 flex-grow min-h-[300px]">
                {loading ? (
                  <div className="py-12 text-center text-zinc-700 text-2xs">...</div>
                ) : stageApps.length === 0 ? (
                  <div className="py-12 border border-dashed border-zinc-900/40 rounded-xl text-center text-3xs text-zinc-600 select-none">
                    Drop items
                  </div>
                ) : (
                  stageApps.map((app) => (
                    <div 
                      key={app.id}
                      className="p-3.5 rounded-xl bg-zinc-950/40 border border-zinc-900 hover:border-zinc-800 transition-all space-y-3 relative group"
                    >
                      <div>
                        <div className="text-xs font-bold text-white leading-tight">{app.company}</div>
                        <div className="text-4xs text-zinc-500 mt-0.5 font-medium">{app.role}</div>
                      </div>

                      {app.salary && (
                        <div className="text-4xs text-indigo-400 font-mono flex items-center gap-0.5 bg-indigo-500/5 border border-indigo-500/10 px-1.5 py-0.5 rounded self-start inline-block">
                          <DollarSign className="w-3 h-3 shrink-0" />
                          <span>{app.salary}</span>
                        </div>
                      )}

                      {/* Move selector */}
                      <div className="flex items-center justify-between pt-2 border-t border-zinc-900/50">
                        <select
                          value={app.status}
                          onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                          className="bg-zinc-900 border-none text-4xs font-medium text-zinc-400 hover:text-white focus:outline-none"
                        >
                          {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        
                        <button 
                          onClick={() => handleDelete(app.id)}
                          className="p-1 rounded text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
