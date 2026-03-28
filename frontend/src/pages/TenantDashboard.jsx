import React, { useState, useEffect } from 'react';
import { getProperties, getMyAppointments, createProperty, updatePropertyStatus, updateAppointmentStatus } from '../services/api';
import { Plus, Home, MapPin, Eye, Upload, Check, X, ShieldCheck, LayoutGrid, Clock, Calendar, MessageSquare, AlertCircle, Briefcase, ShoppingBag, Building } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const TenantDashboard = () => {
  const [activeTab, setActiveTab] = useState('listings');
  const [properties, setProperties] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    name: '', number: '', address: '', floor: '', bhk: '1', dimensions: '', roadInfo: '', type: 'House'
  });
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleUpdateAppointment = async (id, status) => {
    try {
      await updateAppointmentStatus(id, status);
      fetchData();
      toast.success(`Appointment ${status}!`);
    } catch (err) {
      toast.error('Error updating appointment');
    }
  };

  const updatePropStatus = async (id, status) => {
    try {
      await updatePropertyStatus(id, status);
      fetchData();
      toast.success(`Property status updated to ${status}`);
    } catch (err) {
      toast.error('Error updating status');
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
    <div className="space-y-10 pb-20">
      {/* Dashboard Top Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold flex items-center gap-3">
             <LayoutGrid className="text-sky-500" size={32} /> Owner <span className="text-sky-500">Portal</span>
          </h1>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Manage your real estate assets</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner">
           <button onClick={() => setActiveTab('listings')} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'listings' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-900'}`}>My Listings</button>
           <button onClick={() => setActiveTab('appointments')} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'appointments' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-900'}`}>Appointments</button>
        </div>

        <button 
          onClick={() => setShowForm(!showForm)} 
          className="bg-sky-600 hover:bg-black text-white px-8 py-3 rounded-2xl text-sm shadow-xl font-black transition-all flex items-center gap-3"
        >
          {showForm ? 'CANCEL' : 'LIST NEW PROPERTY'}
          <Plus size={18} className={`transition-transform duration-500 ${showForm ? 'rotate-45' : ''}`} />
        </button>
      </header>

      {/* Add Property Form */}
      <AnimatePresence>
        {showForm && (
           <motion.div 
             initial={{ height: 0, opacity: 0 }}
             animate={{ height: 'auto', opacity: 1 }}
             exit={{ height: 0, opacity: 0 }}
             className="bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-2xl"
           >
              <form onSubmit={handleCreateProperty} className="p-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-6 md:col-span-1">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Property Name</label>
                    <input type="text" placeholder="Emerald Office / Luxury Flat" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 font-bold" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Property Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['House', 'Flat', 'Office', 'Shop', 'Villa'].map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setFormData({...formData, type: t})}
                          className={`py-2 rounded-lg text-xs font-bold border transition-all ${formData.type === t ? 'bg-sky-600 border-sky-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6 md:col-span-1">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Flat/Shop No.</label>
                        <input type="text" placeholder="B-123" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 font-bold" value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Floor</label>
                        <input type="text" placeholder="Gnd / 4th" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 font-bold" value={formData.floor} onChange={e => setFormData({...formData, floor: e.target.value})} />
                      </div>
                    </div>
                    <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Full Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input type="text" placeholder="Address, City" required className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 font-bold" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                    </div>
                  </div>
                </div>

                <div className="space-y-6 md:col-span-1">
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Config (BHK)</label>
                         <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 font-bold appearance-none" value={formData.bhk} onChange={e => setFormData({...formData, bhk: e.target.value})}>
                            <option value="N/A">N/A (Comm)</option>
                            <option value="1">1 BHK</option>
                            <option value="2">2 BHK</option>
                            <option value="3">3 BHK</option>
                            <option value="4+">4+ BHK</option>
                         </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">SqFt / Area</label>
                         <input type="text" placeholder="1200" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 font-bold" value={formData.dimensions} onChange={e => setFormData({...formData, dimensions: e.target.value})} />
                      </div>
                   </div>
                   <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Property Photos</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 hover:border-sky-300 transition-all flex flex-col items-center gap-2 bg-slate-50">
                       <Upload className="text-slate-300" size={24} />
                       <input type="file" multiple className="hidden" id="imgs" onChange={e => setImages(e.target.files)} />
                       <label htmlFor="imgs" className="cursor-pointer text-xs font-black text-sky-600 hover:text-sky-700">CLICK TO BROWSE</label>
                       {images.length > 0 && <p className="text-[10px] text-green-600 font-black uppercase tracking-widest">{images.length} Selected</p>}
                    </div>
                   </div>
                </div>

                <div className="md:col-span-3 pt-4">
                   <button type="submit" className="w-full py-4 bg-sky-600 hover:bg-black text-white rounded-2xl font-black tracking-widest shadow-xl transition-all">START LISTING PROPERTY</button>
                </div>
              </form>
           </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'listings' ? (
           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {properties.length > 0 ? properties.map(p => (
                   <div key={p._id} className="bg-white group rounded-[2rem] overflow-hidden border border-slate-200 hover:border-sky-300 transition-all flex flex-col shadow-sm hover:shadow-xl">
                      <div className="relative h-56 overflow-hidden">
                        <img src={`http://localhost:5000${p.images[0]}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={p.name} />
                        <div className="absolute top-4 left-4 flex gap-2">
                            <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-900 border border-slate-200 shadow-sm flex items-center gap-1">
                                {getTypeIcon(p.type)} {p.type}
                            </span>
                        </div>
                        <div className="absolute top-4 right-4 flex items-center gap-2">
                          {p.status === 'open' ? 
                            <span className="bg-emerald-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg">AVAILABLE</span> :
                            <span className="bg-rose-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg">BOOKED</span>
                          }
                        </div>
                      </div>
                      <div className="p-8 space-y-5">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-black text-xl text-slate-900 group-hover:text-sky-600 transition-colors tracking-tight">{p.name}</h3>
                            <p className="text-xs text-slate-400 font-bold flex items-center gap-1 mt-1 group-hover:text-slate-600 transition-colors"><MapPin size={12} /> {p.address}</p>
                          </div>
                          <div className="text-right">
                             <span className="text-[10px] font-black text-sky-600 bg-sky-50 px-2.5 py-1.5 rounded-lg border border-sky-100 flex items-center gap-1 shadow-sm"><Eye size={12} /> {p.views}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6 py-4 border-y border-slate-100">
                           <div className="flex flex-col">
                               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Config</span>
                               <span className="text-sm font-black text-slate-900">{p.bhk === 'N/A' ? 'Comm' : `${p.bhk} BHK`}</span>
                           </div>
                           <div className="w-px h-8 bg-slate-100"></div>
                           <div className="flex flex-col">
                               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Floor</span>
                               <span className="text-sm font-black text-slate-900">{p.floor}</span>
                           </div>
                           <div className="w-px h-8 bg-slate-100"></div>
                           <div className="flex flex-col">
                               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Area</span>
                               <span className="text-sm font-black text-slate-900">{p.dimensions || 'N/A'}</span>
                           </div>
                        </div>

                        <button 
                            onClick={() => updatePropStatus(p._id, p.status === 'open' ? 'booked' : 'open')}
                            className={`w-full py-4 rounded-2xl text-xs font-black tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${p.status === 'open' ? 'bg-slate-900 text-white hover:bg-black' : 'bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100 shadow-sm'} shadow-lg`}
                        >
                            {p.status === 'open' ? <>Mark as Booked</> : <><Check size={16}/> Re-open Listing</>}
                        </button>
                      </div>
                   </div>
                 )) : (
                    <div className="col-span-full py-32 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                       <Home size={64} className="mx-auto text-slate-200 mb-4" />
                       <p className="font-extrabold text-slate-400 tracking-tight text-xl">NO LISTINGS YET</p>
                       <p className="text-slate-400 font-medium mt-2">Start by clicking 'List New Property' above.</p>
                    </div>
                 )}
              </div>
           </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4 max-w-5xl mx-auto">
             {appointments.length > 0 ? (
               <div className="space-y-4">
                 {appointments.map(a => (
                    <div key={a._id} className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-sky-300 transition-all shadow-sm hover:shadow-md">
                       <div className="flex items-center gap-6 flex-grow">
                          <div className="bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl text-white border border-slate-800 shadow-xl">{a.customerId.name[0]}</div>
                          <div className="space-y-1">
                             <div className="flex items-center gap-2">
                                <h4 className="text-xl font-black text-slate-900 group-hover:text-sky-600 transition-colors tracking-tight">{a.customerId.name}</h4>
                                <span className="text-[10px] font-black text-sky-600 uppercase bg-sky-50 px-2.5 py-1 rounded border border-sky-100 tracking-widest">Customer</span>
                             </div>
                             <p className="text-sm font-bold text-slate-500 flex items-center gap-1.5"><Clock size={16} className="text-sky-500" /> Interested in <span className="text-slate-900 underline decoration-sky-500/30 underline-offset-4 font-black">{a.propertyId?.name}</span></p>
                             <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">Request Received: {new Date(a.requestedDate).toLocaleDateString()}</p>
                          </div>
                       </div>

                       <div className="flex items-center gap-3">
                          {a.status === 'pending' ? (
                            <>
                              <button onClick={() => handleUpdateAppointment(a._id, 'approved')} className="bg-emerald-500 text-white hover:bg-emerald-600 p-3.5 rounded-2xl shadow-lg transition-all" title="Approve"><Check size={20} /></button>
                              <button onClick={() => handleUpdateAppointment(a._id, 'rejected')} className="bg-rose-500 text-white hover:bg-rose-600 p-3.5 rounded-2xl shadow-lg transition-all" title="Reject"><X size={20} /></button>
                            </>
                          ) : (
                            <div className="flex items-center gap-4">
                              <span className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${a.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                {a.status}
                              </span>
                              {a.status === 'approved' && (
                                <button className="bg-sky-600 text-white p-2.5 rounded-2xl hover:scale-110 transition-transform shadow-lg shadow-sky-600/20">
                                   <MessageSquare size={18} />
                                </button>
                              )}
                            </div>
                          )}
                       </div>
                    </div>
                  ))}
               </div>
             ) : (
               <div className="py-32 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                  <Calendar size={64} className="mx-auto text-slate-200 mb-4" />
                  <p className="font-extrabold text-slate-400 tracking-tight text-xl uppercase">Clean Slate</p>
                  <p className="text-slate-400 font-medium mt-2">No showing requests on the calendar yet.</p>
               </div>
             )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TenantDashboard;
