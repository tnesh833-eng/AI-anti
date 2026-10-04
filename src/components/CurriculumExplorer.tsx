import React, { useState } from 'react';
import {
  BookOpen,
  Brain,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Course Syllabus & Knowledge Catalog</h2>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Structured educational curriculum with instant NLP tutoring links and diagnostic tests
          </p>
        </div>

        {/* Search */}
        <div className="w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search concepts, topics, or formulas..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
        <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-750'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Topic Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredTopics.map((topic) => (
          <div
            key={topic.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-1.5">
                    {topic.category}
                  </span>
                  <h3 className="text-lg font-bold text-white leading-snug">{topic.title}</h3>
                </div>
                <span className="flex items-center gap-1 text-[11px] text-slate-400 shrink-0">
                  <Clock className="w-3 h-3 text-indigo-400" />
                  ~{topic.estimatedHours} hrs
                </span>
              </div>

              <p className="text-xs text-slate-300 mb-4 leading-relaxed">{topic.description}</p>

              {/* Core Concepts */}
              <div className="mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Key Concepts Tested:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {topic.keyConcepts.map((concept, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700/80 text-slate-300 text-xs"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sample Inquiries */}
              <div className="mb-4 bg-slate-850 p-3 rounded-2xl border border-slate-800/80">
                <span className="text-[11px] font-semibold text-indigo-300 block mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  Sample Student Inquiry:
                </span>
                <p className="text-xs text-slate-300 italic">"{topic.sampleQuestions[0]}"</p>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-800">
              <button
                onClick={() => onAskTutorTopic(topic.category, topic.sampleQuestions[0])}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-200 border border-indigo-500/40 transition-colors"
              >
                <Brain className="w-3.5 h-3.5" />
                Ask Tutor
              </button>

              <button
                onClick={() => onTakeTopicQuiz(topic.category, topic.title)}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-white border border-slate-700 transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Take Quiz
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
