import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getChats, getChatDetails, sendChatMessage } from '../services/api';
import { Send, User, ChevronLeft, MessageSquare, Search, ShieldCheck, Clock, MapPin, Building, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';

const ChatPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const msgEndRef = useRef(null);

  useEffect(() => {
    fetchChatsList();
  }, [id]);

  const fetchChatsList = async () => {
    try {
      const response = await getChats();
      setChats(response.data);
      if (id) {
        const active = response.data.find(c => c._id === id);
        setActiveChat(active);
        setMessages(active?.messages || []);
      }
    } catch (err) {
      console.error("List Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Real-time polling for messages
  useEffect(() => {
    let pollInterval;
    if (id) {
      pollInterval = setInterval(async () => {
        try {
          const response = await getChatDetails(id);
          setMessages(response.data.messages);
        } catch (err) {
          console.error("Poll error:", err);
        }
      }, 3000);
    }
    return () => clearInterval(pollInterval);
  }, [id]);

  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    try {
      const response = await sendChatMessage(id, inputText);
      setMessages([...messages, response.data]);
      setInputText('');
    } catch (err) {
      console.error("Send Error:", err);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center animate-pulse text-indigo-600 font-black tracking-widest">ESTABLISHING FREQUENCY...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 h-[85vh] flex gap-6 pb-10">
      
      {/* Sidebar - Chat List */}
      <aside className="w-1/3 flex flex-col glass rounded-[2.5rem] overflow-hidden border border-slate-200">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
               <MessageSquare className="text-indigo-600" size={24} /> Channels
            </h2>
            <div className="relative mt-6">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
               <input type="text" placeholder="Search transmissions..." className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" />
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {chats.length > 0 ? chats.map(c => {
                const other = c.participants.find(p => p._id !== user.id);
                const isActive = id === c._id;
                return (
                    <button 
                        key={c._id}
                        onClick={() => navigate(`/chats/${c._id}`)}
                        className={`w-full p-6 rounded-[2rem] text-left transition-all duration-300 border ${isActive ? 'bg-indigo-600 border-indigo-600 shadow-xl' : 'bg-white border-slate-100 hover:border-indigo-200 shadow-sm'}`}
                    >
                        <div className="flex justify-between items-start mb-1">
                            <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-indigo-200' : 'text-slate-400'}`}>IDENT: {other?.role}</span>
                            <span className={`text-[9px] font-bold ${isActive ? 'text-indigo-200' : 'text-slate-400'}`}>ACTIVE</span>
                        </div>
                        <h4 className={`text-lg font-black tracking-tight truncate ${isActive ? 'text-white' : 'text-slate-900'}`}>{other?.name}</h4>
                        <p className={`text-[10px] font-bold mt-1 tracking-wider ${isActive ? 'text-indigo-100' : 'text-slate-500'}`}>FREQ: Approved Inquiry</p>
                    </button>
                );
            }) : (
                <div className="text-center py-20 opacity-30">
                    <ShieldCheck size={48} className="mx-auto mb-4" />
                    <p className="text-xs font-black uppercase tracking-widest leading-loose">No active secure<br/>transmission channels</p>
                </div>
            )}
        </div>
      </aside>

      {/* Main View - Active Chat */}
      <main className="grow flex flex-col glass rounded-[2.5rem] overflow-hidden border border-slate-200">
        {id && activeChat ? (
            <>
                {/* Active Header */}
                <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-xl relative">
                            {activeChat.participants.find(p => p._id !== user.id)?.name[0]}
                            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-white rounded-full"></span>
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">
                                {activeChat.participants.find(p => p._id !== user.id)?.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                                <ShieldCheck className="text-indigo-600" size={14} />
                                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Secure Handshake Protocol Active</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden md:block">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Connection</p>
                            <p className="text-[10px] font-bold text-slate-900">128-bit Encrypted</p>
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar bg-slate-50/30">
                    {messages.length > 0 ? messages.map((m, idx) => {
                        const isMe = m.senderId === user.id;
                        return (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
                                    <div className={`px-6 py-4 rounded-[1.5rem] shadow-sm text-sm font-medium leading-relaxed ${
                                        isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-900 rounded-tl-none'
                                    }`}>
                                        {m.text}
                                    </div>
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mx-2">
                                        {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </motion.div>
                        );
                    }) : (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                            <Clock size={48} />
                            <p className="mt-4 font-black uppercase text-xs tracking-widest leading-loose">Start of conversation history.<br/>Your privacy is our priority.</p>
                        </div>
                    )}
                    <div ref={msgEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-8 border-t border-slate-100 bg-white">
                    <form onSubmit={handleSendMessage} className="flex gap-4">
                        <input 
                            type="text"
                            value={inputText}
                            onChange={e => setInputText(e.target.value)}
                            placeholder="TYPE YOUR RESPONSE HERE..."
                            className="flex-1 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-black tracking-widest transition-all focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none"
                        />
                        <button type="submit" className="bg-slate-900 text-white p-4 rounded-2xl hover:bg-black transition-all shadow-xl active:scale-95">
                            <Send size={24} />
                        </button>
                    </form>
                </div>
            </>
        ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center">
                <div className="bg-indigo-50 p-10 rounded-[3rem] mb-10 group hover:scale-105 transition-all duration-700 overflow-hidden relative">
                    <MessageSquare size={80} className="text-indigo-600 relative z-10" />
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-sky-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Select a Frequency</h2>
                <p className="max-w-xs mx-auto text-slate-400 mt-4 font-medium">Select an active transmission channel from the sidebar to start corresponding securely.</p>
                <div className="mt-12 flex items-center gap-2 px-6 py-2 bg-slate-50 rounded-full border border-slate-100">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full animate-float"></span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Awaiting Selection</span>
                </div>
            </div>
        )}
      </main>
    </div>
  );
};

export default ChatPage;
