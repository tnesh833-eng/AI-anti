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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Lightbulb className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Personalized Learning Material & Recommendations
            </h2>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
            Synthesized dynamically based on diagnosed performance gaps in{' '}
            <strong className="text-indigo-300">{student?.preferredSubject}</strong>
          </p>
        </div>

        <button
          onClick={fetchRecommendations}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50 shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isLoading ? 'Synthesizing...' : 'Refresh AI Recommendations'}</span>
        </button>
      </div>

      {isLoading ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium text-slate-300">
            Analyzing student knowledge boundaries & building tailored study modules...
          </p>
        </div>
      ) : recommendations ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Interactive Flip Flashcards */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Adaptive Remedial Flashcards</h3>
                    <p className="text-xs text-slate-400">Click card to reveal concept rationale</p>
                  </div>
                </div>

                {recommendations.flashcards.length > 0 && (
                  <span className="text-xs font-semibold text-slate-400">
                    Card {activeCardIndex + 1} of {recommendations.flashcards.length}
                  </span>
                )}
              </div>

              {currentFlashcard ? (
                <div
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="cursor-pointer min-h-[220px] sm:min-h-[260px] rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-850 border border-slate-700 p-6 flex flex-col justify-between shadow-lg relative transition-all duration-300 hover:border-indigo-500/60"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-700 text-indigo-300 font-medium">
                      {currentFlashcard.subtopic}
                    </span>
                    <span className="text-indigo-400 text-[11px] font-semibold flex items-center gap-1">
                      <RotateCcw className="w-3 h-3" />
                      {isFlipped ? 'Answer Revealed' : 'Click to Flip'}
                    </span>
                  </div>

                  <div className="my-auto py-4">
                    {isFlipped ? (
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">
                          Target Solution & Core Principle:
                        </span>
                        <p className="text-sm sm:text-base text-slate-100 font-medium whitespace-pre-line leading-relaxed">
                          {currentFlashcard.back}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 block">
                          Diagnostic Challenge / Concept:
                        </span>
                        <p className="text-base sm:text-lg text-white font-semibold leading-relaxed">
                          {currentFlashcard.front}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="text-right text-[11px] text-slate-500">
                    Tap anywhere on the card to flip
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400">No flashcards available.</div>
              )}
            </div>

            {/* Flashcard navigation controls */}
            {recommendations.flashcards.length > 0 && (
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800">
                <button
                  disabled={activeCardIndex === 0}
                  onClick={() => {
                    setIsFlipped(false);
                    setActiveCardIndex((prev) => Math.max(0, prev - 1));
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-300 disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                {currentFlashcard && (
                  <button
                    onClick={() => {
                      setMasteredCards((prev) => ({
                        ...prev,
                        [currentFlashcard.id]: !prev[currentFlashcard.id],
                      }));
                    }}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      masteredCards[currentFlashcard.id]
                        ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500/50'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    {masteredCards[currentFlashcard.id] ? 'Marked Mastered' : 'Mark as Mastered'}
                  </button>
                )}

                <button
                  disabled={activeCardIndex === recommendations.flashcards.length - 1}
                  onClick={() => {
                    setIsFlipped(false);
                    setActiveCardIndex((prev) => Math.min(recommendations.flashcards.length - 1, prev + 1));
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-300 disabled:opacity-40 transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Bite-sized Study Guides & Remedial Plan */}
          <div className="lg:col-span-5 space-y-6">
            {/* Remedial Drill Plan */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">3-Step Remediation Plan</h3>
                  <p className="text-xs text-slate-400">Structured pathway to eliminate weak areas</p>
                </div>
              </div>

              <div className="space-y-3">
                {recommendations.remedialDrillPlan.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 bg-slate-800/60 border border-slate-700/60 rounded-xl p-3"
                  >
                    <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-slate-200 leading-relaxed font-medium">{step}</p>
                  </div>
                ))}
              </div>

              {student?.weakAreas && student.weakAreas.length > 0 && (
                <button
                  onClick={() => onLaunchRemedialQuiz(student.weakAreas[0].subtopic)}
                  className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-rose-600/30 hover:bg-rose-600/40 text-rose-200 border border-rose-500/40 transition-all"
                >
                  <Target className="w-4 h-4" />
                  <span>Launch 3-Q Focus Drill on {student.weakAreas[0].subtopic.slice(0, 18)}...</span>
                </button>
              )}
            </div>

            {/* Bite-Sized Study Guides */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Curated Micro Study Guides</h3>
                  <p className="text-xs text-slate-400">High-yield revision summaries</p>
                </div>
              </div>

              <div className="space-y-3">
                {recommendations.studyGuides.map((guide, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 transition-all hover:border-slate-600"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <h4 className="font-semibold text-xs text-white">{guide.title}</h4>
                      <span className="flex items-center gap-1 text-[11px] text-slate-400 shrink-0">
                        <Clock className="w-3 h-3 text-indigo-400" />
                        {guide.estimatedMinutes}m read
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mb-2 leading-relaxed">
                      💡 <strong>Core Takeaway:</strong> {guide.keyTakeaway}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-700/60 text-xs">
                      <span className="text-[11px] text-indigo-300 italic">
                        {guide.actionPrompt}
                      </span>
                      <button
                        onClick={() => onAskTutor(guide.title)}
                        className="text-indigo-400 hover:text-indigo-300 font-semibold text-xs shrink-0"
                      >
                        Ask Tutor →
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
