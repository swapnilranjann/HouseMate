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
               <MessageSquare size={14} className="text-[#C2410C]" /> Messages
            </h2>
            <div className="relative mt-4">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
               <input 
                type="text" 
                placeholder="Search..." 
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded text-xs font-medium focus:border-[#C2410C] outline-none" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
               />
            </div>
        </div>

        <div className="flex-1 overflow-y-auto">
            {filteredChats.length > 0 ? filteredChats.map(c => {
                const other = c.participants.find(p => (p._id || p) !== user.id);
                const isActive = id === c._id;
                return (
                    <button 
                        key={c._id}
                        onClick={() => navigate(`/chats/${c._id}`)}
                        className={`w-full p-4 text-left border-b border-gray-100 transition-all ${isActive ? 'bg-[#FFF7ED] border-l-4 border-l-[#C2410C]' : 'hover:bg-gray-50'}`}
                    >
                        <div className="flex justify-between items-start mb-1">
                            <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${isActive ? 'bg-[#FFEDD5] border-[#FED7AA] text-[#9A3412]' : 'bg-gray-100 border-gray-200 text-gray-500'}`}>
                                {other?.role === 'tenant' ? 'Owner' : 'Client'}
                            </span>
                            <span className="text-[8px] font-bold text-gray-400 uppercase">Active</span>
                        </div>
                        <h4 className={`text-sm font-bold truncate ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>{other?.name}</h4>
                        <p className="text-[10px] text-gray-400 truncate mt-1">
                            {c.appointmentId?.propertyId?.name || 'General Inquiry'}
                        </p>
                    </button>
                );
            }) : (
                <div className="flex flex-col items-center justify-center p-12 py-20 text-gray-300">
                    <MessageSquare size={32} className="mb-2 opacity-50" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-center">No Messages</p>
                </div>
            )}
        </div>
      </aside>

      {/* Main View - Active Chat */}
      <main className={`grow bg-white border border-gray-200 rounded shadow-sm overflow-hidden flex flex-col ${!id ? 'hidden md:flex' : 'flex'}`}>
        {id && activeChat ? (
            <>
                <div className="p-4 border-b border-gray-200 bg-[#FCFDFF] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/chats')} className="md:hidden p-2 text-gray-400 hover:text-gray-600">
                            <ChevronLeft size={20} />
                        </button>
                        <div className="w-10 h-10 bg-gray-900 rounded flex items-center justify-center font-bold text-sm text-white">
                            {activeChat.participants.find(p => (p._id || p) !== user.id)?.name?.[0]}
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 leading-none">
                                {activeChat.participants.find(p => (p._id || p) !== user.id)?.name}
                            </h3>
                            <div className="flex items-center gap-1.5 mt-1">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Connected</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#F8FAFC]">
                    {messages.length > 0 ? messages.map((m, idx) => {
                        const isMe = String(m.senderId?._id || m.senderId) === String(user.id);
                        return (
                            <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                                    <div className={`px-4 py-2.5 rounded text-sm font-medium shadow-sm ${
                                        isMe ? 'bg-[#C2410C] text-white' : 'bg-white border border-gray-200 text-gray-800'
                                    }`}>
                                        {m.text}
                                    </div>
                                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tight mx-1">
                                        {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        );
                    }) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-300">
                            <p className="text-[10px] font-bold uppercase tracking-widest">Beginning of conversation</p>
                        </div>
                    )}
                    <div ref={msgEndRef} />
                </div>

                <div className="p-4 border-t border-gray-200">
                    {activeChat.appointmentId?.status === 'rejected' ? (
                        <div className="p-3 bg-red-50 text-red-600 rounded text-[10px] font-bold uppercase text-center border border-red-100">
                            Conversation closed by owner
                        </div>
                    ) : (
                        <form onSubmit={handleSendMessage} className="flex gap-2">
                            <input 
                                type="text"
                                value={inputText}
                                onChange={e => setInputText(e.target.value)}
                                placeholder="Write a message..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded text-sm font-medium focus:border-[#C2410C] outline-none"
                            />
                            <button type="submit" className="bg-gray-900 text-white px-4 py-2 rounded font-bold text-xs uppercase hover:bg-black transition-all flex items-center gap-2">
                                Send <Send size={14} />
                            </button>
                        </form>
                    )}
                </div>
            </>
        ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center text-gray-300">
                <MessageSquare size={48} className="mb-4 opacity-20" />
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Select a Conversation</h3>
                <p className="max-w-xs text-xs font-medium">Choose a connection from the left pane to start communicating.</p>
                <button onClick={() => navigate('/')} className="mt-6 text-[10px] font-bold uppercase text-[#C2410C] hover:underline">Return to listings</button>
            </div>
        )}
      </main>
    </div>
  );
};

export default ChatPage;
