import React, { useState, useRef, useEffect } from 'react';
import { useCollege } from '../../context/CollegeContext';
import { CHATBOT_KNOWLEDGE } from '../../data/mockData';
import {
  Bot,
  Send,
  Sparkles,
  HelpCircle,
  X,
  Maximize2,
  Minimize2,
  Trash2,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface AIChatbotProps {
  isModal?: boolean;
  onClose?: () => void;
}

const DEFAULT_SUGGESTIONS = [
  'What is the minimum attendance requirement?',
  'When are the end-semester examinations?',
  'Who is the HOD for Information Technology?',
  'How do I apply for medical leave?',
  'What are the central library working hours?',
  'How is CGPA and internal marks calculated?',
  'How do I reach my class advisor?',
];

export const AIChatbot: React.FC<AIChatbotProps> = ({ isModal = false, onClose }) => {
  const { studentProfile, attendance, activeRole } = useCollege();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello ${studentProfile.name.split(' ')[0]}! I'm your CampusConnect AI Assistant. I can help you with attendance regulations, exam dates, academic calendar, leave applications, campus facilities, and department policies. What would you like to know?`,
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateAnswer = (userQuery: string): string => {
    const q = userQuery.toLowerCase();

    // Check specific custom dynamic questions
    if (q.includes('my attendance') || q.includes('my current attendance') || q.includes('shortage')) {
      const lowAttendanceSubjects = attendance.filter((a) => a.percentage < 75);
      if (lowAttendanceSubjects.length > 0) {
        return `Your overall semester attendance is currently good, but you have an alert in: ${lowAttendanceSubjects
          .map((s) => `${s.courseName} (${s.percentage}%)`)
          .join(', ')}. Minimum required is 75%. Please speak to your Class Advisor Dr. Madheshwaran (IT Cabin 204) to schedule makeup assignments.`;
      }
      return `Your overall attendance is in good standing! Your average attendance across all 6 courses is 88.6%, comfortably above the university mandatory 75% threshold.`;
    }

    if (q.includes('my cgpa') || q.includes('my gpa') || q.includes('my grade')) {
      return `Your cumulative grade point average (CGPA) is ${studentProfile.cgpa} with ${studentProfile.completedCredits} credits completed out of ${studentProfile.totalCredits}. You are currently on track for First Class with Distinction!`;
    }

    // Match knowledge base
    for (const item of CHATBOT_KNOWLEDGE) {
      if (item.triggers.some((trig) => q.includes(trig))) {
        return item.answer;
      }
    }

    // Fallback response
    return `Thank you for your question regarding "${userQuery}". For specific academic petitions or administrative inquiries, please contact your Class Advisor Dr. Madheshwaran (Room IT-204) or HOD Dr. Palani (Room IT-101) or visit the Academic Affairs Office during open counseling hours.`;
  };

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg_u_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const responseText = generateAnswer(query);
      const assistantMsg: ChatMessage = {
        id: `msg_a_${Date.now()}`,
        sender: 'assistant',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 600);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'assistant',
        text: `Chat cleared. Feel free to ask any question about courses, exams, attendance, or university facilities!`,
        timestamp: 'Just now',
      },
    ]);
  };

  const containerClasses = isModal
    ? `fixed z-50 bg-white shadow-2xl rounded-2xl border border-slate-200 flex flex-col transition-all duration-200 ${
        isExpanded
          ? 'inset-4 md:inset-12'
          : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[92vw] sm:w-[420px] h-[550px]'
      }`
    : 'bg-white rounded-xl border border-slate-200 flex flex-col h-[650px] shadow-xs';

  return (
    <div className={containerClasses}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50/80 rounded-t-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-slate-900">CampusConnect AI Assistant</h3>
              <span className="text-[10px] bg-blue-100 text-blue-700 font-semibold px-1.5 py-0.5 rounded">
                Demo AI
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Academic & Campus Knowledge Base</p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-slate-500">
          <button
            onClick={clearChat}
            className="p-1.5 hover:text-slate-800 hover:bg-slate-200/60 rounded-md transition-colors"
            title="Clear Chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          {isModal && (
            <>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 hover:text-slate-800 hover:bg-slate-200/60 rounded-md transition-colors hidden sm:block"
                title={isExpanded ? 'Restore' : 'Expand'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-1.5 hover:text-slate-800 hover:bg-slate-200/60 rounded-md transition-colors"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Suggested Quick Question Chips */}
      <div className="px-4 py-2 border-b border-slate-100 bg-slate-50/40">
        <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 mb-1.5">
          <Sparkles className="w-3 h-3 text-blue-600" />
          <span>Frequently Asked Questions:</span>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {DEFAULT_SUGGESTIONS.slice(0, 4).map((sugg, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(sugg)}
              className="text-[11px] whitespace-nowrap bg-white border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700 px-2.5 py-1 rounded-md transition-colors shadow-2xs shrink-0"
            >
              {sugg}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/20">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white shadow-xs rounded-br-xs'
                  : 'bg-white border border-slate-200 text-slate-800 shadow-xs rounded-bl-xs'
              }`}
            >
              <p>{msg.text}</p>
              <span
                className={`block text-[10px] mt-1 text-right ${
                  msg.sender === 'user' ? 'text-blue-100' : 'text-slate-400'
                }`}
              >
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-2.5 items-center text-slate-500 text-xs">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-white border border-slate-200 px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px] text-slate-400 ml-1">Searching campus handbook...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-slate-200 bg-white rounded-b-xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about attendance, exam schedule, fees, leaves..."
            className="flex-1 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white text-xs px-3 py-2.5 rounded-lg focus:outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center justify-center shrink-0 shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="flex items-center justify-between mt-2 px-1 text-[10px] text-slate-400">
          <span>Trained on University Academic Regulations & Student Handbook</span>
          <span>Role: <strong className="capitalize">{activeRole}</strong></span>
        </div>
      </div>
    </div>
  );
};
