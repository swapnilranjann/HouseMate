import React, { useState, useEffect } from 'react';
import { getProperties, getMyAppointments, createProperty, updatePropertyStatus, updateAppointmentStatus } from '../services/api';
import { Plus, Home, MapPin, Eye, Upload, Check, X, ShieldCheck, LayoutGrid, Clock, Calendar, MessageSquare, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TenantDashboard = () => {
  const [activeTab, setActiveTab] = useState('listings');
  const [properties, setProperties] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    name: '', number: '', address: '', floor: '', bhk: '1', dimensions: '', roadInfo: ''
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
      setProperties(pRes.data.filter(p => p.listerId._id === JSON.parse(localStorage.getItem('house_user')).id));
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
      fetchData();
      alert('Property listed successfully!');
    } catch (err) {
      alert('Failed to list property');
    }
  };

  const handleUpdateAppointment = async (id, status) => {
    try {
      await updateAppointmentStatus(id, status);
      fetchData();
      alert(`Appointment ${status}!`);
    } catch (err) {
      alert('Error updating appointment');
    }
  };

  const updatePropStatus = async (id, status) => {
    try {
      await updatePropertyStatus(id, status);
      fetchData();
      alert(`Property status updated to ${status}`);
    } catch (err) {
      alert('Error updating status');
    }
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Dashboard Top Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold flex items-center gap-3">
             <LayoutGrid className="title-gradient" size={32} /> Tenant <span className="title-gradient">Hub</span>
          </h1>
          <p className="text-text-muted text-sm font-medium opacity-60 uppercase tracking-widest">Manage your real estate empire</p>
        </div>

        <div className="flex bg-bg-card p-1 rounded-2xl border border-border-glass">
           <button onClick={() => setActiveTab('listings')} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'listings' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:text-white'}`}>Listings</button>
           <button onClick={() => setActiveTab('appointments')} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'appointments' ? 'bg-secondary text-white shadow-lg shadow-secondary/20' : 'text-text-muted hover:text-white'}`}>Appointments</button>
        </div>

        <button 
          onClick={() => setShowForm(!showForm)} 
          className="btn-primary group flex items-center gap-2 px-6 py-3 rounded-2xl text-sm shadow-xl font-black"
        >
          {showForm ? 'CANCEL' : 'LIST NEW PROPERTY'}
          <Plus size={18} className={`transition-transform duration-500 ${showForm ? 'rotate-45' : ''}`} />
        </button>
      </header>

      {/* Add Property Form Modal/Drawer Overlay Logic */}
      <AnimatePresence>
        {showForm && (
           <motion.div 
             initial={{ height: 0, opacity: 0 }}
             animate={{ height: 'auto', opacity: 1 }}
             exit={{ height: 0, opacity: 0 }}
             className="glass overflow-hidden border-primary/20 bg-gradient-to-br from-bg-dark to-primary/5"
           >
              <form onSubmit={handleCreateProperty} className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-muted uppercase tracking-widest px-1">House Name & Type</label>
                    <input type="text" placeholder="Glow Residency / Luxury BHK" required className="input-glass w-full" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-text-muted uppercase tracking-widest px-1">House No.</label>
                       <input type="text" placeholder="B-123" required className="input-glass w-full" value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-text-muted uppercase tracking-widest px-1">Floor</label>
                       <input type="text" placeholder="4th Floor" required className="input-glass w-full" value={formData.floor} onChange={e => setFormData({...formData, floor: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-muted uppercase tracking-widest px-1">Location / Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                      <input type="text" placeholder="123 Street Name, City, PIN" required className="input-glass w-full pl-10" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <label className="text-sm font-bold text-text-muted uppercase tracking-widest px-1">Configuration (BHK)</label>
                         <select className="input-glass w-full appearance-none" value={formData.bhk} onChange={e => setFormData({...formData, bhk: e.target.value})}>
                            <option value="1">1 BHK</option>
                            <option value="2">2 BHK</option>
                            <option value="3">3 BHK</option>
                            <option value="4+">4+ BHK</option>
                         </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-sm font-bold text-text-muted uppercase tracking-widest px-1">Dimensions</label>
                         <input type="text" placeholder="1200 SqFt" className="input-glass w-full" value={formData.dimensions} onChange={e => setFormData({...formData, dimensions: e.target.value})} />
                      </div>
                   </div>
                   <div className="space-y-2">
                    <label className="text-sm font-bold text-text-muted uppercase tracking-widest px-1">Road / Neighborhood Detail</label>
                    <input type="text" placeholder="Main Road access, near station" className="input-glass w-full" value={formData.roadInfo} onChange={e => setFormData({...formData, roadInfo: e.target.value})} />
                   </div>
                   <div className="space-y-2">
                    <label className="text-sm font-bold text-text-muted uppercase tracking-widest px-1">Property Visuals (Images)</label>
                    <div className="border-2 border-dashed border-border-glass rounded-xl p-6 hover:border-primary/50 transition-all flex flex-col items-center gap-4 bg-bg-dark/50">
                       <Upload className="text-text-muted" size={32} />
                       <input type="file" multiple className="hidden" id="imgs" onChange={e => setImages(e.target.files)} />
                       <label htmlFor="imgs" className="cursor-pointer text-sm font-black text-primary hover:underline">UPLOAD PHOTOS</label>
                       {images.length > 0 && <p className="text-xs text-secondary font-bold uppercase tracking-widest animate-bounce">{images.length} Files Selected</p>}
                    </div>
                   </div>
                </div>

                <div className="md:col-span-2 pt-6">
                   <button type="submit" className="btn-primary w-full py-4 text-sm font-black tracking-widest shadow-2xl">SUBMIT LISTING TO MARKETPLACE</button>
                </div>
              </form>
           </motion.div>
        )}
      </AnimatePresence>

      {/* Conditional Rendering of Tabs */}
      <AnimatePresence mode="wait">
        {activeTab === 'listings' ? (
           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {properties.length > 0 ? properties.map(p => (
                   <div key={p._id} className="glass group overflow-hidden border-border-glass hover:border-primary/30 transition-all flex flex-col">
                      <div className="relative h-48 overflow-hidden">
                        <img src={`http://localhost:5000${p.images[0]}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute top-4 right-4 flex items-center gap-2">
                          {p.status === 'open' ? 
                            <span className="bg-green-500/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white">OPEN</span> :
                            <span className="bg-red-500/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white">BOOKED</span>
                          }
                        </div>
                      </div>
                      <div className="p-6 space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-black text-lg group-hover:text-primary transition-colors">{p.name}</h3>
                            <p className="text-xs text-text-muted flex items-center gap-1"><MapPin size={12} /> {p.address}</p>
                          </div>
                          <div className="text-right">
                             <span className="text-xs font-black text-primary bg-primary/10 px-2 py-1 rounded flex items-center gap-1"><Eye size={12} /> {p.views}</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 pb-2 border-b border-border-glass">
                           <div className="text-[10px] font-bold text-text-muted uppercase">BHK: <span className="text-white">{p.bhk}</span></div>
                           <div className="text-[10px] font-bold text-text-muted uppercase">Floor: <span className="text-white">{p.floor}</span></div>
                        </div>

                        <div className="flex gap-2">
                           <button 
                             onClick={() => updatePropStatus(p._id, p.status === 'open' ? 'booked' : 'open')}
                             className={`flex-grow py-3 rounded-xl text-xs font-black tracking-widest uppercase transition-all ${p.status === 'open' ? 'bg-secondary hover:bg-pink-600' : 'bg-green-600 hover:bg-green-700'} shadow-lg`}
                           >
                             {p.status === 'open' ? 'Mark as Booked' : 'Mark as Open'}
                           </button>
                        </div>
                      </div>
                   </div>
                 )) : (
                    <div className="col-span-full py-20 text-center glass border-dashed border-2 opacity-50 flex flex-col items-center gap-4">
                       <Home size={40} className="text-text-muted" />
                       <p className="font-bold text-text-muted tracking-wide uppercase text-sm">You haven't listed any properties yet</p>
                    </div>
                 )}
              </div>
           </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4 max-w-5xl mx-auto">
             {appointments.length > 0 ? (
               <div className="space-y-4">
                 {appointments.map(a => (
                    <div key={a._id} className="glass p-6 border-border-glass flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-primary/40 transition-all">
                       <div className="flex items-center gap-6 flex-grow">
                          <div className="bg-bg-dark w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl border border-primary/20">{a.customerId.name[0]}</div>
                          <div className="space-y-1">
                             <div className="flex items-center gap-2">
                                <h4 className="text-lg font-black group-hover:text-primary transition-colors">{a.customerId.name}</h4>
                                <span className="text-[10px] font-black text-secondary uppercase bg-secondary/10 px-2 py-0.5 rounded border border-secondary/20 tracking-tighter">Customer</span>
                             </div>
                             <p className="text-sm font-bold text-text-muted flex items-center gap-1 opacity-70"><Clock size={14} /> Request for <span className="text-white underline decoration-primary underline-offset-4">{a.propertyId?.name}</span></p>
                             <p className="text-xs text-text-muted italic opacity-40">Sent on {new Date(a.requestedDate).toLocaleString()}</p>
                          </div>
                       </div>

                       <div className="flex flex-col md:flex-row items-center gap-4">
                          {a.status === 'pending' ? (
                            <>
                              <button onClick={() => handleUpdateAppointment(a._id, 'approved')} className="bg-green-500/20 text-green-500 hover:bg-green-500 hover:text-white p-3 rounded-full border border-green-500/20 transition-all" title="Approve"><Check size={20} /></button>
                              <button onClick={() => handleUpdateAppointment(a._id, 'rejected')} className="bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white p-3 rounded-full border border-red-500/20 transition-all" title="Reject"><X size={20} /></button>
                            </>
                          ) : (
                            <div className="flex items-center gap-4">
                              <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${a.status === 'approved' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                                {a.status}
                              </span>
                              {a.status === 'approved' && (
                                <button className="btn-primary p-2.5 rounded-xl hover:scale-110 transition-transform">
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
               <div className="py-20 text-center glass border-dashed border-2 opacity-50 flex flex-col items-center gap-4">
                  <Calendar size={40} className="text-text-muted" />
                  <p className="font-bold text-text-muted tracking-wide uppercase text-sm">No appointment requests at the moment</p>
               </div>
             )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TenantDashboard;
