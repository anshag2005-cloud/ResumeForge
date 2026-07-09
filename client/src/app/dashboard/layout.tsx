"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { 
  FileText, Sparkles, Target, Award, Loader2, LogOut, 
  LayoutDashboard, Wrench, FileEdit, HelpCircle, Compass, ClipboardList, Settings, User
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();

  const menuItems = [
    { name: "Overview", path: "/dashboard", icon: LayoutDashboard },
    { name: "Resume Analyzer", path: "/dashboard/analyzer", icon: FileText },
    { name: "Job Matcher", path: "/dashboard/matcher", icon: Target },
    { name: "Resume Builder", path: "/dashboard/builder", icon: FileEdit },
    { name: "Cover Letter", path: "/dashboard/coverletter", icon: Wrench },
    { name: "Interview Prep", path: "/dashboard/interview", icon: HelpCircle },
    { name: "Career Roadmap", path: "/dashboard/roadmap", icon: Compass },
    { name: "App Tracker", path: "/dashboard/tracker", icon: ClipboardList },
    { name: "Profile Settings", path: "/dashboard/settings", icon: Settings },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mx-auto" />
          <p className="text-sm text-zinc-500 font-medium">Synchronizing profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Route Guard handles redirect to /login
  }

  return (
    <div className="min-h-screen bg-[#030303] flex text-zinc-300">
      {/* Sidebar Panel */}
      <aside className="w-64 border-r border-zinc-900 bg-zinc-950/40 backdrop-blur-md flex flex-col justify-between shrink-0 hidden md:flex">
        <div className="p-6 space-y-8">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm">
              RF
            </div>
            <span className="font-bold text-lg text-white group-hover:text-zinc-200 transition-colors">
              ResumeForge
            </span>
          </Link>

          {/* User Card */}
          <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-900 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <User className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-semibold text-white truncate">{user.name}</div>
              <div className="text-3xs text-zinc-500 truncate">{user.email}</div>
            </div>
          </div>

          {/* Links list */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                      : "hover:bg-zinc-900/50 text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout bottom */}
        <div className="p-6 border-t border-zinc-900/60">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium hover:bg-rose-500/10 text-zinc-400 hover:text-rose-400 transition-all border border-transparent hover:border-rose-500/20"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* Header bar for mobile / desktop profile */}
        <header className="h-16 border-b border-zinc-900 flex items-center justify-between px-8 bg-zinc-950/20 md:justify-end">
          {/* Mobile view Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 group md:hidden">
            <div className="w-7 h-7 rounded bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs">
              RF
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <div className="text-2xs text-zinc-500 bg-zinc-900/50 px-2.5 py-1 rounded-md border border-zinc-900">
              API Status: <span className="text-emerald-500">Connected</span>
            </div>
          </div>
        </header>

        {/* Page Inner Content */}
        <main className="flex-grow p-8 overflow-y-auto relative">
          <div className="max-w-6xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
