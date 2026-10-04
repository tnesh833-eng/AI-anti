/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Menu, X, ChevronDown, Check, Trophy, Flame, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { StudentProfile } from '../types.ts';
import { useAuth } from '../context/AuthContext.tsx';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  student: StudentProfile | null;
  onSwitchStudent: (id: string) => void;
  allStudentIds: string[];
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  student,
  onSwitchStudent,
  allStudentIds,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [studentMenuOpen, setStudentMenuOpen] = useState(false);
  const { user, signIn, signOut, loading, authError } = useAuth();

  // All 6 tabs perfectly styled in collegiate light aesthetic
  const navTabs = [
    { id: 'home', label: 'Landing / Home' },
    { id: 'tutor', label: 'Interactive AI Tutor' },
    { id: 'quiz', label: 'Adaptive Quizzes' },
    { id: 'analytics', label: 'System Architecture' },
    { id: 'recommendations', label: 'Recommendations' },
    { id: 'curriculum', label: 'Curriculum' },
  ];

  const unlockedHonorsCount = student?.achievements?.filter((a) => a.unlocked).length || 0;

  return (
    <header className="sticky top-0 z-50 bg-[#FAF9F7]/95 backdrop-blur-md border-b border-[#E5E1D8]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div
          className="flex items-center gap-3 cursor-pointer shrink-0 select-none"
          onClick={() => setActiveTab('home')}
        >
          {/* Logo SVG: Owl + Shield Crest in Classic Brass & Ivory */}
          <svg width="42" height="46" viewBox="0 0 44 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
            <path d="M22 2L4 9V24C4 33.9 12.1 43.1 22 46C31.9 43.1 40 33.9 40 24V9L22 2Z" fill="#FAF9F7" stroke="#A17F3B" strokeWidth="1.5"/>
            <path d="M10 28 Q22 24 22 24 Q22 24 34 28 L34 36 Q22 32 22 32 Q22 32 10 36 Z" fill="#0D1B2A" opacity="0.9"/>
            <path d="M10 28 L10 36" stroke="#A17F3B" strokeWidth="1" strokeLinecap="round"/>
            <path d="M34 28 L34 36" stroke="#A17F3B" strokeWidth="1" strokeLinecap="round"/>
            <line x1="22" y1="24" x2="22" y2="32" stroke="#A17F3B" strokeWidth="1"/>
            <circle cx="15" cy="30" r="1" fill="#A17F3B"/>
            <circle cx="13" cy="33" r="1" fill="#A17F3B"/>
            <circle cx="18" cy="34" r="1" fill="#A17F3B"/>
            <line x1="15" y1="30" x2="13" y2="33" stroke="#A17F3B" strokeWidth="0.6" opacity="0.7"/>
            <line x1="13" y1="33" x2="18" y2="34" stroke="#A17F3B" strokeWidth="0.6" opacity="0.7"/>
            <line x1="15" y1="30" x2="18" y2="34" stroke="#A17F3B" strokeWidth="0.6" opacity="0.7"/>
            <circle cx="27" cy="30" r="1" fill="#A17F3B"/>
            <circle cx="30" cy="33" r="1" fill="#A17F3B"/>
            <circle cx="25" cy="34" r="1" fill="#A17F3B"/>
            <line x1="27" y1="30" x2="30" y2="33" stroke="#A17F3B" strokeWidth="0.6" opacity="0.7"/>
            <line x1="30" y1="33" x2="25" y2="34" stroke="#A17F3B" strokeWidth="0.6" opacity="0.7"/>
            <line x1="27" y1="30" x2="25" y2="34" stroke="#A17F3B" strokeWidth="0.6" opacity="0.7"/>
            <ellipse cx="22" cy="18" rx="7" ry="8" fill="#A17F3B"/>
            <path d="M16 12 L14 7 L18 11Z" fill="#A17F3B"/>
            <path d="M28 12 L30 7 L26 11Z" fill="#A17F3B"/>
            <circle cx="19" cy="17" r="3" fill="#FAF9F7"/>
            <circle cx="25" cy="17" r="3" fill="#FAF9F7"/>
            <circle cx="19.5" cy="17" r="1.6" fill="#0D1B2A"/>
            <circle cx="25.5" cy="17" r="1.6" fill="#0D1B2A"/>
            <circle cx="19.8" cy="16.5" r="0.6" fill="white"/>
            <circle cx="25.8" cy="16.5" r="0.6" fill="white"/>
            <path d="M21 20 L22 22 L23 20Z" fill="#0D1B2A"/>
          </svg>

          <div className="flex flex-col">
            <span
              style={{ fontFamily: "'EB Garamond', serif" }}
              className="text-base sm:text-lg lg:text-xl tracking-tight font-bold uppercase text-[#0D1B2A] leading-tight"
            >
              INTELLIGENT TUTOR
            </span>
            <span
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
              className="text-[9px] sm:text-[9.5px] tracking-widest uppercase text-[#A17F3B] font-semibold"
            >
              AI-POWERED SCHOLASTIC ASSISTANT
            </span>
          </div>
        </div>

        {/* Center Desktop Navigation Tabs */}
        <nav className="hidden xl:flex items-center gap-6 lg:gap-7 text-xs lg:text-sm font-medium">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-1.5 transition-colors cursor-pointer relative whitespace-nowrap ${
                  isActive
                    ? 'text-[#0D1B2A] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2.5px] after:bg-[#A17F3B]'
                    : 'text-[#5A6065] hover:text-[#0D1B2A]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Medium-screen Compact Navigation Tabs */}
        <nav className="hidden md:flex xl:hidden items-center gap-3 text-xs font-medium">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-1 px-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#F6F0E4] text-[#0D1B2A] font-bold border-b-2 border-[#A17F3B]'
                    : 'text-[#5A6065] hover:text-[#0D1B2A]'
                }`}
              >
                {tab.label.replace('Landing / ', '').replace('Interactive ', '')}
              </button>
            );
          })}
        </nav>

        {/* Right CTA Button & Firebase Auth Section */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
          {/* Sign In with Google Button (when unauthenticated) */}
          {!user && (
            <button
              onClick={() => signIn()}
              className="inline-flex items-center gap-2 bg-white hover:bg-[#F4F2EE] text-[#0D1B2A] text-xs font-serif font-bold px-3.5 py-2 rounded-lg border border-[#E2DED6] shadow-2xs transition-all cursor-pointer"
              title="Sign in with your Google Account via Firebase Auth"
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.14z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.36 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.27 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span className="hidden sm:inline">Sign In with Google</span>
              <span className="sm:hidden">Sign In</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('tutor')}
            className="hidden lg:inline-flex items-center justify-center bg-[#0D1B2A] hover:bg-[#1B2A4A] text-white text-xs font-bold uppercase tracking-wider px-4 sm:px-5 py-2.5 rounded-lg shadow-xs transition-all cursor-pointer border border-[#A17F3B]/40"
          >
            LAUNCH AI TUTOR
          </button>

          {/* Scholar Profile Indicator with Streak Badge */}
          <div className="relative">
            <button
              onClick={() => setStudentMenuOpen(!studentMenuOpen)}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-[#F4F2EE] transition-colors focus:outline-hidden cursor-pointer"
              title={
                user
                  ? `Authenticated as ${user.displayName || user.email}`
                  : student
                  ? `Active Profile: ${student.name}`
                  : 'Scholar Profile'
              }
            >
              {/* Daily Streak Status Badge on Profile */}
              {student && (
                <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-mono font-bold">
                  <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500/20" />
                  <span>{student.streakDays}d Streak</span>
                </div>
              )}

              <div className="relative">
                <img
                  src={
                    user?.photoURL ||
                    'https://lh3.googleusercontent.com/aida/AEtjO1VQp42nJsqSdTyuAGeRbj0F79hidjZaji-woxvGewclpr4E44hcTUVgLzwWOCYb0K55zG0iQxwjZy7Cc8Psr70ePraStMxrV13I9VPL-__wtfgbwLyB3gK44yCjqZBj-GCP2vfYK55FJJSdALRxI9i1S2Jg1xeXbEoUdI7IT4A5slPQax1sPS2W973kI9Fte-mjA-1chy1C3G6WJvpLwcgRotJOhA03Qw2zPWYLFpwGrm9pF_3oUSjgBXhl'
                  }
                  alt="Scholar Portrait"
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#E9C176] shadow-2xs hover:border-[#A17F3B] transition-colors"
                />
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${
                    user ? 'bg-emerald-500' : 'bg-amber-400'
                  }`}
                  title={user ? 'Firebase Auth Connected' : 'Guest Scholar Mode'}
                />
              </div>
            </button>

            {/* Profile Dropdown with Firebase Auth & Achievements Summary */}
            {studentMenuOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#E2DED6] p-3.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                {/* Auth status card */}
                <div className="px-3.5 py-3 border-b border-[#E2DED6] mb-2.5 bg-[#FAF9F7] rounded-xl">
                  {user ? (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-serif font-bold text-xs text-[#0D1B2A]">
                          {user.displayName || 'Academic Scholar'}
                        </span>
                        <span className="font-mono text-[9px] uppercase px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold flex items-center gap-1">
                          <Check className="w-2.5 h-2.5 text-emerald-700" />
                          Authenticated
                        </span>
                      </div>
                      <p className="text-[11px] text-[#5A6065] truncate">{user.email}</p>
                      <p className="text-[10px] text-[#A17F3B] font-mono mt-0.5">Firebase Auth &bull; Google Login</p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-serif font-bold text-xs text-[#0D1B2A]">
                          {student?.name || 'Active Scholar'}
                        </span>
                        <span className="font-mono text-[9px] uppercase px-2 py-0.5 rounded-full bg-amber-50 border border-amber-300 text-amber-800 font-bold">
                          Guest Mode
                        </span>
                      </div>
                      <p className="text-[11px] text-[#5A6065] truncate">{student?.email}</p>
                      <button
                        onClick={() => {
                          setStudentMenuOpen(false);
                          signIn();
                        }}
                        className="mt-2.5 w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg bg-white border border-[#E2DED6] hover:bg-[#F4F2EE] text-xs font-serif font-semibold text-[#0D1B2A] transition-colors"
                      >
                        <LogIn className="w-3.5 h-3.5 text-[#A17F3B]" />
                        <span>Sign In with Google</span>
                      </button>
                    </div>
                  )}

                  {/* Student Streak & Achievements Visual Summary */}
                  <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-[#E5E1D8]">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-amber-800 bg-amber-50/80 px-2.5 py-1.5 rounded-lg border border-amber-200/70">
                      <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500/20" />
                      <span>{student?.streakDays || 0}d Streak</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#0D1B2A] bg-[#F6F0E4] px-2.5 py-1.5 rounded-lg border border-[#E9C176]/60">
                      <Trophy className="w-3.5 h-3.5 text-[#A17F3B]" />
                      <span>{unlockedHonorsCount} Honors</span>
                    </div>
                  </div>
                </div>

                {/* Switch Learner Profile Option */}
                <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-[#5A6065]">
                  Switch Demo Student:
                </div>

                {allStudentIds.map((id) => (
                  <button
                    key={id}
                    onClick={() => {
                      onSwitchStudent(id);
                      setStudentMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors text-left cursor-pointer ${
                      student?.id === id
                        ? 'bg-[#F6F0E4] text-[#0D1B2A] font-bold'
                        : 'hover:bg-[#F4F2EE] text-[#5A6065] hover:text-[#0D1B2A]'
                    }`}
                  >
                    <span>{id === 'student-1' ? 'Alex Chen (CS & Algorithms)' : 'Maya Patel (Physics & Calculus)'}</span>
                    {student?.id === id && <Check className="w-3.5 h-3.5 text-[#A17F3B]" />}
                  </button>
                ))}

                {/* Sign Out Button (when authenticated) */}
                {user && (
                  <div className="pt-2 mt-2 border-t border-[#E5E1D8]">
                    <button
                      onClick={() => {
                        signOut();
                        setStudentMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-serif text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out from Firebase</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#0D1B2A] hover:bg-[#F4F2EE] rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E5E1D8] bg-[#FAF9F7] px-6 py-4 space-y-2">
          {navTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left py-2.5 px-3 rounded-xl text-sm font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#F6F0E4] text-[#0D1B2A] font-bold'
                  : 'text-[#5A6065] hover:text-[#0D1B2A]'
              }`}
            >
              {tab.label}
            </button>
          ))}
          <div className="pt-3 border-t border-[#E5E1D8] space-y-2">
            {!user ? (
              <button
                onClick={() => {
                  signIn();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 bg-white text-[#0D1B2A] text-xs font-bold py-2.5 rounded-xl border border-[#E2DED6]"
              >
                <span>Sign In with Google</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  signOut();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 bg-rose-50 text-rose-700 text-xs font-bold py-2.5 rounded-xl border border-rose-200"
              >
                <span>Sign Out ({user.displayName || user.email})</span>
              </button>
            )}
            <button
              onClick={() => {
                setActiveTab('tutor');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center bg-[#0D1B2A] text-white text-xs font-bold uppercase tracking-wider py-3 rounded-xl"
            >
              LAUNCH AI TUTOR
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
