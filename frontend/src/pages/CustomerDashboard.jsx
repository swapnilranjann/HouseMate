import React, { useState, useEffect } from 'react';
import { getProperties, getMyAppointments } from '../services/api';
import { Heart, Search, Calendar, MessageSquare, Clock, MapPin, LayoutGrid, Eye, ArrowRight, ShieldAlert, CheckCircle, XCircle } from 'lucide-react';
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

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold flex items-center gap-3">
             <LayoutGrid className="title-gradient" size={32} /> My <span className="title-gradient">Explorer</span>
          </h1>
          <p className="text-text-muted text-sm font-medium opacity-60 uppercase tracking-widest">Tracking your dream home</p>
        </div>

        <div className="flex bg-bg-card p-1 rounded-2xl border border-border-glass">
           <button onClick={() => setActiveTab('appointments')} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'appointments' ? 'bg-primary text-white shadow-lg' : 'text-text-muted'}`}>Appointments</button>
           <button onClick={() => setActiveTab('favorites')} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'favorites' ? 'bg-secondary text-white shadow-lg' : 'text-text-muted'}`}>Favorites</button>
        </div>

        <Link to="/" className="btn-primary flex items-center gap-2 px-6 py-3 rounded-2xl text-sm shadow-xl font-black">
          BROWSE <Search size={18} />
        </Link>
      </header>

      <AnimatePresence mode="wait">
        {activeTab === 'appointments' ? (
           <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-4 max-w-5xl mx-auto">
              {appointments.length > 0 ? (
                 <div className="space-y-4">
                    {appointments.map(a => (
                       <div key={a._id} className="glass p-8 border-border-glass flex flex-col md:flex-row justify-between items-center gap-8 group hover:border-primary/20 transition-all">
                          <div className="flex items-center gap-6">
                             <div className="w-20 h-20 rounded-2xl overflow-hidden border border-border-glass shrink-0">
                               <img src={`http://localhost:5000${a.propertyId?.images[0]}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                             </div>
                             <div className="space-y-2">
                                <h3 className="text-xl font-black text-white group-hover:text-primary transition-colors">{a.propertyId?.name}</h3>
                                <p className="text-sm font-bold text-text-muted flex items-center gap-1 opacity-70"><MapPin size={16} /> {a.propertyId?.address}</p>
                             </div>
                          </div>

                          <div className="flex flex-col items-center md:items-end gap-3 min-w-[200px]">
                             <div className="flex items-center gap-2">
                                {a.status === 'pending' && <><Clock className="text-yellow-500" size={18} /><span className="text-xs font-black uppercase text-yellow-500">PENDING</span></>}
                                {a.status === 'approved' && <><CheckCircle className="text-green-500" size={18} /><span className="text-xs font-black uppercase text-green-500">APPROVED</span></>}
                                {a.status === 'rejected' && <><XCircle className="text-red-500" size={18} /><span className="text-xs font-black uppercase text-red-500">REJECTED</span></>}
                             </div>

                             <div className="flex gap-2 w-full mt-2">
                                {a.status === 'approved' ? (
                                   <Link to={`/chats/${a._id}`} className="flex-grow btn-primary flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black tracking-widest shadow-xl">
                                      CHATS <MessageSquare size={16} />
                                   </Link>
                                ) : (
                                   <button disabled className="flex-grow glass border-border-glass opacity-30 py-3 rounded-xl text-xs font-black tracking-widest">
                                      {a.status === 'pending' ? 'WAITING' : 'REJECTED'}
                                   </button>
                                )}
                                <Link to={`/property/${a.propertyId?._id}`} className="p-3 glass rounded-xl hover:text-primary transition-all"><ArrowRight size={18} /></Link>
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
              ) : (
                <div className="py-24 text-center glass border-dashed border-2 opacity-50 flex flex-col items-center gap-4">
                  <Calendar size={48} className="text-text-muted" />
                  <p className="text-xl font-black text-text-muted uppercase tracking-wider">No Appointments</p>
                </div>
              )}
           </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.filter(p => JSON.parse(localStorage.getItem('house_user'))?.favorites?.includes(p._id)).length > 0 ? (
               properties.filter(p => JSON.parse(localStorage.getItem('house_user'))?.favorites?.includes(p._id)).map((p, idx) => (
                  <div key={p._id} className="glass p-6 group hover:border-secondary/20 transition-all">
                      <div className="h-40 relative rounded-xl overflow-hidden mb-4">
                        <img src={`http://localhost:5000${p.images[0]}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                        <div className="absolute top-2 right-2 p-2 bg-secondary rounded-full text-white shadow-lg"><Heart size={16} fill="white" /></div>
                      </div>
                      <h3 className="text-xl font-bold truncate">{p.name}</h3>
                      <p className="text-xs text-text-muted mb-4 truncate italic">{p.address}</p>
                      <Link to={`/property/${p._id}`} className="btn-primary w-full py-3 rounded-xl block text-center text-[10px] font-black uppercase tracking-widest shadow-xl">VIEW LISTING</Link>
                  </div>
               ))
            ) : (
              <div className="col-span-full py-24 text-center glass border-dashed border-2 opacity-50 flex flex-col items-center gap-4">
                <Heart size={48} className="text-secondary" />
                <p className="text-xl font-black text-text-muted uppercase tracking-wider">Your saved gems</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomerDashboard;
