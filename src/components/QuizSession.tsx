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
      alert('Could not generate quiz right now. Please try again or switch subjects.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectOption = (optionIndex: number) => {
    if (showExplanation) return; // Prevent changing after revealing
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

  // 1. If viewing Quiz Results
  if (quizResults) {
    const isPassing = quizResults.percentage >= 70;
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          {/* Header Badge */}
          <div className="text-center mb-6">
            <div
              className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-3 shadow-lg ${
                isPassing
                  ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-emerald-500/30'
                  : 'bg-gradient-to-tr from-amber-500 to-rose-500 text-white shadow-rose-500/30'
              }`}
            >
              <Trophy className="w-8 h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Quiz Evaluation Completed</h2>
            <p className="text-slate-400 text-sm mt-1">
              Performance diagnostics processed by the Intelligent Student Model
            </p>
          </div>

          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3.5 text-center">
              <span className="text-xs text-slate-400 font-medium">Final Score</span>
              <p className="text-2xl font-bold text-white mt-1">
                {quizResults.score} / {quizResults.totalQuestions}
              </p>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3.5 text-center">
              <span className="text-xs text-slate-400 font-medium">Accuracy</span>
              <p
                className={`text-2xl font-bold mt-1 ${
                  isPassing ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {quizResults.percentage}%
              </p>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3.5 text-center">
              <span className="text-xs text-slate-400 font-medium">XP Earned</span>
              <p className="text-2xl font-bold text-purple-400 mt-1">
                +{quizResults.score * 50 + 20} XP
              </p>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3.5 text-center">
              <span className="text-xs text-slate-400 font-medium">Topic Mastery</span>
              <p className="text-2xl font-bold text-indigo-400 mt-1">
                {quizResults.updatedMastery}%
              </p>
            </div>
          </div>

          {/* AI Pedagogical Feedback Box */}
          <div className="bg-indigo-950/40 border border-indigo-800/50 rounded-2xl p-4 sm:p-5 mb-6">
            <div className="flex items-center gap-2 text-indigo-300 font-semibold text-sm mb-2">
              <Brain className="w-4 h-4 text-indigo-400" />
              AI Tutor Diagnostic Feedback
            </div>
            <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-line">
              {quizResults.aiFeedback}
            </p>
          </div>

          {/* Detected Weak Areas Section */}
          {quizResults.detectedWeakSubtopics && quizResults.detectedWeakSubtopics.length > 0 && (
            <div className="bg-rose-950/30 border border-rose-900/40 rounded-2xl p-4 sm:p-5 mb-6">
              <div className="flex items-center gap-2 text-rose-300 font-semibold text-sm mb-2">
                <Target className="w-4 h-4 text-rose-400" />
                Detected Knowledge Gaps & Misconceptions:
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {quizResults.detectedWeakSubtopics.map((weak: string, idx: number) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30"
                  >
                    <span>⚠️</span>
                    {weak}
                  </span>
                ))}
              </div>
              <p className="text-xs text-rose-200/80 mt-3">
                These topics have been registered in your student profile and will receive priority remediation in the <strong>Study Recommendations</strong> tab.
              </p>
            </div>
          )}

          {/* Question Breakdown List */}
          <div className="border-t border-slate-800 pt-6 mb-6">
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              Detailed Question Analysis
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
                        ? 'bg-emerald-950/20 border-emerald-900/40'
                        : 'bg-rose-950/20 border-rose-900/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                        <span className="font-semibold text-slate-200">
                          Q{idx + 1}: {q.question}
                        </span>
                      </div>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 shrink-0">
                        {q.subtopic}
                      </span>
                    </div>

                    <div className="mt-2 text-xs text-slate-300 space-y-1">
                      <p>
                        Your Answer:{' '}
                        <span className={isCorrect ? 'text-emerald-400 font-medium' : 'text-rose-400 font-medium'}>
                          {selected !== undefined ? q.options[selected] : 'No answer'}
                        </span>
                      </p>
                      {!isCorrect && (
                        <p>
                          Correct Answer:{' '}
                          <span className="text-emerald-400 font-medium">
                            {q.options[q.correctAnswerIndex]}
                          </span>
                        </p>
                      )}
                      <p className="text-slate-400 mt-1 italic">
                        <strong>Rationale:</strong> {q.explanation}
                      </p>
                    </div>

                    {!isCorrect && (
                      <button
                        onClick={() => onAskTutorAboutMistake(q.question, q.explanation)}
                        className="mt-2.5 text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium transition-colors"
                      >
                        <Brain className="w-3.5 h-3.5" />
                        Ask AI Tutor to clarify this mistake
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
            <button
              onClick={() => {
                setQuizResults(null);
                setQuestions(null);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Configure Another Quiz
            </button>
            <button
              onClick={startQuiz}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all"
            >
              <Zap className="w-4 h-4" />
              Retake Adaptive Drill
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Active In-Progress Quiz Session
  if (questions && questions.length > 0) {
    const currentQ = questions[currentIndex];
    const hasSelected = selectedAnswers[currentIndex] !== undefined;
    const selectedOption = selectedAnswers[currentIndex];
    const isCorrect = selectedOption === currentQ.correctAnswerIndex;

    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Progress & Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {selectedSubject}
              </span>
              <span className="text-xs text-slate-400 capitalize">
                • {currentQ.difficulty} Level
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1 font-medium text-slate-300">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                Live Session
              </span>
              <span className="font-semibold text-white">
                {currentIndex + 1} / {questions.length}
              </span>
            </div>
          </div>

          {/* Question Progress Bar */}
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-6">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question Text */}
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1 block">
              Subtopic: {currentQ.subtopic}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
              {currentQ.question}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {currentQ.options.map((option, idx) => {
              const isOptionSelected = selectedOption === idx;
              let optionStyle = 'border-slate-800 bg-slate-800/60 hover:bg-slate-800 text-slate-200';

              if (showExplanation) {
                if (idx === currentQ.correctAnswerIndex) {
                  optionStyle = 'border-emerald-500/80 bg-emerald-950/40 text-emerald-200 font-medium';
                } else if (isOptionSelected) {
                  optionStyle = 'border-rose-500/80 bg-rose-950/40 text-rose-200';
                } else {
                  optionStyle = 'border-slate-800/50 bg-slate-800/20 text-slate-400 opacity-60';
                }
              } else if (isOptionSelected) {
                optionStyle = 'border-indigo-500 bg-indigo-950/50 text-indigo-100 ring-2 ring-indigo-500/30';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={showExplanation}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-150 flex items-center justify-between text-sm ${optionStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        isOptionSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-700/80 text-slate-300'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </div>

                  {showExplanation && (
                    <div>
                      {idx === currentQ.correctAnswerIndex && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      )}
                      {isOptionSelected && idx !== currentQ.correctAnswerIndex && (
                        <XCircle className="w-5 h-5 text-rose-400" />
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Hint Card Toggle */}
          {!showExplanation && (
            <div className="mb-4">
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors font-medium"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                {showHint ? 'Hide Pedagogical Hint' : 'Need a hint? (Socratic Prompt)'}
              </button>
              {showHint && (
                <div className="mt-2 p-3 bg-amber-950/30 border border-amber-900/40 rounded-xl text-xs text-amber-200 leading-relaxed">
                  💡 <strong>Tutor Clue:</strong> {currentQ.hint}
                </div>
              )}
            </div>
          )}

          {/* Revealed Rationale Box */}
          {showExplanation && (
            <div
              className={`p-4 rounded-2xl border text-xs sm:text-sm mb-6 ${
                isCorrect
                  ? 'bg-emerald-950/30 border-emerald-900/50 text-emerald-200'
                  : 'bg-rose-950/30 border-rose-900/50 text-rose-200'
              }`}
            >
              <div className="font-bold flex items-center gap-1.5 mb-1.5">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Correct! Great conceptual grasp.
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-400" />
                    Misconception Detected
                  </>
                )}
              </div>
              <p className="text-slate-300 leading-relaxed">{currentQ.explanation}</p>
            </div>
          )}

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => {
                if (confirm('Cancel this quiz session? Progress will not be saved.')) {
                  setQuestions(null);
                }
              }}
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              Abandon Quiz
            </button>

            {!showExplanation ? (
              <button
                onClick={handleCheckAnswer}
                disabled={!hasSelected}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-md shadow-indigo-600/30 transition-all"
              >
                <span>Check Answer</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30 transition-all"
              >
                <span>
                  {currentIndex === questions.length - 1
                    ? isSubmitting
                      ? 'Submitting & Evaluating...'
                      : 'Finish & View Diagnostic Report'
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

  // 3. Quiz Launcher Setup View
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <Zap className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Adaptive Diagnostic Quizzes</h2>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Dynamic question generator powered by AI with real-time misconception evaluation
            </p>
          </div>

          {student?.weakAreas && student.weakAreas.length > 0 && (
            <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 rounded-xl px-3 py-2 text-xs text-rose-300">
              <Target className="w-4 h-4 text-rose-400" />
              <span>
                <strong>{student.weakAreas.length} Weak Area(s)</strong> flagged for adaptive testing
              </span>
            </div>
          )}
        </div>

        {/* Configuration Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          {/* Subject */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Select Subject Area
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
            >
              <option value="Computer Science">Computer Science & Algorithms</option>
              <option value="Physics & Mechanics">Physics & Mechanics</option>
              <option value="Mathematics & Calculus">Mathematics & Calculus</option>
              <option value="Artificial Intelligence">Artificial Intelligence & ML</option>
              <option value="Chemistry">General Chemistry</option>
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Difficulty Calibration
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['beginner', 'intermediate', 'advanced'] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium capitalize border transition-all ${
                    difficulty === diff
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Custom Topic Input */}
        <div className="mb-6">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
            Target Topic or Subtopic (Optional)
          </label>
          <input
            type="text"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            placeholder="e.g., Recursion Base Cases, Rotational Inertia, Integration by Parts..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500"
          />
        </div>

        {/* Focus on Weak Areas Checkbox */}
        <div className="mb-8 bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 flex items-start gap-3">
          <input
            type="checkbox"
            id="focusWeak"
            checked={focusOnWeakAreas}
            onChange={(e) => setFocusOnWeakAreas(e.target.checked)}
            className="mt-1 w-4 h-4 accent-indigo-600 rounded cursor-pointer"
          />
          <label htmlFor="focusWeak" className="cursor-pointer text-xs sm:text-sm">
            <span className="font-semibold text-white block">
              Prioritize Questions on Diagnosed Weak Areas (Adaptive)
            </span>
            <span className="text-slate-400 block mt-0.5 text-xs">
              When checked, the AI will synthesize questions specifically testing the knowledge gaps flagged during previous quizzes.
            </span>
          </label>
        </div>

        {/* Start Button */}
        <button
          onClick={startQuiz}
          disabled={isGenerating}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl text-sm font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white shadow-xl shadow-indigo-600/25 transition-all disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Synthesizing Adaptive Quiz with Gemini NLP...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate & Launch Adaptive Quiz</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
