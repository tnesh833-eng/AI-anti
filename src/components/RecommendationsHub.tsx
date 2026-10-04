/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Lightbulb,
  BookOpen,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  Compass,
  Zap,
  Target,
  Brain,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import { Flashcard, RecommendationsData, StudentProfile } from '../types.ts';

interface RecommendationsHubProps {
  student: StudentProfile | null;
  onLaunchRemedialQuiz: (topic: string) => void;
  onAskTutor: (topic: string) => void;
}

export const RecommendationsHub: React.FC<RecommendationsHubProps> = ({
  student,
  onLaunchRemedialQuiz,
  onAskTutor,
}) => {
  const [recommendations, setRecommendations] = useState<RecommendationsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCards, setMasteredCards] = useState<Record<string, boolean>>({});

  const fetchRecommendations = async () => {
    setIsLoading(true);
    setIsFlipped(false);
    setActiveCardIndex(0);

    const weakAreas = student?.weakAreas.map((w) => w.subtopic) || [];
    try {
      const res = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: student?.preferredSubject || 'Computer Science',
          weakAreas,
        }),
      });
      const data = await res.json();
      if (data.success && data.recommendations) {
        setRecommendations(data.recommendations);
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [student?.id]);

  const currentFlashcard: Flashcard | undefined = recommendations?.flashcards[activeCardIndex];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Classical Academic Header Banner */}
      <div className="bg-surface-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-brass-subtle border border-brass-light/70 flex items-center justify-center text-brass shadow-2xs shrink-0">
            <Lightbulb className="w-6 h-6 fill-brass/20" />
          </div>
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary tracking-tight">
              Personalized Remedial Curriculum & Study Guides
            </h2>
            <p className="text-muted font-serif text-xs sm:text-sm mt-0.5">
              Targeted cognitive synthesis calibrated from diagnosed performance gaps in{' '}
              <strong className="text-brass font-semibold">{student?.preferredSubject}</strong>
            </p>
          </div>
        </div>

        <button
          onClick={fetchRecommendations}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-serif font-semibold bg-primary hover:bg-primary-hover active:scale-95 text-white shadow-xs border border-brass/50 transition-all disabled:opacity-50 shrink-0 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-brass-light" />
          <span>{isLoading ? 'Synthesizing Curricula...' : 'Refresh AI Recommendations'}</span>
        </button>
      </div>

      {isLoading ? (
        <div className="bg-surface-card border border-border rounded-2xl p-12 text-center text-muted space-y-3 font-serif shadow-sm">
          <div className="w-8 h-8 border-3 border-brass border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium text-primary">
            Analyzing student Bayesian knowledge boundaries & compiling tailored study guides...
          </p>
        </div>
      ) : recommendations ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Interactive Scholastic Flip Flashcards (7 Columns) */}
          <div className="lg:col-span-7 bg-surface-card border border-border rounded-2xl p-6 sm:p-7 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brass-subtle border border-brass-light/70 text-brass flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-primary leading-tight">
                      Adaptive Remedial Flashcards
                    </h3>
                    <p className="font-serif text-xs text-muted mt-0.5">
                      Click the index card to flip and verify first-principles rationale
                    </p>
                  </div>
                </div>

                {recommendations.flashcards.length > 0 && (
                  <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded bg-surface-low border border-border text-muted">
                    Card {activeCardIndex + 1} of {recommendations.flashcards.length}
                  </span>
                )}
              </div>

              {currentFlashcard ? (
                <div
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="cursor-pointer min-h-[250px] sm:min-h-[280px] rounded-2xl bg-surface-low border border-border hover:border-brass/70 p-6 sm:p-8 flex flex-col justify-between shadow-2xs relative transition-all duration-300"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[11px] font-bold px-2.5 py-1 rounded bg-brass-subtle border border-brass-light/70 text-brass uppercase tracking-wider">
                      {currentFlashcard.subtopic}
                    </span>
                    <span className="font-mono text-xs text-brass font-semibold flex items-center gap-1">
                      <RotateCcw className="w-3.5 h-3.5" />
                      {isFlipped ? 'Rationale Revealed' : 'Click to Flip'}
                    </span>
                  </div>

                  <div className="my-auto py-5">
                    {isFlipped ? (
                      <div className="space-y-2.5 bg-surface-card p-5 rounded-xl border border-border shadow-2xs">
                        <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Target Conceptual Solution & Derivation:
                        </span>
                        <p className="font-serif text-sm sm:text-base text-primary whitespace-pre-line leading-relaxed">
                          {currentFlashcard.back}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-brass block">
                          Diagnostic Challenge / Socratic Inquiry:
                        </span>
                        <p className="font-serif text-lg sm:text-xl text-primary font-bold leading-relaxed">
                          {currentFlashcard.front}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border/80 text-xs font-serif text-muted">
                    <span>💡 Tip: Test recall before flipping</span>
                    <span className="font-mono text-[11px] text-brass">Interactive Scholastic Index Card</span>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-muted font-serif">No remedial flashcards available.</div>
              )}
            </div>

            {/* Flashcard navigation controls */}
            {recommendations.flashcards.length > 0 && (
              <div className="flex items-center justify-between pt-5 mt-5 border-t border-border">
                <button
                  disabled={activeCardIndex === 0}
                  onClick={() => {
                    setIsFlipped(false);
                    setActiveCardIndex((prev) => Math.max(0, prev - 1));
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-serif font-semibold bg-surface-low hover:bg-surface border border-border text-primary disabled:opacity-40 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 text-muted" />
                  Previous Card
                </button>

                {currentFlashcard && (
                  <button
                    onClick={() => {
                      setMasteredCards((prev) => ({
                        ...prev,
                        [currentFlashcard.id]: !prev[currentFlashcard.id],
                      }));
                    }}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-serif font-semibold border transition-all cursor-pointer ${
                      masteredCards[currentFlashcard.id]
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs'
                        : 'bg-surface-low text-muted border-border hover:text-primary hover:bg-surface'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>{masteredCards[currentFlashcard.id] ? 'Conferred Mastered' : 'Mark as Mastered'}</span>
                  </button>
                )}

                <button
                  disabled={activeCardIndex === recommendations.flashcards.length - 1}
                  onClick={() => {
                    setIsFlipped(false);
                    setActiveCardIndex((prev) => Math.min(recommendations.flashcards.length - 1, prev + 1));
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-serif font-semibold bg-surface-low hover:bg-surface border border-border text-primary disabled:opacity-40 transition-colors cursor-pointer"
                >
                  Next Card
                  <ChevronRight className="w-4 h-4 text-muted" />
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Bite-sized Study Guides & Remedial Plan (5 Columns) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Remedial Drill Plan */}
            <div className="bg-surface-card border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
                <div className="w-9 h-9 rounded-xl bg-brass-subtle border border-brass-light/70 text-brass flex items-center justify-center shrink-0">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-primary leading-tight">
                    3-Step Remediation Pathway
                  </h3>
                  <p className="font-serif text-xs text-muted mt-0.5">
                    Structured roadmap to eliminate diagnosed misconceptions
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {recommendations.remedialDrillPlan.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 bg-surface-low border border-border rounded-xl p-3.5"
                  >
                    <span className="w-6 h-6 rounded-lg bg-primary text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      {idx + 1}
                    </span>
                    <p className="font-serif text-xs sm:text-sm text-primary leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>

              {student?.weakAreas && student.weakAreas.length > 0 && (
                <button
                  onClick={() => onLaunchRemedialQuiz(student.weakAreas[0].subtopic)}
                  className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-serif font-semibold bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 transition-all cursor-pointer shadow-2xs"
                >
                  <Target className="w-4 h-4 text-rose-600" />
                  <span>Launch 3-Q Focus Drill on {student.weakAreas[0].subtopic.slice(0, 22)}...</span>
                </button>
              )}
            </div>

            {/* Curated Micro Study Guides */}
            <div className="bg-surface-card border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
                <div className="w-9 h-9 rounded-xl bg-brass-subtle border border-brass-light/70 text-brass flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-primary leading-tight">
                    Curated Micro Study Guides
                  </h3>
                  <p className="font-serif text-xs text-muted mt-0.5">
                    High-yield revision summaries and theoretical principles
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {recommendations.studyGuides.map((guide, idx) => (
                  <div
                    key={idx}
                    className="bg-surface-low border border-border rounded-xl p-4 transition-all hover:border-brass/70 shadow-2xs"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <h4 className="font-serif font-bold text-sm text-primary">{guide.title}</h4>
                      <span className="flex items-center gap-1 font-mono text-[11px] text-muted shrink-0">
                        <Clock className="w-3 h-3 text-brass" />
                        {guide.estimatedMinutes}m read
                      </span>
                    </div>

                    <p className="font-serif text-xs text-muted mb-2.5 leading-relaxed">
                      💡 <strong>Core Takeaway:</strong> <span className="text-primary">{guide.keyTakeaway}</span>
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-border text-xs">
                      <span className="font-serif text-[11px] text-muted italic">
                        {guide.actionPrompt}
                      </span>
                      <button
                        onClick={() => onAskTutor(guide.title)}
                        className="font-serif font-bold text-xs text-brass hover:text-primary flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                      >
                        <Brain className="w-3.5 h-3.5" />
                        <span>Ask Tutor &rarr;</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
