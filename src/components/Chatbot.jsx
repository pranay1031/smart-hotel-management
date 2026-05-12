import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Bot, User, Loader, Mic, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { servicenowAPI } from '../lib/servicenow';
import { getChatbotResponse } from '../lib/aiService';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your AI Concierge for Novotel Vizag. How can I assist you with your stay today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [lang, setLang] = useState('en-US'); // 'en-US' or 'te-IN'
  const { user } = useAuthStore();
  const scrollRef = useRef(null);
  
  // Speech Recognition Setup
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = lang;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        setInput(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [lang]); // Re-initialize when language changes

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const speak = (text) => {
    if (isMuted) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 1.0;
    
    // Find voice for selected language
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith(lang.split('-')[0]));
    if (voice) utterance.voice = voice;

    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      if (!recognitionRef.current) {
        return;
      }
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    try {
      const promptContext = lang === 'te-IN' ? " (Please respond in Telugu)" : "";
      const response = await getChatbotResponse(userMessage + promptContext, user);
      
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
      speak(response);
      
      servicenowAPI.post('/x_1939650_smart_0_chat_logs', {
        u_user_email: user?.email,
        u_message: userMessage,
        u_response: response,
        u_lang: lang
      }).catch(() => {});

    } catch {
      setIsTyping(false);
    }
  };

  const suggestions = [
    "Where is the pool?",
    "Book a deluxe room",
    "Register AC complaint",
    "Food recommendations"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-20 right-0 w-[350px] md:w-[400px] h-[650px] glass-panel rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-white/10"
          >
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-indigo-600 to-purple-600 flex justify-between items-center shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md relative">
                  <Bot className="text-white" size={24} />
                  {isListening && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-white font-bold text-base leading-tight">AI Concierge</h3>
                  <p className="text-indigo-100 text-[10px] uppercase tracking-widest font-bold">Novotel Vizag Assistant</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setLang(lang === 'en-US' ? 'te-IN' : 'en-US')}
                  className="bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold px-2 py-1 rounded-lg border border-white/10 transition-all uppercase"
                >
                  {lang === 'en-US' ? 'English' : 'తెలుగు'}
                </button>
                <button 
                  onClick={() => setIsMuted(!isMuted)} 
                  aria-label={isMuted ? "Unmute chatbot" : "Mute chatbot"}
                  className="text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-full transition-all"
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)} 
                  aria-label="Close chat"
                  className="text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-full transition-all"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-900/50 custom-scrollbar">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex max-w-[85%] space-x-3 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-indigo-500' : 'bg-slate-700'}`}>
                      {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-indigo-600 text-white rounded-tr-none' 
                        : 'bg-white/5 text-slate-200 border border-white/5 rounded-tl-none'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex space-x-3 items-center bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/5">
                    <Loader size={16} className="text-indigo-400 animate-spin" />
                    <span className="text-xs text-slate-400 font-medium">Assistant is thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Suggestions */}
            <div className="px-5 py-2 bg-slate-900/50 flex space-x-2 overflow-x-auto no-scrollbar border-t border-white/5">
              {suggestions.map((s, i) => (
                <button 
                  key={i} 
                  onClick={() => { setInput(s); }}
                  className="whitespace-nowrap px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] text-slate-400 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-5 bg-slate-900/80 border-t border-white/10">
              <div className="flex items-center space-x-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={isListening ? "Listening..." : "Ask your AI Concierge..."}
                    className={`w-full glass-input pr-12 py-3 text-sm ${isListening ? 'border-indigo-500 bg-indigo-500/5' : ''}`}
                  />
                  <button 
                    onClick={handleSend}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg flex items-center justify-center transition-all shadow-lg"
                  >
                    <Send size={16} />
                  </button>
                </div>
                <button
                  onClick={toggleListening}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all shadow-lg ${
                    isListening 
                      ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/40' 
                      : 'bg-white/5 text-slate-400 hover:text-indigo-400 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {isListening ? <Mic size={20} /> : <Mic size={20} />}
                </button>
              </div>
              <p className="mt-3 text-[10px] text-center text-slate-500 flex items-center justify-center">
                <Sparkles size={10} className="mr-1 text-indigo-400" />
                Voice-enabled Smart Assistant for Novotel Vizag
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/40 border border-white/10 group"
      >
        {isOpen ? <X size={28} className="text-white" /> : (
          <div className="relative">
            <MessageSquare size={28} className="text-white group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-slate-900 animate-pulse" />
          </div>
        )}
      </motion.button>
    </div>
  );
}
