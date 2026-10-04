/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Minimize2,
  Maximize2,
  Send,
  Bot,
  User,
  Volume2,
  VolumeX,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';
import { StudentProfile, TutorMode, ChatMessage } from '../types.ts';

interface AIAssistantWidgetProps {
  student: StudentProfile | null;
  activeTab: string;
  onOpenFullTutor: () => void;
  onNavigateToQuiz?: (subject: string, topic?: string) => void;
}

export const AIAssistantWidget: React.FC<AIAssistantWidgetProps> = ({
  student,
  activeTab,
  onOpenFullTutor,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputText, setInputText] = useState('');
  const [tutorMode, setTutorMode] = useState<TutorMode>('socratic');
  const [isLoading, setIsLoading] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-assistant',
      role: 'assistant',
      content: `### Greetings ${student?.name ? student.name.split(' ')[0] : 'Scholar'}! 🎓\n\nI am your **AI Learning Assistant**.\n\n* **Socratic Hints**: Ask for clues on quiz questions without spoiling answers.\n* **Concept Derivations**: Ask for simple analogies (ELI5) or technical rigor.\n* **Weak Area Advice**: Ask how to overcome diagnosed knowledge gaps.\n\nHow may I assist your inquiries today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized, isLoading]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, isMinimized]);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const getContextPrompts = () => {
    const studentFocus = student?.preferredSubject || 'Computer Science';
    const topWeakArea = student?.weakAreas[0]?.subtopic;

    switch (activeTab) {
      case 'quiz':
        return [
          { label: '💡 Socratic Clue', text: 'Provide a subtle first-principles hint without revealing the final answer.' },
          { label: '👶 Explain Concept', text: 'Can you explain the core theorem behind this question with an intuitive analogy?' },
        ];
      case 'analytics':
        return [
          { label: '📊 Analyze Weak Areas', text: topWeakArea ? `How can I systematically master "${topWeakArea}"?` : 'How does the Bayesian student model track my competencies?' },
          { label: '📅 Study Plan', text: `Recommend a high-yield 3-day study schedule for my ${studentFocus} weak areas.` },
        ];
      default:
        return [
          { label: '🎓 Socratic Tip', text: `How can I optimize my retention in ${studentFocus} using spaced retrieval?` },
          { label: '🧩 Quick Concept Check', text: 'Give me a fast conceptual checkpoint question to test my understanding!' },
        ];
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
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
          subject: student?.preferredSubject || 'Computer Science',
          mode: tutorMode,
          enableRealTimeSearch: true,
          currentQuestionContext: `Student is currently viewing the ${activeTab.toUpperCase()} section.`,
        }),
      });

      const data = await res.json();
      if (data.success && data.reply) {
        const assistantMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sources: data.sources,
          relatedQuestions: data.relatedQuestions,
          isRealTimeSearch: data.isRealTimeSearch,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(data.message || 'Failed to get AI assistant response');
      }
    } catch (err) {
      console.error('AI Assistant error:', err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `I experienced a brief connection hiccup. Please ask again or visit the **Interactive AI Tutor** tab!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
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
    const cleanText = text.replace(/[*#`_\[\]()]/g, ' ').replace(/\s+/g, ' ').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(messageId);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <aside aria-label="AI Study Assistant" className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Floating Assistant Drawer (Classical Light Style) */}
      {isOpen && (
        <div
          className={`bg-surface-card border border-border rounded-2xl shadow-xl overflow-hidden flex flex-col transition-all duration-300 mb-3 ${
            isMinimized
              ? 'h-14 w-80 sm:w-96'
              : 'h-[500px] max-h-[85vh] w-[92vw] sm:w-[420px]'
          }`}
        >
          {/* Header Bar */}
          <div className="bg-primary text-white border-b border-brass/40 px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brass-subtle/20 border border-brass-light/40 flex items-center justify-center text-brass-light shadow-2xs">
                <Sparkles className="w-4 h-4 text-brass-light" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-serif text-sm font-bold text-white leading-none">AI Study Assistant</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[10px] text-brass-light/80 font-mono mt-0.5">
                  Socratic Guide &bull; {student?.preferredSubject || 'Collegiate'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-300">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenFullTutor();
                }}
                className="p-1.5 hover:text-brass-light hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                title="Open Full Tutor View"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:text-rose-300 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Style Selector */}
              <div className="bg-surface-low border-b border-border px-3 py-2 flex items-center justify-between text-xs shrink-0 font-serif">
                <span className="text-muted font-medium">Pedagogy Style:</span>
                <div className="flex items-center gap-1">
                  {(
                    [
                      { id: 'socratic', label: 'Socratic' },
                      { id: 'eli5', label: 'Simple' },
                      { id: 'deep_dive', label: 'Deep Dive' },
                    ] as const
                  ).map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setTutorMode(m.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        tutorMode === m.id
                          ? 'bg-primary text-white shadow-2xs'
                          : 'text-muted hover:text-primary hover:bg-surface'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Stream */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {m.role === 'assistant' && (
                      <div className="w-6 h-6 rounded-lg bg-brass-subtle border border-brass-light/70 text-brass flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl p-3 leading-relaxed relative ${
                        m.role === 'user'
                          ? 'bg-primary text-white rounded-tr-none font-serif text-[13px] shadow-2xs'
                          : 'bg-brass-subtle/50 border border-brass-light/60 text-primary rounded-tl-none font-serif text-[13px]'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{m.content}</div>

                      {m.role === 'assistant' && (
                        <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-brass-light/40 text-[10px] text-muted font-mono">
                          <span>{m.timestamp}</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleSpeak(m.id, m.content)}
                              className="hover:text-primary transition-colors cursor-pointer"
                              title={speakingMessageId === m.id ? 'Stop audio' : 'Read aloud'}
                            >
                              {speakingMessageId === m.id ? (
                                <VolumeX className="w-3 h-3 text-rose-700 animate-pulse" />
                              ) : (
                                <Volume2 className="w-3 h-3" />
                              )}
                            </button>
                            <button
                              onClick={() => handleCopy(m.id, m.content)}
                              className="hover:text-primary transition-colors cursor-pointer"
                              title="Copy"
                            >
                              {copiedId === m.id ? (
                                <Check className="w-3 h-3 text-emerald-700" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {m.role === 'user' && (
                      <div className="w-6 h-6 rounded-lg bg-surface-low border border-border text-primary flex items-center justify-center shrink-0 mt-0.5 font-bold font-serif text-[11px]">
                        {student?.name?.charAt(0) || 'S'}
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-center gap-2 text-xs text-brass font-serif bg-brass-subtle border border-brass-light/60 p-2.5 rounded-xl rounded-tl-none w-fit">
                    <Sparkles className="w-3.5 h-3.5 animate-spin text-brass" />
                    <span>Synthesizing pedagogical explanation...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Context Prompts */}
              <div className="px-3 py-1.5 bg-surface-low border-t border-border shrink-0">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {getContextPrompts().map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(p.text)}
                      disabled={isLoading}
                      className="px-2.5 py-1 rounded-full bg-surface-card hover:bg-brass-subtle text-primary border border-border hover:border-brass text-[11px] font-serif font-medium whitespace-nowrap transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-3 bg-surface-card border-t border-border flex items-center gap-2 shrink-0"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Ask Socratic Assistant about ${activeTab === 'quiz' ? 'this quiz question...' : 'any theorem...'}`}
                  disabled={isLoading}
                  className="flex-1 bg-surface-low border border-border rounded-xl px-3.5 py-2 text-xs font-serif text-primary placeholder-muted/60 focus:outline-hidden focus:border-brass transition-colors disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isLoading}
                  className="w-8 h-8 rounded-xl bg-primary hover:bg-primary-hover active:scale-95 disabled:opacity-40 text-white flex items-center justify-center transition-all cursor-pointer shrink-0 border border-brass/40"
                  title="Send"
                >
                  <Send className="w-3.5 h-3.5 text-brass-light" />
                </button>
              </form>
            </>
          )}
        </div>
      )}

      {/* Floating Launcher Action Button (Classical Navy & Brass) */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="group relative flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-white shadow-md border-2 border-brass-light/80 active:scale-95 transition-all cursor-pointer"
          title="Open AI Study Assistant"
        >
          <div className="w-6 h-6 rounded-full bg-brass-subtle/20 flex items-center justify-center border border-brass-light/40">
            <Sparkles className="w-3.5 h-3.5 text-brass-light" />
          </div>

          <div className="flex flex-col text-left">
            <span className="font-serif text-xs font-bold leading-tight flex items-center gap-1.5 text-white">
              AI Assistant
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </span>
            <span className="font-mono text-[9px] text-brass-light uppercase tracking-wider leading-tight opacity-90 hidden sm:inline">
              Socratic Inquiries
            </span>
          </div>
        </button>
      )}
    </aside>
  );
};
