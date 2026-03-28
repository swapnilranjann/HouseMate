import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getChatDetails, sendChatMessage } from '../services/api';
import { Send, User, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';

const ChatPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const msgEndRef = useRef(null);

  // Poll for messages every 3 seconds as requested
  useEffect(() => {
    let pollInterval;
    
    const fetchChat = async () => {
      try {
        const response = await getChatDetails(id);
        setChat(response.data);
        setMessages(response.data.messages);
      } catch (err) {
        console.error("Chat Error:", err);
      }
    };

    if (id) {
      fetchChat();
      pollInterval = setInterval(fetchChat, 3000);
    }

    return () => {
        if (pollInterval) clearInterval(pollInterval);
    };
  }, [id]);

  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    try {
      const response = await sendChatMessage(id, inputText);
      // Immediately optimistic update
      setMessages([...messages, response.data]);
      setInputText('');
    } catch (err) {
      console.error("Send Error:", err);
    }
  };

  if (!chat) return <div className="p-10 text-center animate-pulse text-primary font-black uppercase tracking-widest">Searching Frequency...</div>;

  const otherParticipant = chat.participants.find(p => p._id !== user.id);

  return (
    <div className="max-w-4xl mx-auto h-[80vh] flex flex-col glass rounded-3xl overflow-hidden shadow-2xl border border-white/5">
      {/* Header */}
      <div className="p-6 bg-secondary/10 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-4">
          <Link to="/chats" className="p-2 hover:bg-white/5 rounded-full transition-colors"><ChevronLeft size={20}/></Link>
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary border border-primary/30">
            <User size={24} />
          </div>
          <div>
            <h3 className="font-bold text-white uppercase tracking-tight">{otherParticipant?.name}</h3>
            <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> REST Mode Active
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => {
            const isMe = msg.senderId === user.id;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: isMe ? 20 : -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] p-4 rounded-2xl ${
                  isMe ? 'bg-primary text-white ml-auto rounded-tr-none shadow-lg shadow-primary/20' 
                       : 'bg-white/5 text-text-muted border border-white/10 rounded-tl-none'
                }`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <span className="text-[9px] opacity-40 mt-2 block uppercase font-bold tracking-tighter">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={msgEndRef} />
      </div>

      {/* Form */}
      <form onSubmit={handleSendMessage} className="p-6 bg-bg-dark/50 backdrop-blur-xl border-t border-white/5 flex gap-4">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="SEND A SECURE TRANSMISSION..."
          className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary/50 text-sm tracking-wider placeholder:text-text-muted/30"
        />
        <button type="submit" className="bg-primary hover:bg-primary/90 text-white p-4 rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
          <Send size={24} />
        </button>
      </form>
    </div>
  );
};

export default ChatPage;
