import React from 'react';
import {
  BarChart3,
  AlertTriangle,
  Award,
  Flame,
  CheckCircle2,
  Brain,
  RotateCcw,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Target,
} from 'lucide-react';
import { StudentProfile } from '../types.ts';

interface PerformanceDashboardProps {
  student: StudentProfile | null;
  onLaunchRemedialQuiz: (subtopic: string) => void;
  onAskTutorAboutWeakArea: (subtopic: string) => void;
  onResetStudentData: () => void;
}

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({
  student,
  onLaunchRemedialQuiz,
  onAskTutorAboutWeakArea,
  onResetStudentData,
}) => {
  if (!student) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center text-slate-400">
        Loading student evaluation records...
      </div>
    );
  }

  // Calculate overall stats
  const totalQuizzes = student.quizHistory.length;
  const avgScore =
    totalQuizzes > 0
      ? Math.round(
          student.quizHistory.reduce((acc, curr) => acc + curr.percentage, 0) / totalQuizzes
        )
      : 75;

  const masteryItems = Object.entries(student.masteryLevels);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Student Overview Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-indigo-500/25">
                {student.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  {student.name}
                  <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                    {student.gradeLevel}
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Primary Focus: <strong className="text-indigo-300">{student.preferredSubject}</strong> • Intelligent Student Model Active
                </p>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl px-4 py-2.5 text-center">
              <span className="text-[11px] text-slate-400 block">Avg Accuracy</span>
              <span className="text-xl font-bold text-emerald-400">{avgScore}%</span>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl px-4 py-2.5 text-center">
              <span className="text-[11px] text-slate-400 block">Study Streak</span>
              <span className="text-xl font-bold text-amber-400 flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 fill-amber-400 text-amber-500" />
                {student.streakDays}d
              </span>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl px-4 py-2.5 text-center">
              <span className="text-[11px] text-slate-400 block">XP Points</span>
              <span className="text-xl font-bold text-purple-400 flex items-center justify-center gap-1">
                <Award className="w-4 h-4" />
                {student.xpPoints}
              </span>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl px-4 py-2.5 text-center">
              <span className="text-[11px] text-slate-400 block">Quizzes Taken</span>
              <span className="text-xl font-bold text-indigo-400">{totalQuizzes}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Identified Weak Areas (Left/Top) & Topic Mastery Levels (Right/Bottom) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Identified Weak Areas Card (Highlighted Feature) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Identified Weak Areas & Gaps</h3>
                <p className="text-xs text-slate-400">
                  Diagnosed by the Machine Learning & NLP Evaluation Engine
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              {student.weakAreas.length} Detected
            </span>
          </div>

          {student.weakAreas.length === 0 ? (
            <div className="p-8 text-center bg-slate-800/40 rounded-2xl border border-slate-700/40">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
              <h4 className="text-sm font-semibold text-white">No Critical Weak Areas Detected!</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                All recent quiz assessments show high mastery. Take a higher-difficulty challenge to test your boundaries!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {student.weakAreas.map((weak, idx) => (
                <div
                  key={idx}
                  className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-4 transition-all hover:border-slate-600"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-rose-200">
                          {weak.subtopic}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                            weak.severity === 'high'
                              ? 'bg-rose-600 text-white'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {weak.severity} priority
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">
                        {weak.topic} • {weak.errorCount} mistakes recorded
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-500 shrink-0">
                      {weak.lastIdentified}
                    </span>
                  </div>

                  {/* Recommendation Snippet */}
                  <p className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 mb-3 leading-relaxed">
                    💡 <strong>Diagnostic Remedy:</strong> {weak.recommendationSnippet}
                  </p>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onAskTutorAboutWeakArea(weak.subtopic)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-semibold bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-200 border border-indigo-500/40 transition-colors"
                    >
                      <Brain className="w-3.5 h-3.5" />
                      Ask AI Tutor
                    </button>
                    <button
                      onClick={() => onLaunchRemedialQuiz(weak.subtopic)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-semibold bg-rose-600/30 hover:bg-rose-600/40 text-rose-200 border border-rose-500/40 transition-colors"
                    >
                      <Target className="w-3.5 h-3.5" />
                      3-Q Focus Drill
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Topic Mastery Levels (Right) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Competency Mastery</h3>
                  <p className="text-xs text-slate-400">Calculated over historical assessments</p>
                </div>
              </div>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="space-y-4">
              {masteryItems.map(([topic, level], idx) => {
                let color = 'from-rose-500 to-amber-500';
                let textColor = 'text-amber-400';
                if (level >= 75) {
                  color = 'from-emerald-500 to-teal-400';
                  textColor = 'text-emerald-400';
                } else if (level >= 60) {
                  color = 'from-indigo-500 to-purple-500';
                  textColor = 'text-indigo-400';
                }

                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-200">{topic}</span>
                      <span className={`font-bold ${textColor}`}>{level}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-500`}
                        style={{ width: `${level}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Adaptive Student Model (IRT & Bayesian Tracing)</span>
            <button
              onClick={onResetStudentData}
              className="text-slate-500 hover:text-rose-400 flex items-center gap-1 transition-colors"
              title="Reset progress to default initial baseline"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Stats
            </button>
          </div>
        </div>
      </div>

      {/* Historical Quiz Records Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Award className="w-4 h-4 text-indigo-400" />
          Assessment Log & SQLite Record History
        </h3>

        {student.quizHistory.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">
            No quizzes completed in this session yet. Take your first diagnostic quiz!
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Subject & Topic</th>
                  <th className="py-2.5 px-3 text-center">Score</th>
                  <th className="py-2.5 px-3 text-center">Accuracy</th>
                  <th className="py-2.5 px-3">Diagnosed Missed Subtopics</th>
                  <th className="py-2.5 px-3 text-right">Time Spent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {student.quizHistory.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 text-slate-400">{q.date}</td>
                    <td className="py-3 px-3 font-semibold text-white">
                      {q.topic}
                      <span className="block text-[10px] font-normal text-indigo-300">{q.subject}</span>
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-200">
                      {q.score} / {q.totalQuestions}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded font-bold ${
                          q.percentage >= 70
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {q.percentage}%
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {q.missedSubtopics && q.missedSubtopics.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {q.missedSubtopics.map((sub, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded bg-rose-950/40 border border-rose-900/50 text-rose-300 text-[10px]"
                            >
                              {sub}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-emerald-400 text-[11px] font-medium">None (Flawless)</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-400">{q.timeSpentSeconds}s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
