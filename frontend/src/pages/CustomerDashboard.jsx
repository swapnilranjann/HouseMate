import React, { useState, useEffect } from 'react';
import { getProperties, getMyAppointments } from '../services/api';
import { Heart, Search, Calendar, MessageSquare, Clock, MapPin, LayoutGrid, Eye, ArrowRight, ShieldAlert, CheckCircle, XCircle, ShoppingBag, Building, ShieldCheck, LifeBuoy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const CustomerDashboard = ({ isFavorites = false }) => {
  const [activeTab, setActiveTab] = useState(isFavorites ? 'favorites' : 'appointments');
  const [properties, setProperties] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pRes, aRes] = await Promise.all([
        getProperties(),
        getMyAppointments()
      ]);
      setProperties(pRes.data); 
      setAppointments(aRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const savedGems = properties.filter(p => JSON.parse(localStorage.getItem('house_user'))?.favorites?.includes(p._id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Premium Header Container */}
      <div className="bg-white rounded-[2.5rem] p-10 mb-12 border border-slate-200 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 transition-transform duration-1000 group-hover:scale-110">
              <ShoppingBag size={180} />
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
              <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600 border border-indigo-100">
                        <User size={18} />
                    </div>
                    <span className="text-indigo-600 font-black text-[10px] uppercase tracking-widest leading-none">Personal Explorer Hub</span>
                  </div>
                  <h1 className="text-5xl md:text-6xl font-serif italic font-black text-slate-900 tracking-tighter leading-none mb-6">My <span className="text-indigo-600">Explorer</span></h1>
                  <p className="text-slate-400 font-medium text-base max-w-sm">Curating your premium lifestyle, one property at a time.</p>
              </div>

              <div className="flex flex-wrap gap-4">
                  <div className="bg-slate-50 border border-slate-100 px-8 py-6 rounded-[2rem] flex flex-col min-w-[140px] shadow-sm">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 leading-none">Gems Portfolio</span>
                      <span className="text-4xl font-serif italic font-black text-indigo-600">{savedGems.length}</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 px-8 py-6 rounded-[2rem] flex flex-col min-w-[140px] shadow-sm">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 leading-none">Visit Activity</span>
                      <span className="text-4xl font-serif italic font-black text-sky-500">{appointments.length}</span>
                  </div>
              </div>
          </div>
      </div>

      {/* Controller Area */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-1">
              <button onClick={() => setActiveTab('appointments')} className={`px-10 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'appointments' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-900'}`}>Appointments</button>
              <button onClick={() => setActiveTab('favorites')} className={`px-10 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'favorites' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400 hover:text-slate-900'}`}>Favorites</button>
          </div>

          <Link to="/" className="flex items-center gap-3 bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:bg-slate-900 hover:text-white transition-all hover:-translate-y-1">
              Browse More <Search size={20} className="text-indigo-500" />
          </Link>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'appointments' ? (
           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6 max-w-5xl mx-auto">
              {appointments.length > 0 ? (
                  <div className="space-y-6">
                    {appointments.map(a => (
                        <div key={a._id} className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-10 group hover:border-indigo-200 transition-all shadow-sm hover:shadow-xl">
                            <div className="flex items-center gap-8 grow">
                                <div className="w-24 h-24 rounded-[1.5rem] overflow-hidden border border-slate-200 relative shrink-0">
                                    <img src={`http://localhost:5000${a.propertyId?.images?.[0]}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={a.propertyId?.name} />
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/60 to-transparent p-2">
                                        <p className="text-[8px] text-white font-black text-center uppercase tracking-widest">Property View</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors uppercase italic">{a.propertyId?.name}</h3>
                                    <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                                        <span className="flex items-center gap-1.5"><MapPin size={14} className="text-indigo-500" /> {a.propertyId?.address}</span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                                        <span className="flex items-center gap-1.5"><Calendar size={14} className="text-sky-500" /> {new Date(a.requestedDate).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-center md:items-end gap-5">
                                <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                                    {a.status === 'pending' && <><Clock className="text-amber-500" size={16} /><span className="text-[10px] font-black uppercase text-amber-500 tracking-widest">Awaiting Confirmation</span></>}
                                    {a.status === 'approved' && <><CheckCircle className="text-emerald-500" size={16} /><span className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">Visit Scheduled</span></>}
                                    {a.status === 'rejected' && <><XCircle className="text-rose-500" size={16} /><span className="text-[10px] font-black uppercase text-rose-500 tracking-widest">Request Declined</span></>}
                                </div>

                                <div className="flex gap-4 w-full">
                                    {a.status === 'approved' ? (
                                        <Link to={`/chats/${a._id}`} className="flex-grow bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest shadow-2xl transition-all hover:-translate-x-1">
                                            SECURE CHAT <MessageSquare size={18} />
                                        </Link>
                                    ) : (
                                        <div className="flex-grow bg-slate-50 border border-slate-200 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 text-center opacity-60">
                                            {a.status === 'pending' ? 'SECURE CHANNEL PENDING' : 'CHANNEL TERMINATED'}
                                        </div>
                                    )}
                                    <Link to={`/property/${a.propertyId?._id}`} className="p-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 text-indigo-600 transition-all shadow-sm">
                                        <ArrowRight size={20} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                  </div>
              ) : (
                <div className="py-32 text-center bg-white rounded-[3rem] border border-slate-200 shadow-inner flex flex-col items-center gap-6">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                      <Clock size={40} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase tracking-tighter">No Active Inquiries</h2>
                        <p className="text-slate-500 mt-2 font-medium max-w-xs mx-auto">Your schedule is currently clear. Discover premium properties to start your journey.</p>
                    </div>
                    <Link to="/" className="text-indigo-600 font-black text-[10px] uppercase tracking-widest underline decoration-2 underline-offset-8">EXPLORE LISTINGS</Link>
                </div>
              )}
           </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full">
            {savedGems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {savedGems.map((p, idx) => (
                        <div key={p._id} className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden group hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 h-full flex flex-col">
                            <div className="relative h-56 overflow-hidden">
                                <img src={`http://localhost:5000${p.images[0]}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                <div className="absolute top-4 right-4 bg-rose-500 text-white p-3 rounded-full shadow-xl"><Heart size={20} fill="white" /></div>
                                <div className="absolute bottom-4 left-4">
                                     <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-xl border border-white/50">{p.type || 'House'}</span>
                                </div>
                            </div>
                            <div className="p-8 flex-grow flex flex-col">
                                <h3 className="text-xl font-black text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{p.name}</h3>
                                <p className="text-slate-400 font-bold text-xs flex items-center gap-1.5 mb-6 truncate"><MapPin size={12} className="text-indigo-500" /> {p.address}</p>
                                <Link to={`/property/${p._id}`} className="mt-auto bg-slate-900 hover:bg-black text-white w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center shadow-xl transition-all active:scale-95">VIEW ASSET DETAILS</Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-32 text-center bg-white rounded-[3rem] border border-slate-200 shadow-inner flex flex-col items-center gap-6">
                    <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 animate-float">
                      <Heart size={40} className="fill-rose-500" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase tracking-tighter">Gem Portfolio Empty</h2>
                        <p className="text-slate-500 mt-2 font-medium max-w-xs mx-auto">Start curating your dream portfolio by saving your favorite premium spaces.</p>
                    </div>
                </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Support Quick Access */}
      <div className="mt-24 p-12 bg-slate-900 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative shadow-2xl">
          <div className="relative z-10 space-y-4">
              <h4 className="text-3xl font-black tracking-tight">Need Assistant Help?</h4>
              <p className="text-slate-400 max-w-sm font-medium">Our premium support desk is available 24/7 to solve your property booking inquiries.</p>
              <Link to="/support" className="inline-flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-indigo-600 hover:text-white transition-all">
                  Contact Protocol <LifeBuoy size={18} />
              </Link>
          </div>
          <div className="relative z-10 w-full md:w-auto">
             <div className="flex flex-col gap-4">
                 <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl">
                    <ShieldCheck className="text-emerald-500" size={24} />
                    <div>
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Escrow Active</p>
                        <p className="text-xs font-bold text-white">Your data is secured</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl">
                    <CheckCircle className="text-indigo-400" size={24} />
                    <div>
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Verified Listings</p>
                        <p className="text-xs font-bold text-white">Only trusted owners</p>
                    </div>
                 </div>
             </div>
          </div>
          <Building className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5 pointer-events-none" />
      </div>
    </div>
  );
};

export default CustomerDashboard;
