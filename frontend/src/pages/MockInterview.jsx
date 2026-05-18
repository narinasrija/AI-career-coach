import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Bot, User, RotateCcw, Sparkles, Mic } from 'lucide-react';
import { aiAPI } from '../utils/api';

const MockInterview = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [interviewType, setInterviewType] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startInterview = async (type) => {
    setInterviewType(type);
    setStarted(true);
    setLoading(true);

    const systemMessage = `Start a ${type} interview. Ask me the first question.`;
    
    try {
      const { data } = await aiAPI.mockInterview({
        message: systemMessage,
        history: [],
      });
      setMessages([
        { role: 'assistant', content: data.reply }
      ]);
    } catch (err) {
      setMessages([
        { role: 'assistant', content: `Welcome to your ${type} interview! Let's begin.\n\nTell me about yourself and your experience in software development.` }
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    
    const userMessage = input.trim();
    setInput('');
    
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const { data } = await aiAPI.mockInterview({
        message: userMessage,
        history: newMessages.map(m => ({ role: m.role, content: m.content })),
      });
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm having trouble connecting right now. Let me rephrase — could you elaborate more on your previous answer?" 
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetInterview = () => {
    setMessages([]);
    setStarted(false);
    setInterviewType('');
    setInput('');
  };

  const interviewTypes = [
    { type: 'Technical', emoji: '💻', desc: 'Data structures, algorithms, system design', color: 'primary' },
    { type: 'Behavioral', emoji: '🤝', desc: 'STAR method, leadership, teamwork', color: 'secondary' },
    { type: 'HR', emoji: '👔', desc: 'Salary, culture fit, career goals', color: 'blue-400' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      <div className="glow-orb glow-orb-2" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 rounded-xl bg-secondary/10 border border-secondary/20">
                <MessageSquare className="h-6 w-6 text-secondary" />
              </div>
              <h1 className="text-3xl font-bold" id="interview-title">Mock Interview</h1>
            </div>
            <p className="text-gray-400 ml-14">Practice with our AI interviewer and get real-time feedback.</p>
          </div>
          {started && (
            <button
              onClick={resetInterview}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white transition text-sm"
            >
              <RotateCcw className="h-4 w-4" />
              <span>New Interview</span>
            </button>
          )}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {!started ? (
          /* Interview Type Selection */
          <motion.div
            key="selection"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid md:grid-cols-3 gap-6"
          >
            {interviewTypes.map((item) => (
              <motion.button
                key={item.type}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => startInterview(item.type)}
                className="glass-panel p-8 text-left group transition-all hover:border-white/20"
                id={`interview-type-${item.type.toLowerCase()}`}
              >
                <div className="text-4xl mb-4">{item.emoji}</div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-white transition">{item.type}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                <div className={`mt-4 inline-flex items-center space-x-1 text-${item.color} text-sm font-medium opacity-0 group-hover:opacity-100 transition`}>
                  <span>Start</span>
                  <Sparkles className="h-4 w-4" />
                </div>
              </motion.button>
            ))}
          </motion.div>
        ) : (
          /* Chat Interface */
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-panel overflow-hidden flex flex-col"
            style={{ height: 'calc(100vh - 250px)', minHeight: '500px' }}
          >
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-white/5 flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-secondary" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-surface" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">AI Interviewer</h3>
                <p className="text-xs text-gray-400">{interviewType} Interview • Active</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6" id="interview-messages">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                      msg.role === 'user' 
                        ? 'bg-primary/20' 
                        : 'bg-secondary/20'
                    }`}>
                      {msg.role === 'user' ? (
                        <User className="h-4 w-4 text-primary" />
                      ) : (
                        <Bot className="h-4 w-4 text-secondary" />
                      )}
                    </div>
                    <div className={`px-4 py-3 ${
                      msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start space-x-3"
                >
                  <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-secondary" />
                  </div>
                  <div className="chat-bubble-ai px-4 py-3">
                    <div className="flex space-x-1.5">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-6 py-4 border-t border-white/5 bg-surface/50">
              <div className="flex items-end space-x-3">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    id="interview-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your answer..."
                    rows={1}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition resize-none text-sm"
                    style={{ minHeight: '44px', maxHeight: '120px' }}
                    onInput={(e) => {
                      e.target.style.height = 'auto';
                      e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                    }}
                  />
                </div>
                <button
                  id="interview-send-btn"
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  className="p-3 rounded-xl bg-primary hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed text-white transition shadow-lg shadow-primary/25 flex-shrink-0"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">Press Enter to send • Shift+Enter for new line</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MockInterview;
