import React from 'react';
import { StudentProfile } from '../types.ts';

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
}) => {
  return (
    <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur border-b border-border">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
          {/* Logo SVG: Owl + Open Book + Shield */}
          <svg width="44" height="48" viewBox="0 0 44 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Shield outline */}
            <path d="M22 2L4 9V24C4 33.9 12.1 43.1 22 46C31.9 43.1 40 33.9 40 24V9L22 2Z" fill="#FAF9F7" stroke="#A17F3B" strokeWidth="1.5"/>
            {/* Open Book */}
            <path d="M10 28 Q22 24 22 24 Q22 24 34 28 L34 36 Q22 32 22 32 Q22 32 10 36 Z" fill="#0D1B2A" opacity="0.9"/>
            <path d="M10 28 L10 36" stroke="#A17F3B" strokeWidth="1" strokeLinecap="round"/>
            <path d="M34 28 L34 36" stroke="#A17F3B" strokeWidth="1" strokeLinecap="round"/>
            <line x1="22" y1="24" x2="22" y2="32" stroke="#A17F3B" strokeWidth="1"/>
            {/* Book constellation dots left */}
            <circle cx="15" cy="30" r="1" fill="#A17F3B"/>
            <circle cx="13" cy="33" r="1" fill="#A17F3B"/>
            <circle cx="18" cy="34" r="1" fill="#A17F3B"/>
            <line x1="15" y1="30" x2="13" y2="33" stroke="#A17F3B" strokeWidth="0.6" opacity="0.7"/>
            <line x1="13" y1="33" x2="18" y2="34" stroke="#A17F3B" strokeWidth="0.6" opacity="0.7"/>
            <line x1="15" y1="30" x2="18" y2="34" stroke="#A17F3B" strokeWidth="0.6" opacity="0.7"/>
            {/* Book constellation dots right */}
            <circle cx="27" cy="30" r="1" fill="#A17F3B"/>
            <circle cx="30" cy="33" r="1" fill="#A17F3B"/>
            <circle cx="25" cy="34" r="1" fill="#A17F3B"/>
            <line x1="27" y1="30" x2="30" y2="33" stroke="#A17F3B" strokeWidth="0.6" opacity="0.7"/>
            <line x1="30" y1="33" x2="25" y2="34" stroke="#A17F3B" strokeWidth="0.6" opacity="0.7"/>
            <line x1="27" y1="30" x2="25" y2="34" stroke="#A17F3B" strokeWidth="0.6" opacity="0.7"/>
            {/* Owl body */}
            <ellipse cx="22" cy="18" rx="7" ry="8" fill="#A17F3B"/>
            {/* Owl ears */}
            <path d="M16 12 L14 7 L18 11Z" fill="#A17F3B"/>
            <path d="M28 12 L30 7 L26 11Z" fill="#A17F3B"/>
            {/* Owl eyes */}
            <circle cx="19" cy="17" r="3" fill="#FAF9F7"/>
            <circle cx="25" cy="17" r="3" fill="#FAF9F7"/>
            <circle cx="19.5" cy="17" r="1.6" fill="#0D1B2A"/>
            <circle cx="25.5" cy="17" r="1.6" fill="#0D1B2A"/>
            <circle cx="19.8" cy="16.5" r="0.6" fill="white"/>
            <circle cx="25.8" cy="16.5" r="0.6" fill="white"/>
            {/* Owl beak */}
            <path d="M21 20 L22 22 L23 20Z" fill="#0D1B2A"/>
            {/* Constellation lines on owl wings */}
            <circle cx="10" cy="18" r="1" fill="#A17F3B" opacity="0.6"/>
            <circle cx="7" cy="15" r="0.8" fill="#A17F3B" opacity="0.5"/>
            <line x1="16" y1="18" x2="10" y2="18" stroke="#A17F3B" strokeWidth="0.7" opacity="0.5"/>
            <line x1="10" y1="18" x2="7" y2="15" stroke="#A17F3B" strokeWidth="0.7" opacity="0.5"/>
            <circle cx="34" cy="18" r="1" fill="#A17F3B" opacity="0.6"/>
            <circle cx="37" cy="15" r="0.8" fill="#A17F3B" opacity="0.5"/>
            <line x1="28" y1="18" x2="34" y2="18" stroke="#A17F3B" strokeWidth="0.7" opacity="0.5"/>
            <line x1="34" y1="18" x2="37" y2="15" stroke="#A17F3B" strokeWidth="0.7" opacity="0.5"/>
          </svg>

          <div className="flex flex-col">
            <span style={{fontFamily: "'EB Garamond', serif"}} className="text-lg tracking-tight font-bold uppercase text-primary leading-tight">INTELLIGENT TUTOR</span>
            <span style={{fontFamily: "'JetBrains Mono', monospace"}} className="text-[10px] tracking-widest uppercase text-brass font-semibold">AI-POWERED SCHOLASTIC ASSISTANT</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button 
            onClick={() => setActiveTab('home')} 
            className={`${activeTab === 'home' ? 'text-primary font-semibold relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-brass' : 'text-muted hover:text-primary transition-colors py-1'}`}>
            Landing / Home
          </button>
          <button 
            onClick={() => setActiveTab('tutor')} 
            className={`${activeTab === 'tutor' ? 'text-primary font-semibold relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-brass' : 'text-muted hover:text-primary transition-colors py-1'}`}>
            Interactive AI Tutor
          </button>
          <button 
            onClick={() => setActiveTab('quiz')} 
            className={`${activeTab === 'quiz' ? 'text-primary font-semibold relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-brass' : 'text-muted hover:text-primary transition-colors py-1'}`}>
            Adaptive Quizzes
          </button>
          <button 
            onClick={() => setActiveTab('analytics')} 
            className={`${activeTab === 'analytics' ? 'text-primary font-semibold relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-brass' : 'text-muted hover:text-primary transition-colors py-1'}`}>
            System Architecture
          </button>
        </nav>

        <div className="flex items-center gap-4">
          <button onClick={() => setActiveTab('tutor')} className="hidden sm:inline-flex items-center justify-center bg-primary text-white text-xs font-semibold uppercase tracking-wider px-5 py-2.5 rounded hover:bg-primary-hover transition-colors shadow-sm">
            Launch AI Tutor
          </button>
          <img src="https://lh3.googleusercontent.com/aida/AEtjO1VQp42nJsqSdTyuAGeRbj0F79hidjZaji-woxvGewclpr4E44hcTUVgLzwWOCYb0K55zG0iQxwjZy7Cc8Psr70ePraStMxrV13I9VPL-__wtfgbwLyB3gK44yCjqZBj-GCP2vfYK55FJJSdALRxI9i1S2Jg1xeXbEoUdI7IT4A5slPQax1sPS2W973kI9Fte-mjA-1chy1C3G6WJvpLwcgRotJOhA03Qw2zPWYLFpwGrm9pF_3oUSjgBXhl" alt="Scholar Portrait" className="w-9 h-9 rounded-full object-cover border border-brass-light/70 shadow-xs"/>
        </div>
      </div>
    </header>
  );
};
