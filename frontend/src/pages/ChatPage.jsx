import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getChats, getChatDetails, sendChatMessage } from '../services/api';
import { Send, User, ChevronLeft, MessageSquare, Search, ShieldCheck, Clock, MapPin, Building, ArrowUpRight, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import EmptyState from '../components/EmptyState';

const ChatPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const msgEndRef = useRef(null);

  useEffect(() => {
    fetchChatsList();
  }, [id]);

  const fetchChatsList = async () => {
    try {
      const response = await getChats();
      const chatsData = response.data.data; // Standardised response util
      setChats(chatsData);
      if (id) {
        const active = chatsData.find(c => c._id === id);
        setActiveChat(active);
        setMessages(active?.messages || []);
      }
    } catch (err) {
      console.error("List Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let pollInterval;
    if (id) {
      pollInterval = setInterval(async () => {
        try {
          const response = await getChatDetails(id);
          setMessages(response.data.data.messages); // Standardised response util
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
      setMessages([...messages, response.data.data]); // Standardised response util
      setInputText('');
    } catch (err) {
      console.error("Send Error:", err);
    }
  };

  const filteredChats = chats.filter(c => {
      const other = c.participants.find(p => (p._id || p) !== user.id);
      return other?.name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Loading Secure Chats...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 h-[85vh] flex flex-col md:flex-row gap-6 pb-10">
      
      {/* Sidebar - Chat List */}
      <aside className={`w-full md:w-1/3 flex flex-col bg-white rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm ${id ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-8 border-b border-slate-50 bg-slate-50/30">
            <h2 className="text-2xl font-serif font-black text-slate-900 tracking-tight flex items-center gap-4 uppercase italic-none">
               <MessageSquare className="text-indigo-600" size={24} /> My Chats
            </h2>
            <div className="relative mt-8">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
               <input 
                type="text" 
                placeholder="Search chats..." 
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl text-[11px] font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-400 transition-all outline-none" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
               />
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {filteredChats.length > 0 ? filteredChats.map(c => {
                const other = c.participants.find(p => (p._id || p) !== user.id);
                const isActive = id === c._id;
                return (
                    <button 
                        key={c._id}
                        onClick={() => navigate(`/chats/${c._id}`)}
                        className={`w-full p-6 rounded-[2rem] text-left transition-all duration-300 border ${isActive ? 'bg-indigo-600 border-indigo-600 shadow-2xl scale-[1.02]' : 'bg-white border-slate-50 hover:border-indigo-200 shadow-sm'}`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                                {other?.role === 'tenant' ? 'OWNER' : 'CLIENT'}
                            </span>
                            <span className={`text-[8px] font-black uppercase tracking-widest ${isActive ? 'text-indigo-100' : 'text-slate-300'}`}>ACTIVE</span>
                        </div>
                        <h4 className={`text-lg font-serif font-black tracking-tighter truncate leading-none mb-1 ${isActive ? 'text-white' : 'text-slate-900'}`}>{other?.name}</h4>
                        <p className={`text-[10px] font-bold tracking-wider truncate border-t mt-3 pt-3 flex items-center gap-2 ${isActive ? 'text-indigo-100 border-white/10' : 'text-slate-400 border-slate-50'}`}>
                            <Activity size={12} /> {c.appointmentId?.propertyId?.name || 'Secure Message'}
                        </p>
                    </button>
                );
            }) : (
                <div className="flex flex-col items-center justify-center p-20 opacity-20 filter grayscale">
                    <ShieldCheck size={48} className="mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-center">No Chats Active</p>
                </div>
            )}
        </div>
      </aside>

      {/* Main View - Active Chat */}
      <main className={`grow flex flex-col bg-white rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm ${!id ? 'hidden md:flex' : 'flex'}`}>
        {id && activeChat ? (
            <>
                {/* Active Header */}
                <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button onClick={() => navigate('/chats')} className="md:hidden p-3 bg-white border border-slate-100 rounded-xl text-slate-400">
                            <ChevronLeft size={20} />
                        </button>
                        <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-xl relative shrink-0">
                            {activeChat.participants.find(p => (p._id || p) !== user.id)?.name?.[0]}
                            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-white rounded-full"></span>
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-xl md:text-2xl font-serif font-black text-slate-900 tracking-tighter uppercase leading-none">
                                {activeChat.participants.find(p => (p._id || p) !== user.id)?.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-2">
                                <ShieldCheck className="text-indigo-600" size={16} />
                                <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">Safe & Secure Chat Active</span>
                            </div>
                        </div>
                    </div>
                    <div className="hidden lg:flex items-center gap-6">
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Status</p>
                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Verified Link</p>
                        </div>
                        <div className="w-px h-8 bg-slate-100"></div>
                        <Link to={`/property/${activeChat.appointmentId?.propertyId?._id}`} className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                            <Building size={20} />
                        </Link>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar bg-slate-50/20">
                    <div className="flex justify-center mb-10">
                        <div className="px-6 py-2 bg-white/50 backdrop-blur-md rounded-full border border-slate-100 shadow-sm flex items-center gap-3">
                            <Lock size={12} className="text-slate-400" />
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">This conversation is secure and private.</span>
                        </div>
                    </div>
                    
                    {messages.length > 0 ? messages.map((m, idx) => {
                        const isMe = String(m.senderId?._id || m.senderId) === String(user.id);
                        return (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[85%] md:max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-3 group`}>
                                    <div className={`px-6 md:px-8 py-4 md:py-5 rounded-[1.5rem] shadow-sm text-sm font-medium leading-relaxed ${
                                        isMe ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-100' : 'bg-white border border-slate-200 text-slate-900 rounded-tl-none shadow-slate-100'
                                    }`}>
                                        {m.text}
                                    </div>
                                    <span className={`text-[9px] font-black text-slate-300 uppercase tracking-widest mx-4 opacity-0 group-hover:opacity-100 transition-opacity`}>
                                        {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </motion.div>
                        );
                    }) : (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-30 italic-none">
                            <Clock size={48} className="mb-6 text-slate-300" />
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] leading-loose">Start of your private chat history.</p>
                        </div>
                    )}
                    <div ref={msgEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-8 border-t border-slate-50 bg-white shadow-[0_-10px_30px_-10px_rgba(0,0,0,0.02)]">
                    {activeChat.appointmentId?.status === 'rejected' ? (
                        <div className="flex flex-col items-center justify-center p-10 bg-rose-50 rounded-[2.5rem] border border-rose-100">
                            <ShieldCheck className="text-rose-500 mb-4" size={32} />
                            <p className="text-[11px] font-black text-rose-500 uppercase tracking-[0.3em] text-center leading-loose">
                                CHAT CLOSED<br/>
                                <span className="text-rose-400">THE OWNER HAS DECLINED THIS INQUIRY</span>
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSendMessage} className="flex gap-4">
                            <input 
                                type="text"
                                value={inputText}
                                onChange={e => setInputText(e.target.value)}
                                placeholder="TYPE YOUR MESSAGE..."
                                className="flex-1 px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl md:rounded-3xl text-sm font-black tracking-widest transition-all focus:ring-8 focus:ring-indigo-600/5 focus:bg-white outline-none uppercase"
                            />
                            <button type="submit" className="bg-slate-900 text-white px-8 rounded-2xl md:rounded-3xl hover:bg-black transition-all shadow-2xl active:scale-95 group">
                                <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </button>
                        </form>
                    )}
                </div>
            </>
        ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-slate-50/20">
                <EmptyState 
                    title="Select a Chat"
                    message="Choose a conversation from the sidebar to start messaging safely. Every chat on HouseMate is private and secure."
                    icon={MessageSquare}
                    actionText="BROWSE FOR NEW HOMES"
                    onAction={() => navigate('/')}
                    color="indigo"
                />
                <div className="mt-20 flex items-center gap-4 px-8 py-3 bg-white/50 backdrop-blur-md rounded-full border border-slate-100 shadow-xl">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full animate-float"></span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available and Ready</span>
                </div>
            </div>
        )}
      </main>
    </div>
  );
};

export default ChatPage;
