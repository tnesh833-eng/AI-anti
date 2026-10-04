import React from 'react';

interface LandingPageProps {
  onLaunchTutor: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchTutor }) => {
  return (
    <div className="flex-1 flex flex-col w-full">
      {/* HERO SECTION */}
      <section className="relative w-full overflow-hidden bg-surface py-16 md:py-24 border-b border-border">
        <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(#A17F3B_1px,transparent_1px)] [background-size:20px_20px]"></div>

        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-surface-card border border-brass-light/60 rounded-full mb-6 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-brass animate-pulse"></span>
              <span className="font-mono text-xs uppercase tracking-widest text-brass font-bold">The Scholastic AI Platform • NLP & Machine Learning</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-primary leading-tight font-medium mb-6">
              Where Classical Academic Rigor Meets <span className="italic text-brass font-normal">Adaptive Intelligence.</span>
            </h1>

            <p className="text-lg md:text-xl text-muted max-w-3xl leading-relaxed mb-8 font-serif">
              A personalized scholastic platform engineered for collegiate disciplines. Ask complex academic questions, receive immediate step-by-step Socratic explanations, test your comprehension via adaptive quizzes, and eliminate hidden weak areas.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
              <button onClick={onLaunchTutor} className="inline-flex items-center gap-2 bg-primary text-white font-medium px-8 py-3.5 rounded shadow-sm hover:bg-primary-hover transition-all text-sm tracking-wide">
                <span>Begin Socratic Inquiries</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
              <a href="#architecture" className="inline-flex items-center gap-2 bg-surface-card border border-border text-primary font-medium px-7 py-3.5 rounded shadow-2xs hover:bg-surface-low transition-all text-sm">
                <span className="material-symbols-outlined text-base text-brass">schema</span>
                <span>Explore System Architecture</span>
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-8 text-xs font-mono text-muted uppercase tracking-wider">
              <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-brass text-sm">verified</span> 140,000+ Questions Evaluated</span>
              <span className="text-border">•</span>
              <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-brass text-sm">timer</span> &lt; 420ms Socratic Latency</span>
              <span className="text-border">•</span>
              <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-brass text-sm">psychology</span> Bayesian Item Response Theory</span>
            </div>
          </div>

          {/* HERO INTERACTIVE WORKBENCH SHOWCASE */}
          <div className="w-full bg-surface-card rounded-xl border border-border shadow-lg p-6 lg:p-8">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="font-serif text-lg font-bold text-primary">Live Socratic Dialogue & Knowledge Mapping</span>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-surface-low border border-border text-muted">Session #4092 Active</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-brass font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span> 24/7 Inference Core Online
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left: Conversation Stream */}
              <div className="lg:col-span-7 flex flex-col space-y-4">
                {/* Student Query */}
                <div className="bg-surface-low rounded-lg p-4 border border-border">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs uppercase tracking-wider text-muted font-bold">Student Inquiry • Advanced Databases</span>
                    <span className="font-mono text-[11px] text-muted">14:02:18</span>
                  </div>
                  <p className="text-sm font-serif text-primary leading-relaxed">
                    "Why does a B+ Tree yield strictly superior scan and range-query performance compared to an in-memory Hash Index or standard binary search tree?"
                  </p>
                </div>

                {/* AI Socratic Tutor Response */}
                <div className="bg-brass-subtle/40 rounded-lg p-5 border border-brass-light/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-brass font-serif font-bold text-sm">
                      <span className="material-symbols-outlined text-base">auto_awesome</span>
                      <span>Socratic Step-by-Step Derivation</span>
                    </div>
                    <span className="font-mono text-[10px] bg-white border border-brass-light/40 px-2 py-0.5 rounded text-primary">Step 1 of 3</span>
                  </div>
                  <p className="text-sm font-serif text-primary leading-relaxed mb-3">
                    Observe the fundamental difference in disk page locality and block branching factors. In a B+ Tree, leaf nodes form a sequential doubly-linked list, and internal nodes pack hundreds of pointers into a single 4KB block:
                  </p>
                  <div className="bg-surface-card p-3 rounded border border-border font-mono text-xs text-primary leading-normal mb-3">
                    <span className="text-brass font-bold">// Range Scan Invariant</span><br/>
                    Range [K_min, K_max] = 1x Point Seek O(log_B N) + Leaf Chain Traversal O(M / B)<br/>
                    Hash Index = O(K) Discrete Random Reads &bull; Zero Ordering Guarantees
                  </div>
                  <div className="border-t border-brass-light/40 pt-2 flex items-center justify-between text-xs">
                    <span className="text-muted font-serif italic">Checkpoint: What occurs to the cache hit ratio during tree rebalancing?</span>
                    <span className="text-brass font-medium hover:underline cursor-pointer font-mono text-[11px]">Inspect Proof &rarr;</span>
                  </div>
                </div>
              </div>

              {/* Right: Knowledge Graph & Diagnostic State */}
              <div className="lg:col-span-5 bg-surface-low rounded-lg p-5 border border-border flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-serif text-sm font-bold text-primary">Adaptive IRT Mastery Projection</span>
                    <span className="font-mono text-xs font-bold text-brass bg-white px-2 py-0.5 rounded border border-border">&theta; = 1.94 (Top 3%)</span>
                  </div>
                  <p className="text-xs text-muted mb-4 font-serif">
                    Cognitive graph nodes tracked via Bayesian belief networks. Dynamic quizzes adapt problem difficulty automatically.
                  </p>

                  {/* Knowledge Graph SVG */}
                  <div className="bg-surface-card rounded p-3 border border-border flex items-center justify-center">
                    <svg className="w-full h-36" viewBox="0 0 300 130" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <line x1="50" y1="35" x2="150" y2="35" stroke="#E2DED6" strokeWidth="2"/>
                      <line x1="150" y1="35" x2="250" y2="35" stroke="#E2DED6" strokeWidth="2"/>
                      <line x1="150" y1="35" x2="100" y2="95" stroke="#A17F3B" strokeWidth="2" strokeDasharray="3 3"/>
                      <line x1="150" y1="35" x2="200" y2="95" stroke="#A17F3B" strokeWidth="2"/>

                      {/* Node 1 */}
                      <circle cx="50" cy="35" r="14" fill="#F4F2EE" stroke="#0D1B2A" strokeWidth="2"/>
                      <text x="50" y="39" fontSize="9" fontFamily="Inter" textAnchor="middle" fill="#0D1B2A" fontWeight="bold">B-Tree</text>
                      
                      {/* Node 2 */}
                      <circle cx="150" cy="35" r="16" fill="#F6F0E4" stroke="#A17F3B" strokeWidth="2"/>
                      <text x="150" y="39" fontSize="9" fontFamily="Inter" textAnchor="middle" fill="#A17F3B" fontWeight="bold">B+ Index</text>
                      
                      {/* Node 3 */}
                      <circle cx="250" cy="35" r="14" fill="#F4F2EE" stroke="#E2DED6" strokeWidth="2"/>
                      <text x="250" y="39" fontSize="9" fontFamily="Inter" textAnchor="middle" fill="#5A6065">LSM Tree</text>

                      {/* Node 4 (Weak area) */}
                      <circle cx="100" cy="95" r="15" fill="#FEE2E2" stroke="#EF4444" strokeWidth="2"/>
                      <text x="100" y="99" fontSize="9" fontFamily="Inter" textAnchor="middle" fill="#B91C1C" fontWeight="bold">Node Split</text>
                      
                      {/* Node 5 */}
                      <circle cx="200" cy="95" r="15" fill="#ECFDF5" stroke="#10B981" strokeWidth="2"/>
                      <text x="200" y="99" fontSize="9" fontFamily="Inter" textAnchor="middle" fill="#047857" fontWeight="bold">Scan Speed</text>
                    </svg>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs font-mono">
                  <span className="text-rose-700 font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">warning</span> Auto-Remediation Queued
                  </span>
                  <button onClick={onLaunchTutor} className="text-primary font-bold hover:text-brass transition-colors">Launch 10-Min Quiz &rarr;</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: SYSTEM ABSTRACT & THREE CORE PILLARS */}
      <section className="w-full bg-surface-low py-16 border-b border-border">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          {/* Abstract Quote Card */}
          <div className="bg-surface-card rounded-xl p-8 lg:p-12 border border-border shadow-xs mb-12">
            <div className="flex items-center gap-2 mb-4">
              <span className="font-mono text-xs uppercase tracking-widest text-brass font-bold">PROJECT SPECIFICATION ABSTRACT</span>
            </div>
            <blockquote className="font-serif text-xl md:text-2xl text-primary italic leading-relaxed mb-6">
              "The Intelligent Tutor is an AI-based learning system that provides personalized learning assistance to students. It allows students to ask questions and receive instant explanations and answers using NLP and Machine Learning. It can also conduct quizzes, evaluate student performance, recommend learning materials, and identify weak areas."
            </blockquote>
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border text-xs font-mono text-muted">
              <span>Core Objective: Make learning interactive, personalized, and available anytime.</span>
              <span className="text-primary font-bold">Undergraduate & Graduate Academic Platform</span>
            </div>
          </div>

          {/* 3 Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface-card rounded-xl p-6 border border-border shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-baseline justify-between mb-4">
                  <span className="font-serif text-3xl font-bold text-brass">01</span>
                  <span className="material-symbols-outlined text-muted text-2xl">chat_bubble</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-primary mb-2">Instant Natural Language Comprehension</h3>
                <p className="text-sm text-muted leading-relaxed font-serif">
                  NLP pipelines interpret student inquiries, resolve nuances, deconstruct misconceptions, and deliver immediate proofs and explanations without latency.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-mono text-muted">
                <span>Python & Transformer Core</span>
                <span className="text-brass font-semibold">Real-Time Synthesis</span>
              </div>
            </div>

            <div className="bg-surface-card rounded-xl p-6 border border-border shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-baseline justify-between mb-4">
                  <span className="font-serif text-3xl font-bold text-brass">02</span>
                  <span className="material-symbols-outlined text-muted text-2xl">quiz</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-primary mb-2">Adaptive Quizzes & Calibration</h3>
                <p className="text-sm text-muted leading-relaxed font-serif">
                  Machine learning models continuously evaluate student response logs, dynamically scaling question difficulty based on individual grasp and past accuracy.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-mono text-muted">
                <span>Item Response Theory</span>
                <span className="text-brass font-semibold">Dynamic &theta; Curves</span>
              </div>
            </div>

            <div className="bg-surface-card rounded-xl p-6 border border-border shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-baseline justify-between mb-4">
                  <span className="font-serif text-3xl font-bold text-brass">03</span>
                  <span className="material-symbols-outlined text-muted text-2xl">healing</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-primary mb-2">Automated Weak Area Remediation</h3>
                <p className="text-sm text-muted leading-relaxed font-serif">
                  Identifies prerequisite knowledge gaps before they derail comprehension. Automatically suggests targeted review lessons and tailored problem sandboxes.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-mono text-muted">
                <span>Diagnostic Graph Tracing</span>
                <span className="text-brass font-semibold">Targeted Practice</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: CALL TO ACTION BANNER */}
      <section className="w-full bg-primary text-white py-16">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-brass-light font-bold">24/7 SCHOLASTIC ACCESS</span>
            <h2 className="font-serif text-3xl md:text-4xl font-medium mt-1 mb-2">Begin Your Personalized Academic Study</h2>
            <p className="text-surface-low/80 text-sm max-w-xl font-serif">
              Engage with our Socratic AI model, take your initial adaptive diagnostic evaluation, and track concept mastery in real time.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onLaunchTutor} className="bg-brass-light hover:bg-brass text-primary font-semibold px-6 py-3 rounded text-sm transition-colors shadow-sm">
              Launch AI Tutor
            </button>
            <button className="border border-white/20 hover:bg-white/10 text-white font-medium px-6 py-3 rounded text-sm transition-colors">
              Open Dashboard
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
