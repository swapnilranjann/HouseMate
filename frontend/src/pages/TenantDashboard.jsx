import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { getProperties, getMyAppointments, createProperty, updatePropertyStatus, updateAppointmentStatus } from '../services/api';
import { Plus, Home, MapPin, Eye, Upload, Check, X, ShieldCheck, LayoutGrid, Clock, Calendar, MessageSquare, AlertCircle, Briefcase, ShoppingBag, Building, ArrowUpRight, PlusCircle, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import DashboardHeader from '../components/DashboardHeader';
import EmptyState from '../components/EmptyState';

const TenantDashboard = () => {
  const [activeTab, setActiveTab] = useState('listings');
  const [properties, setProperties] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
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
      const [pRes, aRes] = await Promise.all([
        getProperties(),
        getMyAppointments()
      ]);
      const user = JSON.parse(localStorage.getItem('house_user'));
      setProperties(pRes.data.filter(p => p.listerId._id === user.id));
      setAppointments(aRes.data);
    } catch (err) {
       console.error(err);
    } finally {
       setLoading(false);
    }
  };

  const handleUpdateAppointment = async (id, status) => {
      try {
          await updateAppointmentStatus(id, status);
          fetchData();
          toast.success(`Request ${status}!`);
      } catch (err) {
          toast.error("Error updating request");
      }
  };

  const handleCreateProperty = async (e) => {
    e.preventDefault();
    if (!formData.locationLink.includes('google.com/maps')) {
       return toast.error("Please provide a valid Google Maps link");
    }

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    Array.from(images).forEach(img => data.append('images', img));

    try {
      await createProperty(data);
      setShowForm(false);
      setFormData({ name: '', number: '', address: '', floor: '', bhk: '1', dimensions: '', roadInfo: '', type: 'House', locationLink: '' });
      setImages([]);
      fetchData();
      toast.success('Property listed successfully with secure location!');
    } catch (err) {
      toast.error('Failed to list property');
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Office': return <Briefcase size={14} />;
      case 'Shop': return <ShoppingBag size={14} />;
      case 'Flat': return <Building size={14} />;
      default: return <Home size={14} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <DashboardHeader 
        title={<>Owner <span className="text-sky-400">Portal</span></>}
        subtitle={`Managing your real-estate portfolio with a classic, high-end approach. Tracking ${properties.length} active listings across your enterprise.`}
        icon={LayoutGrid}
        roleLabel="Property Manager"
        accentColor="sky"
        stats={[
          { label: "Total Assets", value: properties.length },
          { label: "Pending Inquiries", value: appointments.filter(a => a.status === 'pending').length, highlight: true }
        ]}
      />

      {/* Main Controller Area */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-1">
              {['listings', 'appointments'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === tab ? 'bg-slate-900 text-white shadow-xl px-12 scale-105' : 'text-slate-400 hover:text-slate-900'}`}
                  >
                      {tab}
                  </button>
              ))}
          </div>

          <button 
            onClick={() => setShowForm(!showForm)}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl transition-all ${showForm ? 'bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100' : 'bg-sky-600 text-white hover:bg-black hover:-translate-y-1'}`}
          >
            {showForm ? <><X size={18} /> DISCARD LISTING</> : <><PlusCircle size={18} /> CREATE NEW ASSET</>}
          </button>
      </div>

      <AnimatePresence>
        {showForm && (
            <motion.div initial={{ opacity: 0, y: -20, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -20, height: 0 }} className="overflow-hidden mb-12">
                <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden">
                    <div className="bg-slate-50 p-10 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-serif italic font-black text-slate-900 tracking-tighter uppercase leading-none mb-2 italic font-black">Create New Listing</h2>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Provide detailed information to attract premium tenants.</p>
                        </div>
                        <ShieldCheck className="text-sky-500 animate-pulse-slow" size={40} />
                    </div>
                    <form onSubmit={handleCreateProperty} className="p-10 md:p-14 grid grid-cols-1 md:grid-cols-3 gap-10">
                         <div className="space-y-6">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Property Essentials</label>
                            <input type="text" placeholder="Emerald Office / Luxury Flat" required className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 text-xs font-black tracking-widest transition-all outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                            <div className="grid grid-cols-2 gap-3">
                                {['House', 'Flat', 'Office', 'Shop', 'Villa'].map(t => (
                                    <button key={t} type="button" onClick={() => setFormData({...formData, type: t})} className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${formData.type === t ? 'bg-sky-600 border-sky-600 text-white shadow-xl' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}>
                                        {t}
                                    </button>
                                ))}
                            </div>
                         </div>
                         <div className="space-y-6">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location Tracking</label>
                            <div className="grid grid-cols-2 gap-3">
                                <input type="text" placeholder="ID/No." required className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-500/10 text-xs font-black tracking-widest transition-all outline-none" value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} />
                                <input type="text" placeholder="Floor" required className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-500/10 text-xs font-black tracking-widest transition-all outline-none" value={formData.floor} onChange={e => setFormData({...formData, floor: e.target.value})} />
                            </div>
                            <div className="relative">
                                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input type="text" placeholder="Full Location Address" required className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-500/10 text-xs font-black tracking-widest transition-all outline-none" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                            </div>
                            <div className="relative">
                                <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-sky-400" size={18} />
                                <input type="url" placeholder="Paste Google Maps Link (Mandatory)" required className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-500/10 text-xs font-black tracking-widest transition-all outline-none" value={formData.locationLink} onChange={e => setFormData({...formData, locationLink: e.target.value})} />
                            </div>
                         </div>
                         <div className="space-y-6">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Specs & Visuals</label>
                            <div className="grid grid-cols-2 gap-4">
                                <select className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-500/10 text-[10px] font-black uppercase tracking-widest appearance-none outline-none" value={formData.bhk} onChange={e => setFormData({...formData, bhk: e.target.value})}>
                                    <option value="N/A">BHK: N/A</option>
                                    <option value="1">1 BHK</option>
                                    <option value="2">2 BHK</option>
                                    <option value="3">3 BHK</option>
                                    <option value="4+">4+ BHK</option>
                                </select>
                                <input type="text" placeholder="Area SqFt" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-500/10 text-xs font-black tracking-widest transition-all outline-none" value={formData.dimensions} onChange={e => setFormData({...formData, dimensions: e.target.value})} />
                            </div>
                            <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-6 hover:border-sky-500 transition-all bg-slate-50 flex flex-col items-center gap-2 group cursor-pointer relative">
                                <Upload className="text-slate-300 group-hover:text-sky-600 transition-all group-hover:-translate-y-1" size={24} />
                                <input type="file" multiple className="hidden" id="dash-imgs" onChange={e => setImages(e.target.files)} />
                                <label htmlFor="dash-imgs" className="cursor-pointer text-[9px] font-black text-sky-600 uppercase tracking-widest underline underline-offset-8">TRANSMIT PHOTO ASSETS</label>
                                {images.length > 0 && <span className="absolute -top-3 -right-3 bg-slate-900 text-white w-8 h-8 rounded-full flex items-center justify-center font-black text-[10px] shadow-2xl">{images.length}</span>}
                            </div>
                         </div>
                         <div className="md:col-span-3 pt-6">
                            <button type="submit" className="w-full py-5 bg-slate-900 border border-slate-900 hover:bg-black text-white rounded-2xl font-black tracking-[0.3em] text-[11px] shadow-2xl transition-all hover:-translate-y-1">PUBLISH TO MARKETPLACE</button>
                         </div>
                    </form>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Results Main Grid */}
      <AnimatePresence mode="wait">
        {activeTab === 'listings' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {properties.map(p => (
                    <div key={p._id} className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:border-sky-100 flex flex-col">
                        <div className="relative h-64 overflow-hidden">
                            <img src={`http://localhost:5000${p.images[0]}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={p.name} />
                            <div className="absolute top-6 left-6">
                                <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-slate-900 shadow-xl border border-white/50 flex gap-2 items-center leading-none">
                                    {getTypeIcon(p.type)} {p.type || 'House'}
                                </span>
                            </div>
                        </div>
                        <div className="p-8 grow flex flex-col">
                            <h3 className="text-2xl font-serif italic text-slate-900 group-hover:text-sky-600 transition-colors mb-1 truncate">{p.name}</h3>
                            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 mb-6"><MapPin size={12} className="text-sky-500" /> {p.address}</p>
                            
                            <div className="grid grid-cols-3 gap-3 mb-8">
                                <div className="p-4 bg-slate-50 rounded-[1.5rem] flex flex-col items-center">
                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mb-1 leading-none">Config</span>
                                    <span className="text-xs font-black text-slate-900">{p.bhk === 'N/A' ? 'COMM' : `${p.bhk} BHK`}</span>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-[1.5rem] flex flex-col items-center">
                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mb-1 leading-none">Views</span>
                                    <span className="text-xs font-black text-slate-900">{p.views}</span>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-[1.5rem] flex flex-col items-center">
                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mb-1 leading-none">Status</span>
                                    <span className={`text-[8px] font-black uppercase tracking-widest leading-none ${p.status === 'open' ? 'text-emerald-500' : 'text-rose-500'}`}>{p.status}</span>
                                </div>
                            </div>
                            <button onClick={() => updatePropertyStatus(p._id, p.status === 'open' ? 'booked' : 'open')} className={`mt-auto w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl hover:-translate-y-1 ${p.status === 'open' ? 'bg-slate-900 text-white hover:bg-black' : 'bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100'}`}>
                                {p.status === 'open' ? 'MARK AS SECURED' : 'UNMARK SECURED'}
                            </button>
                        </div>
                    </div>
                ))}
                {properties.length === 0 && (
                   <EmptyState 
                    title="Portfolio Empty"
                    message="Start listing your premium properties to attract high-tier tenants. Every listing now requires a secure location link for verification."
                    icon={Home}
                    actionText="LIST YOUR FIRST ASSET"
                    onAction={() => setShowForm(true)}
                    color="sky"
                   />
                )}
            </div>
        ) : (
            <div className="space-y-6 max-w-4xl mx-auto pb-10">
                 {appointments.length > 0 ? appointments.map(a => (
                    <div key={a._id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-10 group hover:border-sky-300 transition-all shadow-sm">
                        <div className="flex items-center gap-8 grow">
                            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-xl">
                                {a.customerId?.name?.[0]}
                            </div>
                            <div>
                                <h4 className="text-xl font-serif italic font-black text-slate-900 tracking-tight mb-1 uppercase italic">{a.customerId?.name}</h4>
                                <div className="flex items-center gap-3">
                                    <span className="bg-sky-50 text-sky-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-sky-100 flex items-center gap-1.5 leading-none"><Calendar size={12}/> Visit Requested</span>
                                    <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest leading-none">For <span className="text-slate-900 underline decoration-sky-300 underline-offset-4">{a.propertyId?.name}</span></span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {a.status === 'pending' ? (
                                <>
                                    <button onClick={() => handleUpdateAppointment(a._id, 'approved')} className="bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-2xl shadow-xl transition-all"><Check size={20}/></button>
                                    <button onClick={() => handleUpdateAppointment(a._id, 'rejected')} className="bg-rose-500 hover:bg-rose-600 text-white p-4 rounded-2xl shadow-xl transition-all"><X size={20}/></button>
                                </>
                            ) : (
                                <span className={`px-8 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest border leading-none ${a.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                    {a.status}
                                </span>
                            )}
                            {a.status === 'approved' && (
                                <Link to={`/chats/${a._id}`} className="bg-slate-900 hover:bg-black text-white p-4 rounded-2xl shadow-2xl transition-all hover:scale-105">
                                    <MessageSquare size={20} />
                                </Link>
                            )}
                        </div>
                    </div>
                 )) : (
                    <EmptyState 
                      title="Schedule Idle"
                      message="No active visit requests have been logged today. Your Enterprise schedule is clear."
                      icon={Calendar}
                      color="sky"
                    />
                 )}
            </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TenantDashboard;
