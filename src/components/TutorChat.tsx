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
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ChatMessage, StudentProfile, TutorMode, SerpSource } from '../types.ts';

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
    label: 'Real-Time: Latest AI Models',
    subject: 'Artificial Intelligence',
    mode: 'deep_dive' as TutorMode,
    text: 'What are the newest architectural paradigms in AI reasoning and large multimodal models this year?',
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
      content: `### Welcome to Live Tutoring! 🎓\n\nI am your expert human tutor. I am here to provide real-time, personalized guidance.\n\n* **Identified Weak Areas**: ${
        student?.weakAreas.length
          ? student.weakAreas.map((w) => `\`${w.subtopic}\``).join(', ')
          : 'None detected yet—take a diagnostic quiz to identify focus areas!'
      }\n\n* **Live Connection**: You are now connected to a subject matter expert. Feel free to ask any question!`,
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
  const [expandedSources, setExpandedSources] = useState<Record<string, boolean>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync subject when student changes
  useEffect(() => {
    if (student?.preferredSubject) {
      setSelectedSubject(student.preferredSubject);
    }
  }, [student]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      subject: selectedSubject,
      mode: tutorMode,
      isRealTimeSearch: enableRealTimeSearch,
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          subject: selectedSubject,
          mode: tutorMode,
          enableRealTimeSearch,
        }),
      });

      const data = await response.json();

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
        content: `⚠️ **Tutoring Service Notice**: The tutor is currently experiencing connection issues. Please try again or review the foundational definitions in **${selectedSubject}**!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSources = (msgId: string) => {
    setExpandedSources((prev) => ({
      ...prev,
      [msgId]: !prev[msgId],
    }));
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
            <div key={`code-${index}`} className="my-3 bg-slate-900 border border-slate-700/80 rounded-lg p-3 overflow-x-auto text-xs font-mono text-emerald-300">
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
          <h4 key={index} className="text-base font-bold text-indigo-200 mt-3 mb-1.5 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400 inline" />
            {line.replace('### ', '')}
          </h4>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h3 key={index} className="text-lg font-bold text-white mt-4 mb-2">
            {line.replace('## ', '')}
          </h3>
        );
      } else if (line.startsWith('* ') || line.startsWith('- ')) {
        const itemContent = line.replace(/^[\*\-]\s+/, '');
        elements.push(
          <li key={index} className="ml-5 list-disc text-slate-200 text-sm leading-relaxed my-0.5">
            {formatInlineText(itemContent)}
          </li>
        );
      } else if (line.trim() === '') {
        elements.push(<div key={index} className="h-2" />);
      } else {
        elements.push(
          <p key={index} className="text-sm text-slate-200 leading-relaxed">
            {formatInlineText(line)}
          </p>
        );
      }
    });

    if (inCodeBlock && codeBuffer.length > 0) {
      elements.push(
        <div key="code-final" className="my-3 bg-slate-900 border border-slate-700 rounded-lg p-3 overflow-x-auto text-xs font-mono text-emerald-300">
          <pre>{codeBuffer.join('\n')}</pre>
        </div>
      );
    }

    return elements;
  };

  const formatInlineText = (text: string) => {
    // Handle Markdown links [text](url)
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
          className="text-indigo-400 hover:text-indigo-300 underline font-medium inline-flex items-center gap-0.5"
        >
          {linkText}
          <ExternalLink className="w-3 h-3 inline ml-0.5" />
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
          <strong key={i} className="font-semibold text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-indigo-300 text-xs font-mono">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] max-w-6xl mx-auto px-4 sm:px-6 py-4 animate-slide-up">
      {/* Top Controls: Subject, Mode, Real-Time SerpApi Grounding, Reset */}
      <div className="glass-panel rounded-2xl p-3 mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Subject selector */}
          <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs">
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-transparent text-slate-100 font-medium outline-none cursor-pointer pr-1"
            >
              <option value="Computer Science" className="bg-slate-800">Computer Science</option>
              <option value="Physics & Mechanics" className="bg-slate-800">Physics & Mechanics</option>
              <option value="Mathematics & Calculus" className="bg-slate-800">Mathematics & Calculus</option>
              <option value="Artificial Intelligence" className="bg-slate-800">Artificial Intelligence</option>
              <option value="Chemistry" className="bg-slate-800">Chemistry</option>
            </select>
          </div>

          {/* Mode Selector Buttons */}
          <div className="flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/60 overflow-x-auto">
            <button
              onClick={() => setTutorMode('socratic')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                tutorMode === 'socratic'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="Guides you step-by-step with leading questions rather than answers"
            >
              <User className="w-3 h-3" />
              Socratic Guide
            </button>
            <button
              onClick={() => setTutorMode('deep_dive')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                tutorMode === 'deep_dive'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="Rigorous technical breakdown and formal proofs"
            >
              <Compass className="w-3 h-3" />
              Deep Dive
            </button>
            <button
              onClick={() => setTutorMode('eli5')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                tutorMode === 'eli5'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="Explain like I am 12 with simple real-world analogies"
            >
              <Lightbulb className="w-3 h-3" />
              ELI5 Analogy
            </button>
            <button
              onClick={() => setTutorMode('practice')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                tutorMode === 'practice'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="Provides a challenge problem and step-by-step walkthrough"
            >
              <HelpCircle className="w-3 h-3" />
              Practice Drill
            </button>
            <button
              onClick={() => setTutorMode('code_debug')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                tutorMode === 'code_debug'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="Analyzes algorithmic logic & code traps"
            >
              <Code2 className="w-3 h-3" />
              Code Debug
            </button>
          </div>
        </div>

        {/* Real-time search toggle & actions */}
        <div className="flex items-center gap-2">
          {/* Real-Time SerpApi Grounding Toggle */}
          <button
            onClick={() => setEnableRealTimeSearch(!enableRealTimeSearch)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
              enableRealTimeSearch
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title="Toggle priority support"
          >
            <Globe className={`w-3.5 h-3.5 ${enableRealTimeSearch ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span>{enableRealTimeSearch ? 'Priority Support On' : 'Priority Support Off'}</span>
          </button>

          {student?.weakAreas && student.weakAreas.length > 0 && (
            <button
              onClick={() => onNavigateToQuiz(selectedSubject, student.weakAreas[0].subtopic)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 transition-colors"
              title="Launch adaptive quiz targeting your diagnosed weak area"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              Quiz on Weak Area
            </button>
          )}

          <button
            onClick={handleClearHistory}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
            title="Clear conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto glass-panel rounded-2xl p-4 sm:p-5 space-y-4 shadow-inner">
        {messages.map((message) => {
          const isUser = message.role === 'user';
          const hasSources = message.sources && message.sources.length > 0;
          const hasRelated = message.relatedQuestions && message.relatedQuestions.length > 0;
          const isSourceExpanded = expandedSources[message.id] ?? false;

          return (
            <div
              key={message.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shrink-0 shadow-md">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-3 shadow-md ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-800/90 text-slate-100 border border-slate-700/60 rounded-tl-none'
                }`}
              >
                {/* Meta details for assistant message */}
                {!isUser && (
                  <div className="flex items-center justify-between border-b border-slate-700/60 pb-1.5 mb-2 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 text-indigo-300 font-medium">
                      <Sparkles className="w-3 h-3" />
                      Expert Tutor • {message.mode ? message.mode.replace('_', ' ').toUpperCase() : 'Live'}
                      {message.isRealTimeSearch && (
                        <span className="ml-1.5 px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold inline-flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" />
                          Verified
                        </span>
                      )}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSpeak(message.id, message.content)}
                        className="hover:text-indigo-300 transition-colors p-0.5"
                        title={speakingMessageId === message.id ? 'Stop reading' : 'Read explanation aloud'}
                      >
                        {speakingMessageId === message.id ? (
                          <VolumeX className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleCopy(message.id, message.content)}
                        className="hover:text-indigo-300 transition-colors p-0.5"
                        title="Copy to clipboard"
                      >
                        {copiedId === message.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <span>{message.timestamp}</span>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="space-y-1">
                  {isUser ? (
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  ) : (
                    <div>{renderFormattedMarkdown(message.content)}</div>
                  )}
                </div>

                {/* Real-Time SerpApi Grounding Sources Section */}
                {!isUser && hasSources && (
                  <div className="mt-3 pt-3 border-t border-slate-700/60">
                    <button
                      onClick={() => toggleSources(message.id)}
                      className="flex items-center justify-between w-full text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      <span className="flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5" />
                        Verified Web Sources ({message.sources!.length})
                      </span>
                      {isSourceExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {isSourceExpanded && (
                      <div className="mt-2 space-y-2">
                        {message.sources!.map((source, sIdx) => (
                          <a
                            key={sIdx}
                            href={source.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-2 rounded-xl bg-slate-900/80 border border-slate-700/80 hover:border-indigo-500/60 transition-all text-xs group"
                          >
                            <div className="flex items-center justify-between text-indigo-300 font-semibold group-hover:text-indigo-200">
                              <span className="truncate pr-2">{source.title}</span>
                              <ExternalLink className="w-3 h-3 shrink-0 opacity-60 group-hover:opacity-100" />
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                              {source.snippet}
                            </p>
                            {source.source && (
                              <span className="inline-block mt-1 text-[10px] text-slate-500 font-mono">
                                {source.source}
                              </span>
                            )}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* People Also Ask (Real-Time Questions) */}
                {!isUser && hasRelated && (
                  <div className="mt-3 pt-2.5 border-t border-slate-700/40">
                    <span className="text-[11px] font-semibold text-slate-400 block mb-1.5 flex items-center gap-1">
                      <HelpCircle className="w-3 h-3 text-indigo-400" />
                      People Also Ask (Live Google Queries):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {message.relatedQuestions!.map((q, qIdx) => (
                        <button
                          key={qIdx}
                          onClick={() => handleSendMessage(q)}
                          disabled={isLoading}
                          className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-indigo-200 hover:text-white hover:bg-slate-750 transition-colors text-left"
                        >
                          → {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {isUser && (
                  <div className="text-[10px] text-indigo-200 mt-1 text-right">
                    {message.timestamp}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shrink-0 animate-pulse">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 rounded-tl-none text-slate-300 text-sm flex items-center gap-3">
              <div className="flex space-x-1.5">
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-xs text-slate-400">
                Tutor is typing...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Starters */}
      <div className="py-2 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-xs text-slate-400 font-medium shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          Quick Ask:
        </span>
        {STARTER_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => {
              setSelectedSubject(prompt.subject);
              setTutorMode(prompt.mode);
              handleSendMessage(prompt.text);
            }}
            disabled={isLoading}
            className="text-xs px-2.5 py-1 rounded-full bg-slate-800/90 border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-700 whitespace-nowrap transition-all shadow-sm flex items-center gap-1.5"
          >
            <span>{prompt.label}</span>
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="glass-panel border-t border-slate-700/50 rounded-2xl p-2 shadow-lg flex items-center gap-2 mt-1"
      >
        <div
          className="flex items-center pl-2 text-slate-400"
          title={enableRealTimeSearch ? 'SerpApi Live Search Active' : 'Live Search Off'}
        >
          <Globe
            className={`w-4 h-4 ${enableRealTimeSearch ? 'text-emerald-400' : 'text-slate-500'}`}
          />
        </div>
        <textarea
          rows={1}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder={`Ask the Expert Tutor anything in ${selectedSubject}...`}
          className="flex-1 bg-transparent px-2 py-1.5 text-sm text-slate-100 placeholder-slate-500 outline-none resize-none max-h-32"
          disabled={isLoading}
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="btn-primary flex items-center justify-center shrink-0 w-10 h-10 p-0 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
