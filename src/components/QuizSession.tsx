/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Sparkles,
  Trophy,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Zap,
  Target,
  Brain,
  Award,
} from 'lucide-react';
import { QuizQuestion, StudentProfile } from '../types.ts';

interface QuizSessionProps {
  student: StudentProfile | null;
  initialSubject?: string;
  initialTopic?: string;
  onQuizCompleted: () => void;
  onAskTutorAboutMistake: (questionText: string, explanation: string) => void;
}

export const QuizSession: React.FC<QuizSessionProps> = ({
  student,
  initialSubject,
  initialTopic,
  onQuizCompleted,
  onAskTutorAboutMistake,
}) => {
  // Setup State
  const [selectedSubject, setSelectedSubject] = useState(initialSubject || student?.preferredSubject || 'Computer Science');
  const [selectedTopic, setSelectedTopic] = useState(initialTopic || '');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [focusOnWeakAreas, setFocusOnWeakAreas] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  // Active Quiz State
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  // Evaluation & Completion State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizResults, setQuizResults] = useState<any | null>(null);

  const startQuiz = async () => {
    setIsGenerating(true);
    setQuizResults(null);
    setSelectedAnswers({});
    setCurrentIndex(0);
    setShowExplanation(false);
    setShowHint(false);

    try {
      const response = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: selectedSubject,
          topic: selectedTopic || `${selectedSubject} Core Competencies`,
          difficulty,
          questionCount: 4,
          focusOnWeakAreas,
        }),
      });

      const data = await response.json();
      if (data.success && data.quiz?.questions?.length > 0) {
        setQuestions(data.quiz.questions);
        setStartTime(Date.now());
      } else {
        throw new Error(data.message || 'Failed to generate quiz');
      }
    } catch (err) {
      console.error('Quiz generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectOption = (optionIndex: number) => {
    if (showExplanation) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIndex,
    }));
  };

  const handleCheckAnswer = () => {
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    setShowExplanation(false);
    setShowHint(false);
    if (questions && currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    if (!questions) return;
    setIsSubmitting(true);

    const elapsedSeconds = startTime ? Math.round((Date.now() - startTime) / 1000) : 90;

    const answerPayload = questions.map((q, idx) => ({
      questionId: q.id,
      question: q.question,
      subtopic: q.subtopic,
      selectedAnswerIndex: selectedAnswers[idx] ?? -1,
      correctAnswerIndex: q.correctAnswerIndex,
      explanation: q.explanation,
    }));

    try {
      const res = await fetch('/api/quiz/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId: `quiz-${Date.now()}`,
          subject: selectedSubject,
          topic: selectedTopic || `${selectedSubject} Assessment`,
          answers: answerPayload,
          timeSpentSeconds: elapsedSeconds,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setQuizResults(data.evaluation);
        onQuizCompleted();
      }
    } catch (err) {
      console.error('Error submitting quiz evaluation:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1. If viewing Quiz Results (Classical Light Styling)
  if (quizResults) {
    const isPassing = quizResults.percentage >= 70;
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-surface-card border border-border rounded-2xl p-6 sm:p-10 shadow-sm space-y-6">
          {/* Header Seal */}
          <div className="text-center pb-6 border-b border-border">
            <div
              className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-3 shadow-xs border ${
                isPassing
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              <Trophy className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-3xl font-bold text-primary">
              {isPassing ? 'Diagnostic Benchmark Achieved' : 'Diagnostic Evaluation Complete'}
            </h2>
            <p className="text-muted text-sm mt-1 font-serif">
              {selectedSubject} &bull; {selectedTopic || 'Adaptive Assessment'}
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-surface-low border border-border rounded-xl p-3 text-center">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted block">Score</span>
              <span className="font-serif text-2xl font-bold text-primary">
                {quizResults.score} / {quizResults.totalQuestions}
              </span>
            </div>
            <div className="bg-surface-low border border-border rounded-xl p-3 text-center">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted block">Accuracy</span>
              <span className={`font-serif text-2xl font-bold ${isPassing ? 'text-emerald-700' : 'text-amber-700'}`}>
                {quizResults.percentage}%
              </span>
            </div>
            <div className="bg-surface-low border border-border rounded-xl p-3 text-center">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted block">Time Spent</span>
              <span className="font-serif text-2xl font-bold text-primary">{quizResults.timeSpentSeconds}s</span>
            </div>
            <div className="bg-surface-low border border-border rounded-xl p-3 text-center">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted block">XP Earned</span>
              <span className="font-serif text-2xl font-bold text-brass">+{quizResults.percentage * 2} XP</span>
            </div>
          </div>

          {/* AI Pedagogical Evaluation Feedback */}
          {quizResults.aiFeedback && (
            <div className="bg-brass-subtle/50 border border-brass-light/60 rounded-xl p-5 shadow-2xs">
              <div className="flex items-center gap-2 text-brass font-serif font-bold text-sm mb-2">
                <Sparkles className="w-4 h-4 text-brass" />
                <span>Pedagogical Diagnostic Feedback</span>
              </div>
              <p className="font-serif text-primary text-sm leading-relaxed whitespace-pre-wrap">
                {quizResults.aiFeedback}
              </p>
            </div>
          )}

          {/* Question Breakdown */}
          <div className="pt-2">
            <h3 className="font-serif text-lg font-bold text-primary mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-brass" />
              <span>Detailed Question Analysis</span>
            </h3>
            <div className="space-y-3">
              {questions?.map((q, idx) => {
                const selected = selectedAnswers[idx];
                const isCorrect = selected === q.correctAnswerIndex;
                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border text-sm ${
                      isCorrect
                        ? 'bg-emerald-50/50 border-emerald-200'
                        : 'bg-rose-50/40 border-rose-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                        <span className="font-serif font-bold text-primary">
                          Q{idx + 1}: {q.question}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-surface border border-border text-muted shrink-0">
                        {q.subtopic}
                      </span>
                    </div>

                    <div className="mt-2 text-xs font-serif text-muted space-y-1">
                      <p>
                        Your Answer:{' '}
                        <span className={isCorrect ? 'text-emerald-700 font-semibold' : 'text-rose-700 font-semibold'}>
                          {selected !== undefined ? q.options[selected] : 'No answer'}
                        </span>
                      </p>
                      {!isCorrect && (
                        <p>
                          Correct Answer:{' '}
                          <span className="text-emerald-700 font-semibold">
                            {q.options[q.correctAnswerIndex]}
                          </span>
                        </p>
                      )}
                      <p className="text-primary/80 mt-1 italic leading-relaxed">
                        <strong>Rationale:</strong> {q.explanation}
                      </p>
                    </div>

                    {!isCorrect && (
                      <button
                        onClick={() => onAskTutorAboutMistake(q.question, q.explanation)}
                        className="mt-2.5 font-mono text-xs text-brass hover:text-primary flex items-center gap-1 font-medium transition-colors cursor-pointer"
                      >
                        <Brain className="w-3.5 h-3.5" />
                        Ask AI Tutor to clarify this misconception &rarr;
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border">
            <button
              onClick={() => {
                setQuizResults(null);
                setQuestions(null);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-surface-low border border-border text-primary hover:bg-surface transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-muted" />
              Configure Another Quiz
            </button>
            <button
              onClick={startQuiz}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold bg-primary hover:bg-primary-hover text-white shadow-sm transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 text-brass-light" />
              Retake Diagnostic Drill
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Active In-Progress Quiz Session (Classical Light Styling)
  if (questions && questions.length > 0) {
    const currentQ = questions[currentIndex];
    const hasSelected = selectedAnswers[currentIndex] !== undefined;
    const selectedOption = selectedAnswers[currentIndex];
    const isCorrect = selectedOption === currentQ.correctAnswerIndex;

    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-surface-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          {/* Top Session Progress Bar */}
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs uppercase px-2.5 py-1 rounded bg-brass-subtle border border-brass-light/60 text-brass font-bold">
                {selectedSubject}
              </span>
              <span className="font-serif text-xs text-muted capitalize">
                &bull; {currentQ.difficulty} Level
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted font-mono">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-brass" />
                Live Session
              </span>
              <span className="font-bold text-primary font-serif">
                {currentIndex + 1} of {questions.length}
              </span>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="w-full bg-surface-low h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-brass h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question Text */}
          <div>
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-brass mb-1 block">
              Subtopic: {currentQ.subtopic}
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-primary leading-snug">
              {currentQ.question}
            </h3>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {currentQ.options.map((option, idx) => {
              const isOptionSelected = selectedOption === idx;
              let optionStyle = 'border-border bg-surface-card hover:bg-surface-low text-primary';

              if (showExplanation) {
                if (idx === currentQ.correctAnswerIndex) {
                  optionStyle = 'border-emerald-500 bg-emerald-50/70 text-emerald-900 font-semibold';
                } else if (isOptionSelected) {
                  optionStyle = 'border-rose-400 bg-rose-50 text-rose-900';
                } else {
                  optionStyle = 'border-border bg-surface-low text-muted opacity-50';
                }
              } else if (isOptionSelected) {
                optionStyle = 'border-brass bg-brass-subtle/80 text-primary font-semibold ring-1 ring-brass';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={showExplanation}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between text-sm cursor-pointer ${optionStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                        isOptionSelected
                          ? 'bg-primary text-white'
                          : 'bg-surface-low border border-border text-muted'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="font-serif text-base">{option}</span>
                  </div>

                  {showExplanation && (
                    <div>
                      {idx === currentQ.correctAnswerIndex && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      )}
                      {isOptionSelected && idx !== currentQ.correctAnswerIndex && (
                        <XCircle className="w-5 h-5 text-rose-600" />
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Socratic Hint */}
          {!showExplanation && (
            <div>
              <button
                onClick={() => setShowHint(!showHint)}
                className="font-mono text-xs text-brass hover:text-primary flex items-center gap-1.5 transition-colors font-medium cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                {showHint ? 'Hide Socratic Clue' : 'Need a hint? (Socratic Prompt)'}
              </button>
              {showHint && (
                <div className="mt-2.5 p-3.5 bg-brass-subtle border border-brass-light/70 rounded-xl font-serif text-xs sm:text-sm text-primary leading-relaxed">
                  💡 <strong>Socratic Clue:</strong> {currentQ.hint}
                </div>
              )}
            </div>
          )}

          {/* Revealed Rationale */}
          {showExplanation && (
            <div
              className={`p-4 rounded-xl border font-serif text-sm ${
                isCorrect
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              <div className="font-bold flex items-center gap-1.5 mb-1.5">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Correct! Solid conceptual understanding.
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-600" />
                    Misconception Identified
                  </>
                )}
              </div>
              <p className="leading-relaxed text-primary/80">{currentQ.explanation}</p>
            </div>
          )}

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <button
              onClick={() => {
                if (confirm('Cancel this quiz session? Progress will not be saved.')) {
                  setQuestions(null);
                }
              }}
              className="font-mono text-xs text-muted hover:text-primary transition-colors cursor-pointer"
            >
              Cancel Session
            </button>

            {!showExplanation ? (
              <button
                onClick={handleCheckAnswer}
                disabled={!hasSelected}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-serif text-sm font-semibold bg-primary hover:bg-primary-hover disabled:opacity-40 text-white shadow-sm transition-all cursor-pointer"
              >
                <span>Verify Answer</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-serif text-sm font-semibold bg-primary hover:bg-primary-hover text-white shadow-sm transition-all cursor-pointer"
              >
                <span>
                  {currentIndex === questions.length - 1
                    ? isSubmitting
                      ? 'Evaluating Diagnostic Benchmark...'
                      : 'Complete Assessment & View Report'
                    : 'Next Question'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 3. Quiz Launcher Setup View (Classical Unique Light Styling)
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="bg-surface-card border border-border rounded-2xl p-6 sm:p-10 shadow-sm relative overflow-hidden space-y-6">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-brass-subtle border border-brass-light/70 flex items-center justify-center text-brass shadow-2xs shrink-0">
              <Zap className="w-6 h-6 fill-brass/20" />
            </div>
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary tracking-tight">
                Adaptive Diagnostic Quizzes
              </h2>
              <p className="text-muted font-serif text-xs sm:text-sm mt-0.5">
                Dynamic question synthesis calibrated to your knowledge model and fragile boundaries
              </p>
            </div>
          </div>

          {student?.weakAreas && student.weakAreas.length > 0 && (
            <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 rounded-xl px-3.5 py-2 text-xs text-rose-800 shrink-0">
              <Target className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="font-serif">
                <strong className="font-bold">{student.weakAreas.length} Weak Area(s)</strong> flagged for adaptive testing
              </span>
            </div>
          )}
        </div>

        {/* Configuration Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Subject Area */}
          <div>
            <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-muted mb-2">
              SELECT SUBJECT AREA
            </label>
            <div className="relative">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full bg-surface-low border border-border rounded-xl px-4 py-3 text-sm text-primary font-serif font-medium focus:outline-hidden focus:border-brass transition-colors cursor-pointer"
              >
                <option value="Computer Science">Computer Science & Algorithms</option>
                <option value="Physics & Mechanics">Physics & Mechanics</option>
                <option value="Mathematics & Calculus">Mathematics & Calculus</option>
                <option value="Artificial Intelligence">Artificial Intelligence & ML</option>
                <option value="Chemistry">General Chemistry</option>
              </select>
            </div>
          </div>

          {/* Difficulty Calibration */}
          <div>
            <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-muted mb-2">
              DIFFICULTY CALIBRATION
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {(['beginner', 'intermediate', 'advanced'] as const).map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setDifficulty(diff)}
                  className={`py-3 px-3 rounded-xl font-serif text-sm font-semibold capitalize border transition-all cursor-pointer ${
                    difficulty === diff
                      ? 'bg-primary text-white border-brass shadow-xs'
                      : 'bg-surface-low text-primary border-border hover:bg-surface'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Target Topic Input */}
        <div>
          <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-muted mb-2">
            TARGET TOPIC OR SUBTOPIC (OPTIONAL)
          </label>
          <input
            type="text"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            placeholder="e.g., Recursion Base Cases, Rotational Inertia, Integration by Parts..."
            className="w-full bg-surface-low border border-border rounded-xl px-4 py-3 text-sm font-serif text-primary placeholder-muted/60 focus:outline-hidden focus:border-brass transition-colors"
          />
        </div>

        {/* Prioritize Weak Areas Checkbox */}
        <div className="bg-surface-low border border-border rounded-xl p-4 sm:p-5 flex items-start gap-3.5">
          <input
            type="checkbox"
            id="focusWeak"
            checked={focusOnWeakAreas}
            onChange={(e) => setFocusOnWeakAreas(e.target.checked)}
            className="mt-1 w-4 h-4 accent-[#A17F3B] rounded cursor-pointer"
          />
          <label htmlFor="focusWeak" className="cursor-pointer text-xs sm:text-sm font-serif">
            <span className="font-bold text-primary block text-sm">
              Prioritize Questions on Diagnosed Weak Areas (Adaptive)
            </span>
            <span className="text-muted block mt-0.5 leading-relaxed text-xs">
              When enabled, the Bayesian engine focuses questions precisely on identified misconceptions flagged during prior diagnostics.
            </span>
          </label>
        </div>

        {/* Generate & Launch CTA Button */}
        <button
          onClick={startQuiz}
          disabled={isGenerating}
          className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl font-serif text-base font-semibold uppercase tracking-wider bg-primary hover:bg-primary-hover active:scale-[0.99] text-white shadow-xs border border-brass/50 transition-all disabled:opacity-50 cursor-pointer"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-brass-light border-t-transparent rounded-full animate-spin" />
              <span>Calibrating Adaptive Diagnostic with Gemini NLP...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-brass-light" />
              <span>Generate & Launch Adaptive Quiz</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
