/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BookOpen,
  Brain,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
  Search,
} from 'lucide-react';
import { CURRICULUM_DATA } from '../data/curriculum.ts';

interface CurriculumExplorerProps {
  onAskTutorTopic: (subject: string, question: string) => void;
  onTakeTopicQuiz: (subject: string, topic: string) => void;
}

export const CurriculumExplorer: React.FC<CurriculumExplorerProps> = ({
  onAskTutorTopic,
  onTakeTopicQuiz,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Computer Science', 'Physics', 'Mathematics', 'Artificial Intelligence'];

  const filteredTopics = CURRICULUM_DATA.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keyConcepts.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Classical Collegiate Header Card */}
      <div className="bg-surface-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-brass-subtle border border-brass-light/70 flex items-center justify-center text-brass shadow-2xs shrink-0">
            <BookOpen className="w-6 h-6 fill-brass/20" />
          </div>
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary tracking-tight">
              Course Syllabus & Scholastic Catalog
            </h2>
            <p className="text-muted font-serif text-xs sm:text-sm mt-0.5">
              Structured collegiate disciplines with direct Socratic inquiry links and diagnostic tests
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search concepts, topics, or theorems..."
            className="w-full bg-surface-low border border-border rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm font-serif text-primary placeholder-muted/60 focus:outline-hidden focus:border-brass transition-colors shadow-2xs"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
        <Filter className="w-4 h-4 text-brass shrink-0 ml-1" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl font-serif text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-primary text-white shadow-xs border border-brass/50'
                : 'bg-surface-card text-muted hover:text-primary hover:bg-surface border border-border'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Topic Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTopics.map((topic) => (
          <div
            key={topic.id}
            className="bg-surface-card border border-border hover:border-brass/70 rounded-2xl p-6 shadow-sm flex flex-col justify-between transition-all space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2.5">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-md font-mono text-[10px] font-bold uppercase tracking-wider bg-brass-subtle border border-brass-light/70 text-brass mb-2">
                    {topic.category}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-primary leading-tight">
                    {topic.title}
                  </h3>
                </div>
                <span className="flex items-center gap-1 font-mono text-xs text-muted shrink-0 bg-surface-low px-2.5 py-1 rounded-lg border border-border">
                  <Clock className="w-3.5 h-3.5 text-brass" />
                  ~{topic.estimatedHours} hrs
                </span>
              </div>

              <p className="font-serif text-xs sm:text-sm text-muted mb-4 leading-relaxed">
                {topic.description}
              </p>

              {/* Core Concepts */}
              <div className="mb-4">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-brass block mb-2">
                  Key Concepts Tested:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {topic.keyConcepts.map((concept, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-surface-low border border-border text-primary font-serif text-xs"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sample Inquiries */}
              <div className="bg-brass-subtle/50 p-3.5 rounded-xl border border-brass-light/60">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-brass block mb-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-brass" />
                  Sample Student Inquiry:
                </span>
                <p className="font-serif text-xs text-primary italic leading-relaxed">
                  "{topic.sampleQuestions[0]}"
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2.5 pt-4 border-t border-border">
              <button
                onClick={() => onAskTutorTopic(topic.category, topic.sampleQuestions[0])}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-serif text-xs font-semibold bg-surface-low hover:bg-surface text-primary border border-border hover:border-brass transition-colors cursor-pointer"
              >
                <Brain className="w-3.5 h-3.5 text-brass" />
                <span>Ask AI Tutor</span>
              </button>

              <button
                onClick={() => onTakeTopicQuiz(topic.category, topic.title)}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-serif text-xs font-semibold bg-primary hover:bg-primary-hover text-white border border-brass/50 transition-colors shadow-2xs cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-brass-light" />
                <span>Diagnostic Quiz</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
