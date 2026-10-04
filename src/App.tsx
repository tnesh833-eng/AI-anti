/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { TutorChat } from './components/TutorChat.tsx';
import { QuizSession } from './components/QuizSession.tsx';
import { PerformanceDashboard } from './components/PerformanceDashboard.tsx';
import { RecommendationsHub } from './components/RecommendationsHub.tsx';
import { CurriculumExplorer } from './components/CurriculumExplorer.tsx';
import { LandingPage } from './components/LandingPage.tsx';
import { AIAssistantWidget } from './components/AIAssistantWidget.tsx';
import { StudentProfile } from './types.ts';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [allStudentIds, setAllStudentIds] = useState<string[]>(['student-1', 'student-2']);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Cross-component navigation state
  const [quizPrefill, setQuizPrefill] = useState<{ subject: string; topic?: string }>({
    subject: 'Computer Science',
  });

  const fetchStudentProfile = async () => {
    try {
      const res = await fetch('/api/student/profile');
      const data = await res.json();
      if (data.success && data.student) {
        setStudent(data.student);
        if (data.allStudentIds) {
          setAllStudentIds(data.allStudentIds);
        }
      }
    } catch (err) {
      console.error('Error fetching student profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentProfile();
  }, []);

  const handleSwitchStudent = async (studentId: string) => {
    try {
      const res = await fetch('/api/student/switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId }),
      });
      const data = await res.json();
      if (data.success && data.student) {
        setStudent(data.student);
      }
    } catch (err) {
      console.error('Error switching student:', err);
    }
  };

  const handleResetStudentData = async () => {
    if (!confirm('Reset performance data and weak areas to baseline?')) return;
    try {
      const res = await fetch('/api/student/reset', { method: 'POST' });
      const data = await res.json();
      if (data.success && data.student) {
        setStudent(data.student);
      }
    } catch (err) {
      console.error('Error resetting student data:', err);
    }
  };

  const handleNavigateToQuiz = (subject: string, topic?: string) => {
    setQuizPrefill({ subject, topic });
    setActiveTab('quiz');
  };

  const handleAskTutorAboutMistake = (_questionText: string, _explanation: string) => {
    setActiveTab('tutor');
  };

  const handleAskTutorTopic = (_subject: string, _question: string) => {
    setActiveTab('tutor');
  };

  return (
    <div className="min-h-screen bg-surface text-primary flex flex-col font-sans selection:bg-brass-light selection:text-primary">
      {/* Top Navigation with Firebase Authentication */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        student={student}
        onSwitchStudent={handleSwitchStudent}
        allStudentIds={allStudentIds}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full flex flex-col items-center">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
            <div className="w-10 h-10 border-4 border-brass border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted font-serif font-medium">
              Initializing Intelligent Tutor & Synchronizing Student Knowledge Profile...
            </p>
          </div>
        ) : (
          <div className="w-full max-w-[1440px] flex-1">
            {activeTab === 'home' && (
              <LandingPage onLaunchTutor={() => setActiveTab('tutor')} />
            )}

            {activeTab === 'tutor' && (
              <TutorChat
                student={student}
                onNavigateToQuiz={handleNavigateToQuiz}
              />
            )}

            {activeTab === 'quiz' && (
              <QuizSession
                key={`${quizPrefill.subject}-${quizPrefill.topic || ''}`}
                student={student}
                initialSubject={quizPrefill.subject}
                initialTopic={quizPrefill.topic}
                onQuizCompleted={fetchStudentProfile}
                onAskTutorAboutMistake={handleAskTutorAboutMistake}
              />
            )}

            {activeTab === 'analytics' && (
              <PerformanceDashboard
                student={student}
                onLaunchRemedialQuiz={(subtopic) =>
                  handleNavigateToQuiz(student?.preferredSubject || 'Computer Science', subtopic)
                }
                onAskTutorAboutWeakArea={(_subtopic) => {
                  setActiveTab('tutor');
                }}
                onResetStudentData={handleResetStudentData}
              />
            )}

            {activeTab === 'recommendations' && (
              <RecommendationsHub
                student={student}
                onLaunchRemedialQuiz={(topic) =>
                  handleNavigateToQuiz(student?.preferredSubject || 'Computer Science', topic)
                }
                onAskTutor={(_topic) => {
                  setActiveTab('tutor');
                }}
              />
            )}

            {activeTab === 'curriculum' && (
              <CurriculumExplorer
                onAskTutorTopic={handleAskTutorTopic}
                onTakeTopicQuiz={(subject, topic) => handleNavigateToQuiz(subject, topic)}
              />
            )}
          </div>
        )}
      </main>

      {/* Omnipresent Floating AI Study Assistant */}
      {activeTab !== 'tutor' && (
        <AIAssistantWidget
          student={student}
          activeTab={activeTab}
          onOpenFullTutor={() => setActiveTab('tutor')}
          onNavigateToQuiz={handleNavigateToQuiz}
        />
      )}

      {/* PERSISTENT FOOTER */}
      <footer className="w-full bg-surface border-t border-border py-8 mt-auto">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-serif text-muted">
          <div className="flex items-center gap-2">
            <span className="font-bold text-primary">Academia Intelligentia</span>
            <span>|</span>
            <span className="font-mono text-[11px] uppercase tracking-wider text-brass">
              Intelligent Tutor AI Learning System
            </span>
          </div>
          <div>&copy; 2024 Intelligent Tutor System. Adaptive Learning Platform.</div>
        </div>
      </footer>
    </div>
  );
}
