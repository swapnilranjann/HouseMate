import React, { useState, useEffect } from 'react';
import { getMyAppointments } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, CheckCircle, XCircle, MessageSquare, MapPin, Building, ArrowRight, ShieldCheck, UserCircle, Briefcase, Eye, LayoutGrid, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import DashboardHeader from '../components/DashboardHeader';
import EmptyState from '../components/EmptyState';

const CustomerDashboard = ({ isFavorites = false }) => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data } = await getMyAppointments();
      setAppointments(data.data); // Standardised response util returns { success, data, message }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter(a => {
      if (isFavorites) return false; 
      return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <DashboardHeader 
        title={<>User <span className="text-indigo-600">Dashboard</span></>}
        subtitle={`Welcome back, ${user.name}. You have ${appointments.length} active visit requests today.`}
        icon={UserCircle}
        roleLabel="Market Participant"
        accentColor="indigo"
        stats={[
           { label: "Houses Visited", value: appointments.length },
           { label: "Active Requests", value: appointments.filter(a => a.status === 'approved').length, highlight: true }
        ]}
      />

      <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          <h2 className="text-2xl font-serif text-slate-900 font-black uppercase italic-none">My Visit History</h2>
          <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100 w-full md:w-auto overflow-x-auto custom-scrollbar">
             <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl whitespace-nowrap">ALL REQUESTS</button>
             <button className="px-6 py-2 text-slate-400 hover:text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap">FAVORITES</button>
          </div>
      </div>

      <div className="space-y-6">
        {loading ? (
             <div className="space-y-6">
                {[1,2,3].map(i => <div key={i} className="h-48 bg-white shimmer rounded-[2rem] border border-slate-100 shadow-sm"></div>)}
             </div>
        ) : (
             <motion.div 
               initial="hidden"
               animate="visible"
               variants={{
                 hidden: { opacity: 0 },
                 visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
               }}
               className="space-y-6"
             >
                <AnimatePresence>
                    {filteredAppointments.length > 0 ? filteredAppointments.map(a => (
                        <motion.div 
                            key={a._id}
                            variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
                            className="group bg-white rounded-[2rem] md:rounded-[3rem] p-8 md:p-10 border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:border-indigo-100 flex flex-col md:flex-row items-center justify-between gap-10"
                        >
                            <div className="flex items-center gap-10 grow w-full">
                                <Link to={`/property/${a.propertyId?._id}`} className="w-24 h-24 md:w-40 md:h-40 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border border-slate-100 relative shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                                    <img src={`http://localhost:5000${a.propertyId?.images?.[0]}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={a.propertyId?.name} />
                                    <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-all"></div>
                                </Link>
                                <div className="space-y-4">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border border-slate-100 leading-none">{a.propertyId?.type || 'HOUSE'}</span>
                                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] leading-none ${
                                            a.status === 'pending' ? 'bg-amber-50 text-amber-500 border-amber-100' :
                                            a.status === 'approved' ? 'bg-emerald-50 text-emerald-500 border-emerald-100' :
                                            'bg-rose-50 text-rose-500 border-rose-100'
                                        }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${a.status === 'pending' ? 'bg-amber-500' : a.status === 'approved' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                            Status: {a.status}
                                        </div>
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-serif font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase italic-none tracking-tighter">{a.propertyId?.name}</h3>
                                    <div className="flex items-center gap-6 text-xs font-bold text-slate-400">
                                        <span className="flex items-center gap-2 uppercase tracking-widest text-[10px]"><MapPin size={16} className="text-sky-500" /> {a.propertyId?.address}</span>
                                        <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-slate-100"></span>
                                        <span className="hidden md:flex items-center gap-2 uppercase tracking-widest text-[10px] tracking-widest"><Calendar size={16} className="text-indigo-400" /> {new Date(a.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-center md:items-end gap-5 w-full md:w-auto shrink-0">
                                <div className="flex gap-4 w-full">
                                    {a.status === 'rejected' ? (
                                        <div className="flex-grow bg-rose-50 border border-rose-100 px-8 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-rose-500 text-center">REQUEST DECLINED</div>
                                    ) : (
                                        <Link to={`/chats/${a._id}`} className="flex-grow bg-slate-900 border border-slate-900 hover:bg-black text-white px-10 py-5 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl transition-all hover:-translate-y-1">
                                            {a.status === 'pending' ? 'WAITING FOR OWNER' : 'SEND MESSAGE'} <MessageSquare size={18} />
                                        </Link>
                                    )}
                                    <Link to={`/property/${a.propertyId?._id}`} className="p-5 bg-white border border-slate-200 rounded-2xl hover:bg-slate-900 hover:text-white transition-all shadow-sm group/btn rotate-45 hover:rotate-0 transition-transform duration-500 hidden md:block">
                                        <ArrowRight size={22} className="-rotate-45 group-hover/btn:rotate-0" />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    )) : (
                        <EmptyState 
                            title="No Visits Yet"
                            message="You haven't requested to visit any houses yet. Browse our listings to find your next home."
                            icon={MapPin}
                            actionText="BROWSE FOR HOMES"
                            onAction={() => navigate('/')}
                            color="indigo"
                        />
                    )}
                </AnimatePresence>
             </motion.div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
