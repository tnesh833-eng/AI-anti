/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BarChart3,
  AlertTriangle,
  Award,
  Flame,
  CheckCircle2,
  Brain,
  RotateCcw,
  TrendingUp,
  Target,
  FileDown,
  Download,
  Loader2,
  FileText,
  Trophy,
  Zap,
  Shield,
  Star,
  Lock,
} from 'lucide-react';
import { StudentProfile, Achievement } from '../types.ts';
import { generateStudentReportPdf } from '../utils/exportPdfReport.ts';

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
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);
  const [achievementFilter, setAchievementFilter] = useState<string>('all');

  const handleExportPdf = () => {
    if (!student || isExporting) return;
    setIsExporting(true);
    setExportSuccess(false);

    try {
      generateStudentReportPdf(student);
      setExportSuccess(true);
      setTimeout(() => {
        setExportSuccess(false);
      }, 4500);
    } catch (err) {
      console.error('Error generating PDF report:', err);
    } finally {
      setIsExporting(false);
    }
  };

  if (!student) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center text-muted font-serif">
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
      : 60;

  const masteryItems = Object.entries(student.masteryLevels);

  // Fallback achievements if not loaded from backend
  const achievements: Achievement[] = student.achievements || [
    {
      id: 'streak-bronze',
      title: 'Study Habit Ignition',
      description: 'Maintain an unbroken daily learning streak of at least 3 days.',
      category: 'streak',
      tier: 'bronze',
      icon: 'flame',
      unlocked: student.streakDays >= 3,
      unlockedAt: student.streakDays >= 3 ? 'Day 3' : undefined,
      progress: Math.min(3, student.streakDays),
      maxProgress: 3,
      xpBonus: 100,
    },
    {
      id: 'streak-silver',
      title: 'Relentless Momentum',
      description: 'Reach a 7-day consistent study streak with adaptive daily drills.',
      category: 'streak',
      tier: 'silver',
      icon: 'flame',
      unlocked: student.streakDays >= 7,
      unlockedAt: student.streakDays >= 7 ? 'Day 7' : undefined,
      progress: Math.min(7, student.streakDays),
      maxProgress: 7,
      xpBonus: 250,
    },
    {
      id: 'streak-gold',
      title: 'Immortal Scholar Streak',
      description: 'Reach a 14-day study streak demonstrating elite academic discipline.',
      category: 'streak',
      tier: 'gold',
      icon: 'zap',
      unlocked: student.streakDays >= 14,
      unlockedAt: student.streakDays >= 14 ? 'Day 14' : undefined,
      progress: Math.min(14, student.streakDays),
      maxProgress: 14,
      xpBonus: 500,
    },
    {
      id: 'accuracy-sharpshooter',
      title: 'Precision Sharpshooter',
      description: 'Score 80% or higher on an adaptive diagnostic quiz session.',
      category: 'accuracy',
      tier: 'silver',
      icon: 'target',
      unlocked: student.quizHistory.some((q) => q.percentage >= 80),
      unlockedAt: 'Recent Quiz',
      progress: 1,
      maxProgress: 1,
      xpBonus: 150,
    },
    {
      id: 'consistency-quizzes',
      title: 'Assessment Veteran',
      description: 'Complete at least 5 adaptive quiz diagnostic evaluations.',
      category: 'consistency',
      tier: 'silver',
      icon: 'award',
      unlocked: totalQuizzes >= 5,
      progress: Math.min(5, totalQuizzes),
      maxProgress: 5,
      xpBonus: 200,
    },
    {
      id: 'xp-milestone',
      title: 'Centurion Scholar',
      description: 'Accumulate over 1,000 Total XP across quizzes and Socratic inquiries.',
      category: 'mastery',
      tier: 'gold',
      icon: 'star',
      unlocked: student.xpPoints >= 1000,
      unlockedAt: 'Milestone',
      progress: Math.min(1000, student.xpPoints),
      maxProgress: 1000,
      xpBonus: 300,
    },
    {
      id: 'weakness-slayer',
      title: 'Gap Eliminator',
      description: 'Retake remedial quizzes to bring diagnosed misconceptions under control.',
      category: 'mastery',
      tier: 'silver',
      icon: 'shield',
      unlocked: true,
      unlockedAt: 'Remedial Drill',
      progress: 1,
      maxProgress: 1,
      xpBonus: 200,
    },
    {
      id: 'socratic-seeker',
      title: 'Socratic Dialogue Initiate',
      description: 'Engage the AI Tutor in multi-turn Socratic step-by-step reasoning.',
      category: 'consistency',
      tier: 'bronze',
      icon: 'brain',
      unlocked: true,
      unlockedAt: 'Orientation',
      progress: 1,
      maxProgress: 1,
      xpBonus: 100,
    },
  ];

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  const filteredAchievements = achievements.filter((a) => {
    if (achievementFilter === 'all') return true;
    return a.category === achievementFilter;
  });

  const getAchievementIcon = (iconName: string, unlocked: boolean) => {
    const baseClass = `w-5 h-5 ${unlocked ? '' : 'text-muted'}`;
    switch (iconName) {
      case 'flame':
        return <Flame className={`${baseClass} text-amber-600 fill-amber-500/20`} />;
      case 'target':
        return <Target className={`${baseClass} text-emerald-700`} />;
      case 'award':
        return <Award className={`${baseClass} text-brass`} />;
      case 'zap':
        return <Zap className={`${baseClass} text-amber-600 fill-amber-500/20`} />;
      case 'shield':
        return <Shield className={`${baseClass} text-primary`} />;
      case 'brain':
        return <Brain className={`${baseClass} text-brass`} />;
      case 'star':
        return <Star className={`${baseClass} text-amber-500 fill-amber-400/30`} />;
      default:
        return <Trophy className={`${baseClass} text-brass`} />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'gold':
        return 'text-amber-800 bg-amber-50 border-amber-300';
      case 'silver':
        return 'text-slate-800 bg-slate-100 border-slate-300';
      case 'platinum':
        return 'text-indigo-900 bg-indigo-50 border-indigo-200';
      default:
        return 'text-amber-900 bg-amber-100/50 border-amber-400/40';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Export Success Notification Banner */}
      {exportSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl px-5 py-3 text-emerald-900 flex items-center justify-between text-xs sm:text-sm shadow-xs animate-in fade-in duration-300">
          <div className="flex items-center gap-2.5 font-serif">
            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span>
              <strong>Report Downloaded!</strong> Official PDF progress report for{' '}
              <strong className="text-primary">{student.name}</strong> was exported successfully.
            </span>
          </div>
          <span className="text-[11px] text-emerald-700 font-mono hidden sm:inline-block">
            Archival Academic Record
          </span>
        </div>
      )}

      {/* Classical Collegiate Student Overview Card */}
      <div className="bg-surface-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          {/* Student Profile Info */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary border-2 border-brass-light flex items-center justify-center text-white text-2xl font-serif font-bold shadow-xs shrink-0">
              {student.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary tracking-tight">
                  {student.name}
                </h2>
                <span className="font-mono text-xs font-semibold px-3 py-0.5 rounded-full bg-brass-subtle border border-brass-light/70 text-brass">
                  {student.gradeLevel}
                </span>

                {/* Status Badges Counter */}
                <a
                  href="#achievements-showcase"
                  className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-surface-low border border-border text-primary hover:border-brass text-xs font-serif font-semibold transition-colors cursor-pointer"
                  title="Click to view all earned academic honors & study badges"
                >
                  <Trophy className="w-3.5 h-3.5 text-brass" />
                  <span>{unlockedCount}/{achievements.length} Academic Honors</span>
                </a>
              </div>
              <p className="text-xs sm:text-sm text-muted font-serif mt-1">
                Primary Discipline: <strong className="text-brass font-semibold">{student.preferredSubject}</strong> &bull; Intelligent Student Model Active
              </p>

              {/* Earned Badges & Status Icons directly on Profile Header */}
              <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-border/80 flex-wrap">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted mr-1">
                  Conferred Laurels:
                </span>
                {achievements
                  .filter((a) => a.unlocked)
                  .map((badge) => (
                    <div
                      key={badge.id}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-low border border-brass-light/70 hover:border-brass text-primary transition-all cursor-help shadow-2xs"
                      title={`${badge.title} (${badge.tier.toUpperCase()}): ${badge.description}`}
                    >
                      {getAchievementIcon(badge.icon, true)}
                      <span className="font-serif text-xs font-bold">{badge.title}</span>
                      <span className="font-mono text-[9px] uppercase px-1 py-0.2 rounded bg-brass-subtle text-brass font-bold border border-brass-light/50">
                        {badge.tier}
                      </span>
                    </div>
                  ))}
                {achievements.filter((a) => a.unlocked).length === 0 && (
                  <span className="font-serif text-xs text-muted italic">Complete diagnostic quizzes to earn laurels.</span>
                )}
              </div>
            </div>
          </div>

          {/* Center Quick Metrics & Right Export Button */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* 4 Metric Boxes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
              <div className="bg-surface-low border border-border rounded-xl px-4 py-2.5 text-center min-w-[85px]">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted block">Avg Accuracy</span>
                <span className="font-serif text-xl font-bold text-emerald-700">{avgScore}%</span>
              </div>
              <div className="bg-surface-low border border-border rounded-xl px-4 py-2.5 text-center min-w-[85px]">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted block">Study Streak</span>
                <span className="font-serif text-xl font-bold text-amber-700 flex items-center justify-center gap-1">
                  🔥 {student.streakDays}d
                </span>
              </div>
              <div className="bg-surface-low border border-border rounded-xl px-4 py-2.5 text-center min-w-[85px]">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted block">XP Points</span>
                <span className="font-serif text-xl font-bold text-brass flex items-center justify-center gap-1">
                  <Award className="w-4 h-4 text-brass" />
                  {student.xpPoints}
                </span>
              </div>
              <div className="bg-surface-low border border-border rounded-xl px-4 py-2.5 text-center min-w-[85px]">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted block">Quizzes Taken</span>
                <span className="font-serif text-xl font-bold text-primary">{totalQuizzes}</span>
              </div>
            </div>

            {/* Export PDF Button */}
            <button
              onClick={handleExportPdf}
              disabled={isExporting}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary hover:bg-primary-hover active:scale-95 text-white font-serif font-semibold text-xs sm:text-sm shadow-xs border border-brass/50 transition-all cursor-pointer disabled:opacity-60 shrink-0"
              title="Export official student progress diagnostic as a downloadable PDF"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-brass-light" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 text-brass-light" />
                  <span>Export PDF Report</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Identified Weak Areas (Left) & Competency Mastery (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Identified Weak Areas Card (Left 7 Columns) */}
        <div className="lg:col-span-7 bg-surface-card border border-border rounded-2xl p-6 sm:p-7 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-primary leading-tight">
                    Identified Weak Areas & Knowledge Gaps
                  </h3>
                  <p className="font-serif text-xs text-muted mt-0.5">
                    Diagnosed by the Bayesian Knowledge Model & NLP Analysis
                  </p>
                </div>
              </div>
              <span className="font-mono text-xs font-semibold px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 shrink-0">
                {student.weakAreas.length} Detected
              </span>
            </div>

            {student.weakAreas.length === 0 ? (
              <div className="p-8 text-center bg-surface-low rounded-xl border border-border">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-serif text-base font-bold text-primary">No Critical Weak Areas Detected</h4>
                <p className="font-serif text-xs text-muted mt-1 max-w-sm mx-auto">
                  All recent assessments reflect robust mastery. Engage with advanced topics to test deeper limits.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {student.weakAreas.map((weak, idx) => (
                  <div
                    key={idx}
                    className="bg-surface-low border border-border rounded-xl p-4 sm:p-5 transition-all hover:border-brass/50"
                  >
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-serif font-bold text-base text-primary">
                            {weak.subtopic}
                          </span>
                          <span
                            className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                              weak.severity === 'high'
                                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}
                          >
                            {weak.severity === 'high' ? 'HIGH PRIORITY' : 'MEDIUM PRIORITY'}
                          </span>
                        </div>
                        <span className="font-serif text-xs text-muted block mt-0.5">
                          {weak.topic} &bull; {weak.errorCount} recorded misconceptions
                        </span>
                      </div>

                      <span className="font-mono text-xs text-muted shrink-0">
                        {weak.lastIdentified}
                      </span>
                    </div>

                    {/* Recommendation Box */}
                    <div className="bg-surface-card border border-border rounded-lg p-3 font-serif text-xs text-primary leading-relaxed my-3">
                      💡 <strong>Diagnostic Remedy:</strong> {weak.recommendationSnippet}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => onAskTutorAboutWeakArea(weak.subtopic)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-serif font-semibold bg-surface-card hover:bg-surface text-primary border border-border hover:border-brass transition-colors cursor-pointer"
                      >
                        <Brain className="w-3.5 h-3.5 text-brass" />
                        <span>Ask AI Tutor</span>
                      </button>
                      <button
                        onClick={() => onLaunchRemedialQuiz(weak.subtopic)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-serif font-semibold bg-primary hover:bg-primary-hover text-white border border-brass/50 transition-colors cursor-pointer"
                      >
                        <Target className="w-3.5 h-3.5 text-brass-light" />
                        <span>3-Q Focus Drill</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Competency Mastery Card (Right 5 Columns) */}
        <div className="lg:col-span-5 bg-surface-card border border-border rounded-2xl p-6 sm:p-7 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brass-subtle text-brass border border-brass-light/70 flex items-center justify-center shrink-0">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-primary leading-tight">Competency Mastery</h3>
                  <p className="font-serif text-xs text-muted mt-0.5">Calculated over historical assessments</p>
                </div>
              </div>
              <TrendingUp className="w-4 h-4 text-emerald-700 shrink-0" />
            </div>

            {/* Mastery Items Progress Bars */}
            <div className="space-y-4 pt-1">
              {masteryItems.map(([topic, level], idx) => {
                let barColor = 'bg-brass';
                let textColor = 'text-brass';

                if (level >= 80) {
                  barColor = 'bg-emerald-600';
                  textColor = 'text-emerald-700';
                } else if (level < 60) {
                  barColor = 'bg-amber-600';
                  textColor = 'text-amber-700';
                }

                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-serif">
                      <span className="font-medium text-primary">{topic}</span>
                      <span className={`font-mono font-bold ${textColor}`}>{level}%</span>
                    </div>
                    <div className="w-full bg-surface-low h-2 rounded-full overflow-hidden border border-border/60">
                      <div
                        className={`h-full ${barColor} rounded-full transition-all duration-500`}
                        style={{ width: `${level}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-serif text-muted">
            <span>Adaptive Student Model (IRT & Bayesian Tracing)</span>
            <button
              onClick={onResetStudentData}
              className="text-muted hover:text-rose-700 flex items-center gap-1 transition-colors cursor-pointer font-mono"
              title="Reset progress to default baseline"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Stats
            </button>
          </div>
        </div>
      </div>

      {/* STUDENT ACHIEVEMENTS & ACADEMIC HONORS SHOWCASE (Classical Unique Style) */}
      <div id="achievements-showcase" className="bg-surface-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-brass-subtle border border-brass-light/80 flex items-center justify-center text-brass shadow-2xs">
              <Trophy className="w-6 h-6 fill-brass/20" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl font-bold text-primary tracking-tight">
                  Student Achievements & Academic Honors
                </h3>
                <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-brass-subtle border border-brass-light/70 text-brass">
                  {unlockedCount} / {achievements.length} Unlocked
                </span>
              </div>
              <p className="font-serif text-xs text-muted mt-0.5">
                Scholastic laurels awarded for study streaks, consistent daily discipline, and overcoming fragile misconceptions
              </p>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: 'All Honors' },
              { id: 'streak', label: 'Streaks' },
              { id: 'accuracy', label: 'Accuracy' },
              { id: 'consistency', label: 'Consistency' },
              { id: 'mastery', label: 'Mastery' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setAchievementFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl font-serif text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  achievementFilter === f.id
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-surface-low text-muted hover:text-primary border border-border'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredAchievements.map((badge) => {
            const isUnlocked = badge.unlocked;
            const progressPercent = Math.min(100, Math.round((badge.progress / badge.maxProgress) * 100));

            return (
              <div
                key={badge.id}
                className={`rounded-xl p-4 sm:p-5 border transition-all relative flex flex-col justify-between ${
                  isUnlocked
                    ? 'bg-surface-card border-border hover:border-brass/70 shadow-2xs'
                    : 'bg-surface-low border-border/70 opacity-60'
                }`}
              >
                <div>
                  {/* Top Bar: Icon + Tier */}
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-2xs ${
                        isUnlocked
                          ? 'bg-brass-subtle border-brass-light/70'
                          : 'bg-surface border-border'
                      }`}
                    >
                      {getAchievementIcon(badge.icon, isUnlocked)}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getTierColor(badge.tier)}`}>
                        {badge.tier}
                      </span>
                      <span className="font-mono text-[10px] text-brass bg-brass-subtle border border-brass-light/60 px-1.5 py-0.5 rounded font-bold">
                        +{badge.xpBonus} XP
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h4 className={`font-serif text-base font-bold mb-1 ${isUnlocked ? 'text-primary' : 'text-muted'}`}>
                    {badge.title}
                  </h4>
                  <p className="font-serif text-xs text-muted leading-relaxed mb-4">
                    {badge.description}
                  </p>
                </div>

                {/* Progress / Status Footer */}
                <div className="pt-3 border-t border-border">
                  <div className="flex items-center justify-between text-[11px] mb-1.5 font-mono">
                    <span>
                      {isUnlocked ? (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Conferred Honor
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-muted">
                          <Lock className="w-3 h-3 text-muted" />
                          In Progress
                        </span>
                      )}
                    </span>
                    <span className="text-primary font-medium">
                      {badge.progress} / {badge.maxProgress}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-surface-low h-1.5 rounded-full overflow-hidden border border-border/50">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isUnlocked ? 'bg-brass' : 'bg-primary/70'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Historical Quiz Records Table Card */}
      <div className="bg-surface-card border border-border rounded-2xl p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h3 className="font-serif text-lg font-bold text-primary flex items-center gap-2">
            <Award className="w-4 h-4 text-brass" />
            <span>Assessment Log & Scholastic Record History</span>
          </h3>
          <button
            onClick={handleExportPdf}
            disabled={isExporting}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-surface-low hover:bg-surface text-primary border border-border hover:border-brass text-xs font-serif font-medium transition-colors cursor-pointer disabled:opacity-50"
            title="Download full progress report as PDF"
          >
            <Download className="w-3.5 h-3.5 text-brass" />
            <span>Download Report (PDF)</span>
          </button>
        </div>

        {student.quizHistory.length === 0 ? (
          <p className="font-serif text-xs text-muted text-center py-8">
            No diagnostic sessions recorded yet in this academic period. Take your initial diagnostic quiz!
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-primary font-serif">
              <thead className="bg-surface-low text-muted uppercase text-[10px] tracking-wider border-b border-border font-mono">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Subject & Topic</th>
                  <th className="py-2.5 px-3 text-center">Score</th>
                  <th className="py-2.5 px-3 text-center">Accuracy</th>
                  <th className="py-2.5 px-3">Diagnosed Missed Subtopics</th>
                  <th className="py-2.5 px-3 text-right">Time Spent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {student.quizHistory.map((q) => (
                  <tr key={q.id} className="hover:bg-surface-low/50 transition-colors">
                    <td className="py-3 px-3 text-muted font-mono text-[11px]">{q.date}</td>
                    <td className="py-3 px-3 font-bold text-primary">
                      {q.topic}
                      <span className="block text-[11px] font-normal text-brass font-serif">{q.subject}</span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-primary">
                      {q.score} / {q.totalQuestions}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded font-mono font-bold text-xs ${
                          q.percentage >= 70
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
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
                              className="px-2 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-800 text-[10px] font-mono"
                            >
                              {sub}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-emerald-700 text-xs font-semibold">None (Flawless)</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-muted">{q.timeSpentSeconds}s</td>
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
