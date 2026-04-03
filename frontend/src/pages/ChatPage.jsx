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
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Loading Chats...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-180px)] flex flex-col md:flex-row gap-4">
      
      {/* Sidebar - Chat List */}
      <aside className={`w-full md:w-[320px] bg-white border border-gray-200 rounded shadow-sm overflow-hidden flex flex-col ${id ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-200 bg-[#FCFDFF]">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
               <MessageSquare size={14} style={{ color: 'var(--primary)' }} /> Messages
            </h2>
            <div className="relative mt-4">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
               <input 
                type="text" 
                placeholder="Search..." 
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded text-xs font-medium focus:border-[var(--primary)] outline-none" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
               />
            </div>
        </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filteredChats.length > 0 ? filteredChats.map(c => {
                const other = c.participants.find(p => (p._id || p) !== user.id);
                const isActive = id === c._id;
                return (
                    <button 
                        key={c._id}
                        onClick={() => navigate(`/chats/${c._id}`)}
                        className={`w-full p-5 text-left border-b border-gray-50 transition-all ${isActive ? 'bg-gray-50 border-l-4' : 'hover:bg-gray-50/50'}`}
                        style={{ borderLeftColor: isActive ? 'var(--primary)' : 'transparent' }}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span 
                                style={{ 
                                    backgroundColor: isActive ? 'rgba(var(--primary-rgb), 0.1)' : 'rgba(0,0,0,0.05)',
                                    color: isActive ? 'var(--primary)' : '#666'
                                }}
                                className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-sm`}
                            >
                                {other?.role === 'tenant' ? 'Owner' : 'Client'}
                            </span>
                            <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Protocol Active</span>
                        </div>
                        <h4 className={`text-[13px] font-black uppercase tracking-tight truncate ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>{other?.name}</h4>
                        <p className="text-[10px] font-bold text-gray-400 truncate mt-1 uppercase tracking-widest opacity-60">
                            {c.appointmentId?.propertyId?.name || 'Inquiry Hub'}
                        </p>
                    </button>
                );
            }) : (
                <div className="flex flex-col items-center justify-center p-12 py-20 text-gray-200">
                    <MessageSquare size={32} className="mb-4 opacity-20" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-center">No Data Streams</p>
                </div>
            )}
        </div>
      </aside>

      {/* Main View - Active Chat */}
      <main className={`grow bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden flex flex-col ${!id ? 'hidden md:flex' : 'flex'}`}>
        {id && activeChat ? (
            <>
                <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/chats')} className="md:hidden p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <ChevronLeft size={20} />
                        </button>
                        <div 
                            style={{ backgroundColor: 'var(--primary)' }}
                            className="w-10 h-10 rounded-sm flex items-center justify-center font-black text-sm text-white shadow-sm uppercase"
                        >
                            {activeChat.participants.find(p => (p._id || p) !== user.id)?.name?.[0]}
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight leading-none">
                                {activeChat.participants.find(p => (p._id || p) !== user.id)?.name}
                            </h3>
                            <div className="flex items-center gap-1.5 mt-2">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Secure Handshake</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/30 custom-scrollbar">
                    {messages.length > 0 ? messages.map((m, idx) => {
                        const isMe = String(m.senderId?._id || m.senderId) === String(user.id);
                        return (
                            <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1.5`}>
                                    <div 
                                        style={{ 
                                            backgroundColor: isMe ? 'var(--primary)' : 'white',
                                            color: isMe ? 'white' : 'inherit'
                                        }}
                                        className={`px-5 py-3 rounded-sm text-xs font-bold shadow-sm ${
                                            !isMe ? 'border border-gray-100 text-gray-600' : ''
                                        }`}
                                    >
                                        {m.text}
                                    </div>
                                    <span className="text-[8px] font-black text-gray-300 uppercase tracking-[0.2em] px-1">
                                        {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        );
                    }) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-200">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Initialize Conversation</p>
                        </div>
                    )}
                    <div ref={msgEndRef} />
                </div>

                <div className="p-6 border-t border-gray-100 bg-white shadow-lg">
                    {activeChat.appointmentId?.status === 'rejected' ? (
                        <div className="p-4 bg-red-50 text-red-600 rounded-sm text-[10px] font-black uppercase tracking-[0.2em] text-center border border-red-100">
                            Operational Access Terminated By Asset Owner
                        </div>
                    ) : (
                        <form onSubmit={handleSendMessage} className="flex gap-3">
                            <input 
                                type="text"
                                value={inputText}
                                onChange={e => setInputText(e.target.value)}
                                placeholder="ENTER SECURE TRANSMISSION..."
                                className="flex-1 px-5 py-3 bg-gray-50 border border-gray-100 rounded-sm text-[11px] font-black uppercase tracking-widest focus:border-primary focus:bg-white outline-none transition-all"
                                style={{ borderLeftWidth: '4px', borderLeftColor: 'var(--primary)' }}
                            />
                            <button 
                                type="submit" 
                                style={{ backgroundColor: 'var(--primary)' }}
                                className="text-white px-8 py-3 rounded-sm font-black text-[10px] uppercase tracking-[0.2em] hover:brightness-110 transition-all flex items-center gap-3 shadow-md"
                            >
                                Send <Send size={14} />
                            </button>
                        </form>
                    )}
                </div>
            </>
        ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center text-gray-200">
                <MessageSquare size={64} className="mb-6 opacity-10" />
                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3">SELECT COMMS CHANNEL</h3>
                <p className="max-w-xs text-[10px] font-bold uppercase tracking-widest text-gray-300">Choose a verified connection to establish secure real-time communication.</p>
                <button 
                    onClick={() => navigate('/')} 
                    style={{ color: 'var(--primary)' }}
                    className="mt-10 text-[9px] font-black uppercase tracking-[0.4em] hover:underline"
                >
                    Return to Marketplace
                </button>
            </div>
        )}
      </main>
    </div>
  );
};

export default ChatPage;
