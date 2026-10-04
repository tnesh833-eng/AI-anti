/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  User,
  Sparkles,
  Volume2,
  VolumeX,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  Code2,
  Lightbulb,
  HelpCircle,
  AlertCircle,
  Compass,
  Globe,
  Bot,
  ExternalLink,
  Brain,
} from 'lucide-react';
import { ChatMessage, StudentProfile, TutorMode } from '../types.ts';

interface TutorChatProps {
  student: StudentProfile | null;
  onNavigateToQuiz: (subject: string, topic?: string) => void;
}

const STARTER_PROMPTS = [
  {
    label: 'Recursion Call Stack',
    subject: 'Computer Science',
    mode: 'socratic' as TutorMode,
    text: 'How does the operating system call stack keep track of recursive function returns, and what causes a stack overflow?',
  },
  {
    label: 'Latest AI Paradigms',
    subject: 'Artificial Intelligence',
    mode: 'deep_dive' as TutorMode,
    text: 'What are the newest architectural paradigms in AI reasoning models and multimodal grounding this year?',
  },
  {
    label: 'Big-O vs Nested Loops',
    subject: 'Computer Science',
    mode: 'deep_dive' as TutorMode,
    text: 'Can you show me how to mathematically analyze the time complexity of two nested loops where the inner loop runs j < i times?',
  },
  {
    label: 'Rotational Inertia Analogy',
    subject: 'Physics & Mechanics',
    mode: 'eli5' as TutorMode,
    text: 'Explain Moment of Inertia like I am 12 years old: why does an object with mass farther from the axis feel harder to rotate?',
  },
];

export const TutorChat: React.FC<TutorChatProps> = ({ student, onNavigateToQuiz }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `### Welcome to the Intelligent AI Tutor & Study Assistant! 🎓\n\nI am your personalized AI tutor powered by Gemini. I adapt to your unique learning style, track your mastery levels, and help resolve knowledge gaps.\n\n* **Identified Weak Areas**: ${
        student?.weakAreas.length
          ? student.weakAreas.map((w) => `\`${w.subtopic}\``).join(', ')
          : 'None detected yet—take a diagnostic quiz to pinpoint focus areas!'
      }\n\n* **Active Student Model**: Tailored specifically for **${student?.name || 'you'}** (${student?.gradeLevel || 'STEM Scholar'}).\n\nAsk me any concept, request Socratic hints, or select one of the study prompts below!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(student?.preferredSubject || 'Computer Science');
  const [tutorMode, setTutorMode] = useState<TutorMode>('socratic');
  const [enableRealTimeSearch, setEnableRealTimeSearch] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (student?.preferredSubject) {
      setSelectedSubject(student.preferredSubject);
    }
  }, [student]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      subject: selectedSubject,
      mode: tutorMode,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const historyPayload = messages.slice(-5).map((m) => ({
        role: m.role,
        content: m.content,
      }));
      historyPayload.push({ role: 'user', content: query });

      const res = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyPayload,
          subject: selectedSubject,
          mode: tutorMode,
          enableRealTimeSearch,
        }),
      });

      const data = await res.json();
      if (data.success && data.reply) {
        const assistantMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          subject: selectedSubject,
          mode: tutorMode,
          sources: data.sources,
          relatedQuestions: data.relatedQuestions,
          isRealTimeSearch: data.isRealTimeSearch,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error(data.message || 'Failed to get tutor reply');
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ **Tutoring Notice**: I experienced a temporary connection delay. Please ask again or try switching tutoring modes!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = (messageId: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingMessageId === messageId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text
      .replace(/###/g, '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/`/g, '')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(messageId);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = (messageId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(messageId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: `### Fresh Session Started 🚀\n\nI am ready for your questions in **${selectedSubject}** with **${tutorMode.replace('_', ' ').toUpperCase()}** mode!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const renderFormattedMarkdown = (text: string) => {
    const lines = text.split('\n');
    let inCodeBlock = false;
    let codeBuffer: string[] = [];
    const elements: React.ReactNode[] = [];

    lines.forEach((line, index) => {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <div key={`code-${index}`} className="my-3 bg-primary text-emerald-300 border border-slate-700 rounded-xl p-3.5 overflow-x-auto text-xs font-mono shadow-inner">
              <pre>{codeBuffer.join('\n')}</pre>
            </div>
          );
          codeBuffer = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        return;
      }

      if (line.startsWith('### ')) {
        elements.push(
          <h4 key={index} className="font-serif text-base font-bold text-brass mt-3 mb-1.5 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brass inline" />
            {line.replace('### ', '')}
          </h4>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h3 key={index} className="font-serif text-lg font-bold text-primary mt-4 mb-2">
            {line.replace('## ', '')}
          </h3>
        );
      } else if (line.startsWith('* ') || line.startsWith('- ')) {
        const itemContent = line.replace(/^[\*\-]\s+/, '');
        elements.push(
          <li key={index} className="ml-5 list-disc text-primary font-serif text-sm leading-relaxed my-0.5">
            {formatInlineText(itemContent)}
          </li>
        );
      } else if (line.trim() === '') {
        elements.push(<div key={index} className="h-2" />);
      } else {
        elements.push(
          <p key={index} className="font-serif text-sm text-primary leading-relaxed">
            {formatInlineText(line)}
          </p>
        );
      }
    });

    if (inCodeBlock && codeBuffer.length > 0) {
      elements.push(
        <div key="code-final" className="my-3 bg-primary text-emerald-300 border border-slate-700 rounded-xl p-3.5 overflow-x-auto text-xs font-mono shadow-inner">
          <pre>{codeBuffer.join('\n')}</pre>
        </div>
      );
    }

    return elements;
  };

  const formatInlineText = (text: string) => {
    const linkRegex = /\[(.*?)\]\((.*?)\)/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(...renderBoldAndCode(text.substring(lastIndex, match.index)));
      }
      const linkText = match[1];
      const linkUrl = match[2];
      parts.push(
        <a
          key={`link-${match.index}`}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brass hover:text-primary underline font-medium inline-flex items-center gap-1 font-serif"
        >
          {linkText}
          <ExternalLink className="w-3 h-3 inline" />
        </a>
      );
      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(...renderBoldAndCode(text.substring(lastIndex)));
    }

    return parts.length > 0 ? parts : text;
  };

  const renderBoldAndCode = (segment: string) => {
    const parts = segment.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-primary font-serif">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="px-1.5 py-0.5 rounded bg-surface border border-border text-primary text-xs font-mono">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Header Card (Classical Scholastic Style) */}
      <div className="bg-surface-card border border-border rounded-2xl p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-brass-subtle border border-brass-light/70 flex items-center justify-center text-brass shadow-2xs shrink-0">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-primary tracking-tight">
                Interactive AI Socratic Tutor
              </h2>
              <p className="font-serif text-xs sm:text-sm text-muted mt-0.5">
                Scholastic pedagogical dialogue calibrated for collegiate understanding & first principles
              </p>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {student?.weakAreas && student.weakAreas.length > 0 && (
              <button
                onClick={() => onNavigateToQuiz(selectedSubject, student.weakAreas[0].subtopic)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-serif font-semibold bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100 transition-colors cursor-pointer"
              >
                <AlertCircle className="w-4 h-4 text-rose-700" />
                <span>Quiz on Weak Area</span>
              </button>
            )}

            <button
              onClick={() => setEnableRealTimeSearch(!enableRealTimeSearch)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-serif font-semibold border transition-all cursor-pointer ${
                enableRealTimeSearch
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-surface-low text-muted border-border hover:text-primary'
              }`}
            >
              <Globe className={`w-3.5 h-3.5 ${enableRealTimeSearch ? 'text-emerald-700' : 'text-muted'}`} />
              <span>{enableRealTimeSearch ? 'Grounding On' : 'Grounding Off'}</span>
            </button>

            <button
              onClick={handleClearHistory}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-serif font-semibold bg-surface-low hover:bg-surface text-muted hover:text-primary border border-border transition-colors cursor-pointer"
              title="Reset conversation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Controls Toolbar: Subject & Mode Selector */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mt-5 pt-4 border-t border-border">
          {/* Subject Dropdown */}
          <div className="md:col-span-4">
            <div className="relative">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full bg-surface-low border border-border rounded-xl px-3.5 py-2 text-xs font-serif font-semibold text-primary focus:outline-hidden focus:border-brass transition-colors cursor-pointer"
              >
                <option value="Computer Science">Computer Science & Algorithms</option>
                <option value="Physics & Mechanics">Physics & Mechanics</option>
                <option value="Mathematics & Calculus">Mathematics & Calculus</option>
                <option value="Artificial Intelligence">Artificial Intelligence & ML</option>
                <option value="Chemistry">General Chemistry</option>
              </select>
            </div>
          </div>

          {/* Mode Selector Pills */}
          <div className="md:col-span-8 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {(
              [
                { id: 'socratic', label: 'Socratic Guide', icon: User },
                { id: 'deep_dive', label: 'Deep Dive', icon: Compass },
                { id: 'eli5', label: 'ELI5 Analogy', icon: Lightbulb },
                { id: 'practice', label: 'Practice Drill', icon: HelpCircle },
                { id: 'code_debug', label: 'Code Debug', icon: Code2 },
              ] as const
            ).map((m) => {
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  onClick={() => setTutorMode(m.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-serif font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    tutorMode === m.id
                      ? 'bg-primary text-white border border-brass shadow-xs'
                      : 'bg-surface-low text-primary border border-border hover:bg-surface'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Chat Conversation Container */}
      <div className="bg-surface-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col h-[600px]">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-9 h-9 rounded-xl bg-brass-subtle border border-brass-light/70 text-brass flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <Bot className="w-5 h-5" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-5 leading-relaxed relative ${
                  m.role === 'user'
                    ? 'bg-primary text-white rounded-tr-none shadow-xs font-serif'
                    : 'bg-brass-subtle/40 border border-brass-light/60 text-primary rounded-tl-none font-serif shadow-2xs'
                }`}
              >
                <div>{renderFormattedMarkdown(m.content)}</div>

                {/* Sources if present */}
                {m.sources && m.sources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted block mb-1.5">
                      Grounding References:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {m.sources.slice(0, 3).map((s, idx) => (
                        <a
                          key={idx}
                          href={s.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface border border-border text-[11px] text-brass hover:text-primary font-serif font-medium"
                        >
                          <span className="truncate max-w-[140px]">{s.title}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer of assistant message */}
                {m.role === 'assistant' && (
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-brass-light/40 text-[11px] text-muted font-mono">
                    <span>{m.timestamp}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSpeak(m.id, m.content)}
                        className="hover:text-primary transition-colors cursor-pointer"
                        title={speakingMessageId === m.id ? 'Stop audio' : 'Read aloud'}
                      >
                        {speakingMessageId === m.id ? (
                          <VolumeX className="w-3.5 h-3.5 text-rose-700 animate-pulse" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleCopy(m.id, m.content)}
                        className="hover:text-primary transition-colors cursor-pointer"
                        title="Copy text"
                      >
                        {copiedId === m.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-700" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {m.role === 'user' && (
                <div className="w-9 h-9 rounded-xl bg-surface-low border border-border text-primary flex items-center justify-center shrink-0 mt-0.5 font-bold font-serif text-sm">
                  {student?.name?.charAt(0) || 'S'}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3 text-xs text-brass font-serif bg-brass-subtle border border-brass-light/70 p-4 rounded-2xl rounded-tl-none w-fit shadow-2xs">
              <Sparkles className="w-4 h-4 animate-spin text-brass" />
              <span>AI Tutor is reasoning and synthesizing Socratic guidance...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Starter Prompt Chips */}
        <div className="pt-3 pb-2 border-t border-border">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {STARTER_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedSubject(p.subject);
                  setTutorMode(p.mode);
                  handleSendMessage(p.text);
                }}
                disabled={isLoading}
                className="px-3 py-1.5 rounded-full bg-surface-low hover:bg-brass-subtle text-primary border border-border hover:border-brass/60 font-serif text-xs font-medium whitespace-nowrap transition-all cursor-pointer shrink-0 disabled:opacity-50"
              >
                ⚡ {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Input Field & Send Button */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="pt-2 flex items-center gap-3"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Ask AI Tutor about ${selectedSubject}, theorems, algorithms, or code...`}
            disabled={isLoading}
            className="flex-1 bg-surface-low border border-border rounded-xl px-4 py-3.5 text-sm font-serif text-primary placeholder-muted/60 focus:outline-hidden focus:border-brass transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="h-12 px-6 rounded-xl bg-primary hover:bg-primary-hover active:scale-95 disabled:opacity-40 text-white font-serif font-semibold text-sm flex items-center justify-center gap-2 border border-brass/50 transition-all cursor-pointer shrink-0"
          >
            <span>Ask Tutor</span>
            <Send className="w-4 h-4 text-brass-light" />
          </button>
        </form>
      </div>
    </div>
  );
};
