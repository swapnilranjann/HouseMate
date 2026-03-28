import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getProperties, getMyAppointments, createProperty, updatePropertyStatus, updateAppointmentStatus } from '../services/api';
import { Plus, Home, MapPin, Eye, Upload, Check, X, ShieldCheck, LayoutGrid, Clock, Calendar, MessageSquare, AlertCircle, Briefcase, ShoppingBag, Building, ArrowUpRight, PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const TenantDashboard = () => {
  const [activeTab, setActiveTab] = useState('listings');
  const [properties, setProperties] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: '', number: '', address: '', floor: '', bhk: '1', dimensions: '', roadInfo: '', type: 'House'
  });
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchData();
    // Check if we should open the form automatically
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

  const handleCreateProperty = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    Array.from(images).forEach(img => data.append('images', img));

    try {
      await createProperty(data);
      setShowForm(false);
      setFormData({ name: '', number: '', address: '', floor: '', bhk: '1', dimensions: '', roadInfo: '', type: 'House' });
      setImages([]);
      fetchData();
      toast.success('Property listed successfully!');
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
      
      {/* Premium Header Section */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 mb-10 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-sky-500/20 p-2 rounded-xl border border-sky-500/30">
                        <LayoutGrid className="text-sky-400" size={24} />
                    </div>
                    <span className="text-sky-400 font-black text-xs uppercase tracking-widest">Property Manager</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black tracking-tight">Owner <span className="text-sky-400">Portal</span></h1>
                  <p className="text-slate-400 mt-2 font-medium">Elevating your real estate business with precision tools.</p>
              </div>

              <div className="flex flex-wrap gap-4">
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl min-w-[140px]">
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Assets</p>
                      <h3 className="text-3xl font-black">{properties.length}</h3>
                  </div>
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl min-w-[140px]">
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Pending Inquiries</p>
                      <h3 className="text-3xl font-black">{appointments.filter(a => a.status === 'pending').length}</h3>
                  </div>
              </div>
          </div>
          
          {/* Decorative background elements */}
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-1">
              {['listings', 'appointments'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
                  >
                      {tab}
                  </button>
              ))}
          </div>

          <button 
            onClick={() => setShowForm(!showForm)}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black tracking-widest shadow-xl transition-all ${showForm ? 'bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100' : 'bg-sky-600 text-white hover:bg-black hover:scale-105'}`}
          >
            {showForm ? <><X size={20} /> DISCARD LISTING</> : <><PlusCircle size={20} /> LIST NEW PROPERTY</>}
          </button>
      </div>

      {/* Listing Form */}
      <AnimatePresence>
        {showForm && (
            <motion.div 
                initial={{ opacity: 0, y: -20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -20, height: 0 }}
                className="overflow-hidden mb-12"
            >
                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden">
                    <div className="bg-slate-50 p-8 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create Listing</h2>
                            <p className="text-slate-400 text-sm font-medium">Provide detailed information to attract premium tenants.</p>
                        </div>
                        <ShieldCheck className="text-sky-500" size={32} />
                    </div>
                    <form onSubmit={handleCreateProperty} className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                         {/* Content same as before but encapsulated in this new premium container */}
                         <div className="space-y-6">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Property Essentials</label>
                            <input type="text" placeholder="Glow Residency / Luxury Shop" required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 font-bold transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                            
                            <div className="grid grid-cols-2 gap-3">
                                {['House', 'Flat', 'Office', 'Shop', 'Villa'].map(t => (
                                    <button key={t} type="button" onClick={() => setFormData({...formData, type: t})} className={`py-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${formData.type === t ? 'bg-sky-600 border-sky-600 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}>
                                        {t}
                                    </button>
                                ))}
                            </div>
                         </div>

                         <div className="space-y-6">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location Details</label>
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="ID/No." required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 font-bold transition-all" value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} />
                                <input type="text" placeholder="Floor" required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 font-bold transition-all" value={formData.floor} onChange={e => setFormData({...formData, floor: e.target.value})} />
                            </div>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input type="text" placeholder="Full Address" required className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 font-bold transition-all" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                            </div>
                         </div>

                         <div className="space-y-6">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Specs & Visuals</label>
                            <div className="grid grid-cols-2 gap-4">
                                <select className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-500/10 appearance-none font-bold" value={formData.bhk} onChange={e => setFormData({...formData, bhk: e.target.value})}>
                                    <option value="N/A">Comm</option>
                                    <option value="1">1 BHK</option>
                                    <option value="2">2 BHK</option>
                                    <option value="3">3 BHK</option>
                                    <option value="4+">4+ BHK</option>
                                </select>
                                <input type="text" placeholder="SqFt area" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-500/10 font-bold transition-all" value={formData.dimensions} onChange={e => setFormData({...formData, dimensions: e.target.value})} />
                            </div>
                            <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-6 hover:border-sky-300 transition-all bg-slate-50 flex flex-col items-center gap-2 group cursor-pointer relative">
                                <Upload className="text-slate-300 group-hover:text-sky-500 transition-colors" size={32} />
                                <input type="file" multiple className="hidden" id="dash-imgs" onChange={e => setImages(e.target.files)} />
                                <label htmlFor="dash-imgs" className="cursor-pointer text-xs font-black text-sky-600 uppercase tracking-widest underline decoration-2 underline-offset-4">Drag or Click to Upload</label>
                                {images.length > 0 && <span className="absolute -top-3 -right-3 bg-emerald-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shadow-lg">{images.length}</span>}
                            </div>
                         </div>

                         <div className="md:col-span-3 pt-6">
                            <button type="submit" className="w-full py-5 bg-slate-900 border border-slate-900 hover:bg-black text-white rounded-[1.5rem] font-black tracking-[0.2em] shadow-2xl transition-all">PUBLISH TO MARKETPLACE</button>
                         </div>
                    </form>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Grid */}
      <AnimatePresence mode="wait">
        {activeTab === 'listings' ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
                {properties.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {properties.map(p => (
                            <div key={p._id} className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden group hover:shadow-2xl transition-all duration-500">
                                <div className="relative h-64 overflow-hidden">
                                    <img src={`http://localhost:5000${p.images[0]}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={p.name} />
                                    <div className="absolute top-6 left-6 flex gap-2">
                                        <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-xl flex items-center gap-2">
                                            {getTypeIcon(p.type)} {p.type}
                                        </span>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>
                                <div className="p-8">
                                    <h3 className="text-2xl font-black text-slate-900 mb-1 group-hover:text-sky-600 transition-colors">{p.name}</h3>
                                    <p className="text-slate-400 font-bold text-xs flex items-center gap-1.5 mb-6"><MapPin size={14} className="text-sky-500" /> {p.address}</p>
                                    
                                    <div className="flex gap-4 mb-8">
                                        <div className="px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">BHK</span>
                                            <span className="text-sm font-black text-slate-900">{p.bhk}</span>
                                        </div>
                                        <div className="px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Views</span>
                                            <span className="text-sm font-black text-slate-900">{p.views}</span>
                                        </div>
                                        <div className="px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center grow">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Status</span>
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${p.status === 'open' ? 'text-emerald-500' : 'text-rose-500'}`}>{p.status}</span>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={() => updatePropertyStatus(p._id, p.status === 'open' ? 'booked' : 'open')}
                                        className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-lg ${p.status === 'open' ? 'bg-slate-900 text-white hover:bg-black' : 'bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100'}`}
                                    >
                                        {p.status === 'open' ? 'MARK AS BOOKED' : 'UNMARK BOOKED'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-32 text-center bg-white rounded-[3rem] border-4 border-dashed border-slate-100 flex flex-col items-center max-w-2xl mx-auto shadow-inner">
                        <div className="bg-slate-50 w-32 h-32 rounded-full flex items-center justify-center mb-8 border border-slate-100">
                             <Home size={64} className="text-slate-200" />
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Zero Listings Found</h2>
                        <p className="text-slate-500 mt-4 text-lg font-medium max-w-xs">Your portfolio is currently empty. Start listing your premium properties to attract the best tenants.</p>
                        <button 
                           onClick={() => setShowForm(true)}
                           className="mt-10 bg-sky-600 hover:bg-black text-white px-10 py-5 rounded-3xl font-black tracking-widest shadow-2xl transition-all flex items-center gap-3 active:scale-95"
                        >
                            <Plus size={24} /> LIST YOUR FIRST ASSET
                        </button>
                    </div>
                )}
            </motion.div>
        ) : (
            <div className="space-y-6 max-w-4xl mx-auto">
                 {appointments.length > 0 ? appointments.map(a => (
                    <div key={a._id} className="bg-white p-8 rounded-[2rem] border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-8 group hover:border-sky-300 transition-all shadow-sm">
                        <div className="flex items-center gap-8 grow">
                            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-xl">
                                {a.customerId.name[0]}
                            </div>
                            <div>
                                <h4 className="text-xl font-black text-slate-900 tracking-tight mb-1">{a.customerId.name}</h4>
                                <div className="flex items-center gap-3">
                                    <span className="bg-sky-50 text-sky-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-sky-100 flex items-center gap-1.5"><Calendar size={12}/> Showing</span>
                                    <span className="text-slate-400 font-bold text-xs">For <span className="text-slate-900 underline decoration-sky-500/20">{a.propertyId?.name}</span></span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {a.status === 'pending' ? (
                                <>
                                    <button onClick={() => updateAppointmentStatus(a._id, 'approved')} className="bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-2xl shadow-lg transition-all"><Check size={20}/></button>
                                    <button onClick={() => updateAppointmentStatus(a._id, 'rejected')} className="bg-rose-500 hover:bg-rose-600 text-white p-4 rounded-2xl shadow-lg transition-all"><X size={20}/></button>
                                </>
                            ) : (
                                <span className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${a.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                    {a.status}
                                </span>
                            )}
                            {a.status === 'approved' && (
                                <button className="bg-sky-600 hover:bg-black text-white p-4 rounded-2xl shadow-xl transition-all">
                                    <MessageSquare size={20} />
                                </button>
                            )}
                        </div>
                    </div>
                 )) : (
                    <div className="py-24 text-center bg-white rounded-[3rem] border border-slate-200 shadow-inner">
                         <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Calendar size={40} className="text-slate-200" />
                         </div>
                         <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tighter">No Active Requests</h3>
                         <p className="text-slate-500 font-medium">Sit back and relax. We'll notify you when someone wants to see your property.</p>
                    </div>
                 )}
            </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TenantDashboard;
