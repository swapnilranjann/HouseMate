import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { getProperties, getMyAppointments, createProperty, updatePropertyStatus, updateAppointmentStatus, getChats } from '../services/api';
import { Plus, Home, MapPin, Eye, Upload, Check, X, ShieldCheck, LayoutGrid, Clock, Calendar, MessageSquare, AlertCircle, Briefcase, ShoppingBag, Building, ArrowUpRight, PlusCircle, Globe, Layout, ChevronRight, Activity, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import DashboardHeader from '../components/DashboardHeader';
import EmptyState from '../components/EmptyState';

const TenantDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('My Listings');
  const [properties, setProperties] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: '', number: '', address: '', floor: '', bhk: '1', dimensions: '', roadInfo: '', type: 'House', locationLink: ''
  });
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchData();
    const params = new URLSearchParams(location.search);
    if (params.get('add') === 'true') {
      setShowForm(true);
    }
  }, [location]);

  const fetchData = async () => {
    try {
      const [pRes, aRes, cRes] = await Promise.all([
        getProperties(),
        getMyAppointments(),
        getChats()
      ]);
      const user = JSON.parse(localStorage.getItem('house_user'));
      setProperties(pRes.data.filter(p => p.listerId._id === user.id));
      setAppointments(aRes.data);
      setChats(cRes.data);
    } catch (err) {
       console.error(err);
    } finally {
       setLoading(false);
    }
  };

  const findChatForAppointment = (apptId) => {
      return chats.find(c => String(c.appointmentId?._id || c.appointmentId) === String(apptId));
  };

  const handleUpdateAppointment = async (id, status) => {
      try {
          await updateAppointmentStatus(id, status);
          fetchData();
          toast.success(`Request ${status.toUpperCase()}! Handshake complete.`);
      } catch (err) {
          toast.error("Handshake synchronization failure");
      }
  };

  const handleCreateProperty = async (e) => {
    e.preventDefault();
    if (!formData.locationLink.includes('google.com/maps')) {
       return toast.error("Provide a valid Google Maps link for verification");
    }

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    Array.from(images).forEach(img => data.append('images', img));

    const loadingToast = toast.loading('Adding property to marketplace...');
    try {
      await createProperty(data);
      setShowForm(false);
      setFormData({ name: '', number: '', address: '', floor: '', bhk: '1', dimensions: '', roadInfo: '', type: 'House', locationLink: '' });
      setImages([]);
      fetchData();
      toast.success('Property Added! Safe and Verified.', { id: loadingToast });
    } catch (err) {
      toast.error('Failed to add property.', { id: loadingToast });
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Office': return <Briefcase size={14} />;
      case 'Shop': return <ShoppingBag size={14} />;
      default: return <Building size={14} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <DashboardHeader 
        title={<>Owner <span className="text-sky-400">Dashboard</span></>}
        subtitle={`Manage your properties here. Verification HM_V_${JSON.parse(localStorage.getItem('house_user'))?.id?.slice(-5).toUpperCase()} active.`}
        icon={ShieldCheck}
        roleLabel="Market Participant"
        accentColor="sky"
        stats={[
          { label: "Total Houses", value: properties.length },
          { label: "New Requests", value: appointments.filter(a => a.status === 'pending').length, highlight: true }
        ]}
      />

      <div className="flex flex-col lg:flex-row justify-between items-center gap-10 mb-16">
          <div className="bg-white p-2 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-2 overflow-x-auto custom-scrollbar w-full md:w-auto">
              {['My Listings', 'Visit Requests', 'Metrics'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-10 py-3 rounded-[1.2rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${activeTab === tab ? 'bg-slate-900 text-white shadow-2xl px-14 scale-105' : 'text-slate-400 hover:text-slate-900'}`}
                  >
                      {tab}
                  </button>
              ))}
          </div>

          <button 
            onClick={() => setShowForm(!showForm)}
            className={`flex items-center gap-3 px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl transition-all ${showForm ? 'bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100' : 'bg-sky-600 text-white hover:bg-black hover:-translate-y-1'}`}
          >
            {showForm ? <><X size={18} /> CLOSE FORM</> : <><PlusCircle size={18} /> ADD NEW PROPERTY</>}
          </button>
      </div>

      <AnimatePresence>
        {showForm && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="mb-20">
                <div className="bg-white rounded-[2rem] md:rounded-[4rem] border border-slate-100 shadow-2xl overflow-hidden relative">
                    <div className="bg-slate-50/50 p-12 md:p-16 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-10">
                        <div>
                            <h2 className="text-4xl font-serif font-black text-slate-900 leading-none mb-3 tracking-tighter uppercase italic-none">Add New Listing</h2>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2"><Globe size={14} className="text-sky-400" /> Safe location link required</p>
                        </div>
                        <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm animate-pulse-slow"><Building className="text-sky-500" size={40} /></div>
                    </div>
                    <form onSubmit={handleCreateProperty} className="p-12 md:p-16 grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
                         <div className="space-y-10">
                            <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] border-b border-slate-100 pb-4">01. Home Type</h4>
                            <div className="space-y-6">
                                <input type="text" placeholder="ENTER HOUSE NAME (E.G. SKYLINE VILLA)..." required className="w-full px-8 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-8 focus:ring-sky-500/5 focus:border-sky-500 text-xs font-black tracking-widest transition-all outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                                <div className="grid grid-cols-2 gap-3">
                                    {['Flat', 'House', 'Villa', 'Office', 'Shop'].map(t => (
                                        <button key={t} type="button" onClick={() => setFormData({...formData, type: t})} className={`py-4 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${formData.type === t ? 'bg-sky-600 border-sky-600 text-white shadow-xl' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'}`}>
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                         </div>
                         <div className="space-y-10">
                            <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] border-b border-slate-100 pb-4">02. Location Details</h4>
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="FLOOR LEVEL..." required className="w-full px-8 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-500/10 text-xs font-black tracking-widest transition-all outline-none" value={formData.floor} onChange={e => setFormData({...formData, floor: e.target.value})} />
                                    <input type="text" placeholder="HOUSE NO..." required className="w-full px-8 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-500/10 text-xs font-black tracking-widest transition-all outline-none" value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} />
                                </div>
                                <div className="relative">
                                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                                    <input type="text" placeholder="ENTER FULL AREA ADDRESS..." required className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-500/10 text-xs font-black tracking-widest transition-all outline-none" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                                </div>
                                <div className="relative">
                                    <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-sky-400" size={20} />
                                    <input type="url" placeholder="PASTE GOOGLE MAPS LINK..." required className="w-full pl-16 pr-8 py-5 bg-sky-50 border border-sky-100 rounded-2xl focus:ring-8 focus:ring-sky-500/10 text-xs font-black tracking-widest transition-all outline-none" value={formData.locationLink} onChange={e => setFormData({...formData, locationLink: e.target.value})} />
                                </div>
                            </div>
                         </div>
                         <div className="space-y-10">
                            <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] border-b border-slate-100 pb-4">03. Photos & Size</h4>
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <select className="w-full px-8 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-500/10 text-[10px] font-black uppercase tracking-widest appearance-none outline-none" value={formData.bhk} onChange={e => setFormData({...formData, bhk: e.target.value})}>
                                        <option value="1">1 BHK</option>
                                        <option value="2">2 BHK</option>
                                        <option value="3">3 BHK</option>
                                        <option value="4+">4+ BHK</option>
                                        <option value="Commercial">Commercial</option>
                                    </select>
                                    <input type="text" placeholder="SqFt Dimension" className="w-full px-8 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-500/10 text-xs font-black tracking-widest transition-all outline-none" value={formData.dimensions} onChange={e => setFormData({...formData, dimensions: e.target.value})} />
                                </div>
                                <div className="border-2 border-dashed border-slate-100 rounded-[2.5rem] p-8 hover:border-sky-500 transition-all bg-slate-50/50 flex flex-col items-center gap-4 group cursor-pointer relative shadow-inner">
                                    <Upload className="text-slate-300 group-hover:text-sky-600 transition-all group-hover:-translate-y-2" size={32} />
                                    <input type="file" multiple className="hidden" id="dash-imgs-pro" onChange={e => setImages(e.target.files)} />
                                    <label htmlFor="dash-imgs-pro" className="cursor-pointer text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] underline underline-offset-8 text-center px-4">TRANSMIT PHOTO ASSETS</label>
                                    {images.length > 0 && <span className="absolute -top-4 -right-4 bg-sky-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-black text-[12px] shadow-2xl border-4 border-white">{images.length}</span>}
                                </div>
                            </div>
                         </div>
                         <div className="md:col-span-3 pt-6">
                            <button type="submit" className="w-full py-6 bg-slate-900 border border-slate-900 hover:bg-black text-white rounded-2xl md:rounded-3xl font-black tracking-[0.4em] text-[12px] shadow-2xl transition-all hover:-translate-y-1 active:scale-95">AUTHENTICATE & PUBLISH LISTING</button>
                         </div>
                    </form>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <AnimatePresence mode="wait">
            {activeTab === 'My Listings' && (
                <motion.div key="listings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {properties.map((p, idx) => (
                        <motion.div 
                            key={p._id} 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-100 overflow-hidden group hover:shadow-2xl transition-all duration-700 hover:border-sky-100 flex flex-col relative"
                        >
                            <div className="relative h-64 overflow-hidden">
                                <img src={`http://localhost:5000${p.images[0]}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={p.name} />
                                <div className="absolute top-8 left-8 flex flex-col gap-3">
                                    <span className="bg-white/95 backdrop-blur-md px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-slate-900 shadow-xl flex gap-2 items-center leading-none border border-white/5">
                                        {getTypeIcon(p.type)} {p.type}
                                    </span>
                                    {p.images?.length > 1 && (
                                        <span className="bg-slate-900/80 backdrop-blur-md px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest text-sky-300 self-start leading-none shadow-xl border border-white/5">
                                            {p.images.length} Photos
                                        </span>
                                    )}
                                </div>
                                <div className="absolute top-8 right-8">
                                    <div className={`p-3 rounded-2xl shadow-xl transition-all border border-white/20 ${p.status === 'open' ? 'bg-emerald-500/90 text-white' : 'bg-rose-500/90 text-white'}`}>
                                        {p.status === 'open' ? <ShieldCheck size={18} /> : <Lock size={18} />}
                                    </div>
                                </div>
                            </div>
                            <div className="p-10 grow flex flex-col">
                                <h3 className="text-3xl font-serif font-black text-slate-900 group-hover:text-sky-600 transition-colors mb-2 truncate uppercase italic-none tracking-tighter">{p.name}</h3>
                                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest flex items-center gap-3 mb-10"><MapPin size={16} className="text-sky-500" /> {p.address}</p>
                                
                                <div className="grid grid-cols-2 gap-4 mb-10">
                                    <div className="p-5 bg-slate-50 rounded-3xl flex flex-col items-center group-hover:bg-sky-50 transition-colors">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Exposure</span>
                                        <span className="text-sm font-black text-slate-900 flex items-center gap-2"><Eye size={14} className="text-indigo-400" /> {p.views} Views</span>
                                    </div>
                                    <div className="p-5 bg-slate-50 rounded-3xl flex flex-col items-center group-hover:bg-sky-50 transition-colors">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</span>
                                        <span className={`text-[10px] font-black uppercase tracking-widest leading-none ${p.status === 'open' ? 'text-emerald-500' : 'text-rose-500'}`}>{p.status.toUpperCase()}</span>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-auto">
                                    <button onClick={() => updatePropertyStatus(p._id, p.status === 'open' ? 'booked' : 'open')} className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl hover:-translate-y-1 ${p.status === 'open' ? 'bg-slate-900 text-white hover:bg-black' : 'bg-white text-slate-900 border border-slate-200'}`}>
                                        {p.status === 'open' ? 'MARK BOOKED' : 'MAKE AVAILABLE'}
                                    </button>
                                    <button onClick={() => navigate(`/property/${p._id}`)} className="p-4 bg-sky-50 text-sky-600 rounded-2xl hover:bg-sky-600 hover:text-white transition-all shadow-sm">
                                        <ArrowUpRight size={20} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {properties.length === 0 && (
                        <div className="col-span-full">
                            <EmptyState 
                                title="No Properties Yet"
                                message="Start listing your properties to attract tenants. Every listing needs a safe location link."
                                icon={Layout}
                                actionText="ADD NEW PROPERTY"
                                onAction={() => setShowForm(true)}
                                color="sky"
                            />
                        </div>
                    )}
                </motion.div>
            )}

            {activeTab === 'Visit Requests' && (
                <motion.div key="appointments" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-8 max-w-5xl mx-auto pb-10">
                    {appointments.length > 0 ? appointments.map((a, idx) => {
                        const existingChat = findChatForAppointment(a._id);
                        return (
                            <motion.div 
                                key={a._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white p-8 md:p-12 rounded-[2rem] md:rounded-[4rem] border border-slate-100 flex flex-col lg:flex-row items-center justify-between gap-12 group hover:shadow-2xl transition-all duration-700 hover:border-sky-300"
                            >
                                <div className="flex items-center gap-10 grow w-full">
                                    <div className="w-24 h-24 bg-slate-900 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center font-black text-4xl text-white shadow-2xl relative">
                                        {a.customerId?.name?.[0]}
                                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-sky-500 border-4 border-white rounded-full flex items-center justify-center">
                                            <Activity size={14} className="text-white" />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-4">
                                            <h4 className="text-3xl font-serif font-black text-slate-900 tracking-tight uppercase italic-none">{a.customerId?.name}</h4>
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest leading-none ${a.status === 'pending' ? 'bg-amber-50 text-amber-500' : a.status === 'approved' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                                                {a.status}
                                            </span>
                                        </div>
                                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 text-slate-400">
                                            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><Building size={14} className="text-sky-500" /> {a.propertyId?.name}</span>
                                            <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-slate-100"></span>
                                            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><Calendar size={14} className="text-indigo-400" /> Date: {new Date(a.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 w-full lg:w-auto shrink-0">
                                    {a.status === 'pending' ? (
                                        <div className="flex gap-4 w-full lg:w-auto">
                                            <button onClick={() => handleUpdateAppointment(a._id, 'approved')} className="flex-1 lg:flex-none bg-emerald-500 hover:bg-black text-white px-10 py-5 rounded-2xl shadow-xl transition-all font-black text-[10px] uppercase tracking-widest">APPROVE VISIT</button>
                                            <button onClick={() => handleUpdateAppointment(a._id, 'rejected')} className="flex-1 lg:flex-none bg-white border border-slate-200 text-slate-400 hover:text-rose-600 px-6 py-5 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest">REJECT</button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-4 w-full lg:w-auto">
                                            {existingChat ? (
                                                <Link to={`/chats/${existingChat._id}`} className="flex-1 lg:flex-none bg-slate-900 hover:bg-black text-white px-10 py-5 rounded-2xl flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-widest shadow-2xl transition-all">
                                                   OPEN CHAT <MessageSquare size={18} />
                                                </Link>
                                            ) : (
                                                <div className="px-10 py-5 bg-slate-50 border border-slate-100 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center">CHANNEL READY</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    }) : (
                        <EmptyState 
                            title="No Requests"
                            message="You have no active visit requests from tenants right now."
                            icon={Calendar}
                            color="sky"
                        />
                    )}
                </motion.div>
            )}

            {activeTab === 'Metrics' && (
                <motion.div key="metrics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-10 md:p-20 text-center glass rounded-[2rem] md:rounded-[4rem] border border-slate-100">
                    <Activity size={80} className="mx-auto text-sky-500 mb-8 animate-pulse" />
                    <h3 className="text-3xl font-serif font-black text-slate-900 mb-4 uppercase italic-none">Property Analytics</h3>
                    <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">Advanced data on your property views and tenant conversion will be available soon.</p>
                </motion.div>
            )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default TenantDashboard;
