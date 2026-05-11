import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { servicenowAPI } from '../lib/servicenow';
import { useAuthStore } from '../store/authStore';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuthStore();
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! I am your AI concierge. How can I assist you today?', sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    const newMsg = { id: Date.now(), text: userText, sender: 'user' };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');

    // Mock AI response
    setTimeout(async () => {
      const aiResponseText = `I can help you with that. Our hotel offers many amenities including pool, spa, and 24/7 room service.`;
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), text: aiResponseText, sender: 'ai' }
      ]);
      
      try {
        await servicenowAPI.post('/x_1939650_smart_0_chat_logs', {
          user_name: user?.email.split('@')[0] || 'Guest',
          u_user_email: user?.email || 'guest@example.com',
          u_message: userText,
          u_response: aiResponseText,
          u_intent: 'other'
        });
      } catch (error) {
        console.error('Error logging chat:', error);
      }
    }, 1000);
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full shadow-lg shadow-indigo-500/30 flex items-center justify-center text-white z-50 ${isOpen ? 'hidden' : 'flex'}`}
      >
        <MessageSquare size={24} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] glass-panel rounded-2xl flex flex-col z-50 overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                  <Bot size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">AI Concierge</h3>
                  <p className="text-xs text-green-400">Online</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-4">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-auto ${
                      msg.sender === 'user' ? 'bg-purple-500 ml-2' : 'bg-indigo-500 mr-2'
                    }`}>
                      {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
                    </div>
                    <div className={`p-3 rounded-2xl text-sm ${
                      msg.sender === 'user' 
                        ? 'bg-purple-500/20 text-white rounded-br-sm' 
                        : 'bg-white/10 text-slate-200 rounded-bl-sm'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10 bg-black/20">
              <form onSubmit={handleSend} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 placeholder:text-slate-500"
                />
                <button 
                  type="submit"
                  disabled={!input.trim()}
                  className="p-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
