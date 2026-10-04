/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Zap,
  Target,
  Brain,
  Award,
  Layers,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';

interface LandingPageProps {
  onLaunchTutor: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchTutor }) => {
  return (
    <div className="flex-1 flex flex-col w-full">
      {/* HERO SECTION */}
      <section className="relative w-full overflow-hidden bg-surface py-16 md:py-24 border-b border-border">
        {/* Subtle Constellation Grid Background */}
        <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(#A17F3B_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-surface-card border border-brass-light/70 rounded-full mb-6 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-brass animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-widest text-brass font-bold">
                The Scholastic AI Platform &bull; NLP & Machine Learning
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-primary leading-tight font-medium mb-6">
              Where Classical Academic Rigor Meets <span className="italic text-brass font-normal">Adaptive Intelligence.</span>
            </h1>

            <p className="text-lg md:text-xl text-muted max-w-3xl leading-relaxed mb-8 font-serif">
              A personalized scholastic platform engineered for collegiate disciplines. Ask complex academic questions, receive step-by-step Socratic derivations, test comprehension with adaptive quizzes, and systematically eliminate diagnosed weak areas.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
              <button
                onClick={onLaunchTutor}
                className="inline-flex items-center gap-2 bg-primary text-white font-serif uppercase tracking-wider px-8 py-3.5 rounded-xl shadow-xs hover:bg-primary-hover transition-all text-sm font-semibold cursor-pointer border border-brass/40"
              >
                <span>Begin Socratic Inquiries</span>
                <ArrowRight className="w-4 h-4 text-brass-light" />
              </button>
              <a
                href="#architecture"
                className="inline-flex items-center gap-2 bg-surface-card border border-border text-primary font-serif px-7 py-3.5 rounded-xl shadow-2xs hover:bg-surface-low transition-all text-sm font-semibold cursor-pointer"
              >
                <Layers className="w-4 h-4 text-brass" />
                <span>Explore System Architecture</span>
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-8 text-xs font-mono text-muted uppercase tracking-wider">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-brass" /> 140,000+ Questions Evaluated
              </span>
              <span className="text-border">&bull;</span>
              <span className="flex items-center gap-1.5 font-medium">
                <Zap className="w-4 h-4 text-brass" /> &lt; 380ms Socratic Latency
              </span>
              <span className="text-border">&bull;</span>
              <span className="flex items-center gap-1.5 font-medium">
                <Brain className="w-4 h-4 text-brass" /> Bayesian Knowledge Tracing
              </span>
            </div>
          </div>

          {/* HERO INTERACTIVE WORKBENCH SHOWCASE (Classical Light Aesthetic) */}
          <div id="architecture" className="w-full bg-surface-card rounded-2xl border border-border shadow-sm p-6 lg:p-8">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="font-serif text-lg font-bold text-primary">Live Socratic Dialogue & Knowledge Mapping</span>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-surface-low border border-border text-muted">
                  Session #4092 Active
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-brass font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>24/7 Inference Core Online</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left: Conversation Stream */}
              <div className="lg:col-span-7 flex flex-col space-y-4">
                {/* Student Query */}
                <div className="bg-surface-low rounded-xl p-4 border border-border">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs uppercase tracking-wider text-muted font-bold">
                      Student Inquiry &bull; Advanced Algorithms
                    </span>
                    <span className="font-mono text-[11px] text-muted">14:02:18</span>
                  </div>
                  <p className="text-sm font-serif text-primary leading-relaxed">
                    "Why does a recursive function cause a Stack Overflow if there is no terminating condition, and how does the OS call stack track execution frames?"
                  </p>
                </div>

                {/* AI Socratic Response */}
                <div className="bg-brass-subtle/50 rounded-xl p-5 border border-brass-light/70 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-brass font-serif font-bold text-sm">
                      <Sparkles className="w-4 h-4 text-brass" />
                      <span>Socratic Step-by-Step Derivation</span>
                    </div>
                    <span className="font-mono text-[10px] bg-surface-card border border-brass-light/60 px-2 py-0.5 rounded text-primary font-bold">
                      Step 1 of 3
                    </span>
                  </div>
                  <p className="text-sm font-serif text-primary leading-relaxed mb-3">
                    Consider how the CPU tracks function execution. Every invocation pushes an independent <strong>activation record (stack frame)</strong> containing parameters and return pointers onto the thread call stack:
                  </p>
                  <div className="bg-surface-card p-3 rounded-lg border border-border font-mono text-xs text-primary leading-normal mb-3">
                    <span className="text-brass font-bold">// Thread Call Stack Memory Model</span><br />
                    Stack Frame [n=3] &rarr; Stack Frame [n=2] &rarr; Stack Frame [n=1] ...<br />
                    Limit Reached: java.lang.StackOverflowError (Thread Stack Memory Exhausted)
                  </div>
                  <div className="border-t border-brass-light/40 pt-2 flex items-center justify-between text-xs font-serif">
                    <span className="text-muted italic">Checkpoint: What prevents this memory exhaustion in iterative loops?</span>
                    <button
                      onClick={onLaunchTutor}
                      className="text-brass hover:text-primary font-serif font-medium font-mono text-xs cursor-pointer"
                    >
                      Ask Tutor &rarr;
                    </button>
                  </div>
                </div>
              </div>

              {/* Right: Knowledge Graph & Diagnostic State */}
              <div className="lg:col-span-5 bg-surface-low rounded-xl p-5 border border-border flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-serif font-bold text-sm text-primary">Student Competency Telemetry</span>
                    <span className="font-mono text-[10px] uppercase text-brass bg-brass-subtle border border-brass-light/60 px-2 py-0.5 rounded font-bold">
                      Dynamic State
                    </span>
                  </div>

                  <div className="space-y-3 font-serif">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-primary font-medium">Recursion Call Stack Mechanics</span>
                        <span className="font-mono text-rose-700 font-bold">42% (Diagnosed Gap)</span>
                      </div>
                      <div className="w-full bg-surface-card h-1.5 rounded-full overflow-hidden border border-border/70">
                        <div className="bg-rose-600 h-full w-[42%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-primary font-medium">Asymptotic Time Complexity</span>
                        <span className="font-mono text-brass font-bold">74% (Competent)</span>
                      </div>
                      <div className="w-full bg-surface-card h-1.5 rounded-full overflow-hidden border border-border/70">
                        <div className="bg-brass h-full w-[74%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-primary font-medium">Data Structures & Graph Theory</span>
                        <span className="font-mono text-emerald-700 font-bold">85% (Proficient)</span>
                      </div>
                      <div className="w-full bg-surface-card h-1.5 rounded-full overflow-hidden border border-border/70">
                        <div className="bg-emerald-600 h-full w-[85%]" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-card p-3 rounded-lg border border-border text-xs font-serif space-y-1">
                  <div className="font-bold text-rose-800 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-rose-700" />
                    <span>Active Diagnostic Remediation:</span>
                  </div>
                  <p className="text-muted leading-relaxed text-[11px]">
                    Identified fragile boundary around base-case induction. Tailored remedial focus drill calibrated in the Adaptive Quizzes tab.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 CORE PILLARS SECTION */}
      <section className="py-16 bg-surface max-w-[1440px] mx-auto px-6 lg:px-12 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="font-mono text-xs uppercase tracking-widest text-brass font-bold block mb-2">
            The Three Scholastic Pillars
          </span>
          <h2 className="font-serif text-3xl font-bold text-primary">
            Engineered for Deeper Conceptual Mastery
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-surface-card border border-border rounded-2xl p-6 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-brass-subtle border border-brass-light/70 flex items-center justify-center text-brass shadow-2xs">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-primary">Socratic NLP Tutoring</h3>
            <p className="font-serif text-sm text-muted leading-relaxed">
              Instead of providing answers immediately, the tutor engages in dialogue that questions assumptions, checks foundational definitions, and guides you to solutions.
            </p>
          </div>

          <div className="bg-surface-card border border-border rounded-2xl p-6 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-brass-subtle border border-brass-light/70 flex items-center justify-center text-brass shadow-2xs">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-primary">Adaptive Diagnostic Quizzes</h3>
            <p className="font-serif text-sm text-muted leading-relaxed">
              Questions calibrate in real-time. Missed options are immediately mapped to underlying misconceptions, triggering targeted remedial drills.
            </p>
          </div>

          <div className="bg-surface-card border border-border rounded-2xl p-6 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-brass-subtle border border-brass-light/70 flex items-center justify-center text-brass shadow-2xs">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-primary">Automated Student Modeling</h3>
            <p className="font-serif text-sm text-muted leading-relaxed">
              Bayesian knowledge tracing continuously computes topic mastery, honors quiz streaks with academic medals, and generates official PDF progress reports.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
