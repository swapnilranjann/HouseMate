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
    name: '', number: '', address: '', floor: '', bhk: '1', dimensions: '', roadInfo: '', type: 'House', locationLink: '', price: ''
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
      
      // Standardised response util returns { success, data, message }
      setProperties(pRes.data.data.filter(p => p.listerId._id === user.id));
      setAppointments(aRes.data.data);
      setChats(cRes.data.data);
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
      setFormData({ name: '', number: '', address: '', floor: '', bhk: '1', dimensions: '', roadInfo: '', type: 'House', locationLink: '', price: '' });
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
    <div className="max-w-6xl mx-auto py-6">
      
      <DashboardHeader 
        title={`Welcome back, ${JSON.parse(localStorage.getItem('house_user'))?.name}`}
        subtitle={`You have ${appointments.filter(a => a.status === 'pending').length} new visit requests.`}
        icon={ShieldCheck}
        roleLabel="Owner"
        stats={[
          { label: "Listed Properties", value: properties.length },
          { label: "Pending Requests", value: appointments.filter(a => a.status === 'pending').length, highlight: true }
        ]}
      />

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex border-b border-gray-200 w-full md:w-auto">
              {['My Listings', 'Visit Requests'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2 ${activeTab === tab ? 'text-primary' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                    style={{ 
                        color: activeTab === tab ? 'var(--primary)' : undefined, 
                        borderColor: activeTab === tab ? 'var(--primary)' : 'transparent' 
                    }}
                  >
                      {tab}
                  </button>
              ))}
          </div>

          <button 
            onClick={() => setShowForm(!showForm)}
            className="btn-primary w-full md:w-auto justify-center uppercase text-[10px] tracking-[0.1em] px-8"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            {showForm ? <><X size={16} /> Cancel Operation</> : <><Plus size={16} /> Initialize Asset</>}
          </button>
      </div>

      <AnimatePresence>
        {showForm && (
            <div className="mb-12 bg-white border border-gray-200 rounded p-8 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4 uppercase">Property Details</h2>
                <form onSubmit={handleCreateProperty} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     <div className="space-y-4">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase">Property Name</label>
                        <input type="text" placeholder="e.g. Skyline Villa" required className="w-full px-4 py-2 border border-gray-300 rounded focus:border-primary outline-none text-sm transition-colors" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                        
                        <label className="block text-[10px] font-bold text-gray-400 uppercase">Monthly Price (₹)</label>
                        <input type="number" placeholder="Price" required className="w-full px-4 py-2 border border-gray-300 rounded focus:border-primary outline-none text-sm transition-colors" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                        
                        <label className="block text-[10px] font-bold text-gray-400 uppercase">Property Type</label>
                        <select className="w-full px-4 py-2 border border-gray-300 rounded focus:border-primary outline-none text-sm transition-colors" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                            {['House', 'Flat', 'Villa', 'Office', 'Shop'].map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                     </div>
                     
                     <div className="space-y-4">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase">Address & Location</label>
                        <input type="text" placeholder="Full Address" required className="w-full px-4 py-2 border border-gray-300 rounded focus:border-primary outline-none text-sm transition-colors" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                        <input type="url" placeholder="Google Maps Link" required className="w-full px-4 py-2 border border-gray-300 rounded focus:border-primary outline-none text-sm transition-colors" value={formData.locationLink} onChange={e => setFormData({...formData, locationLink: e.target.value})} />
                        
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Floor</label>
                                <input type="text" placeholder="Floor" className="w-full px-4 py-2 border border-gray-300 rounded focus:border-primary outline-none text-sm transition-colors" value={formData.floor} onChange={e => setFormData({...formData, floor: e.target.value})} />
                            </div>
                            <div className="flex-1">
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Configuration</label>
                                <select className="w-full px-4 py-2 border border-gray-300 rounded focus:border-primary outline-none text-sm transition-colors" value={formData.bhk} onChange={e => setFormData({...formData, bhk: e.target.value})}>
                                    <option value="1">1 BHK</option>
                                    <option value="2">2 BHK</option>
                                    <option value="3">3 BHK</option>
                                    <option value="4+">4+ BHK</option>
                                </select>
                            </div>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase">Photos & Images</label>
                        <div className="border border-dashed border-gray-300 rounded p-6 bg-gray-50 flex flex-col items-center">
                            <input type="file" multiple className="hidden" id="dash-imgs-pro" onChange={e => setImages(e.target.files)} />
                            <label htmlFor="dash-imgs-pro" className="cursor-pointer text-xs font-bold text-gray-500 flex items-center gap-2">
                                <Upload size={16} /> Click to Upload Photos
                            </label>
                            {images.length > 0 && <span className="mt-2 text-[10px] font-bold" style={{ color: 'var(--primary)' }}>{images.length} files selected</span>}
                        </div>
                        
                        <button type="submit" className="btn-primary w-full justify-center h-12 mt-4">
                            Publish Listing
                        </button>
                     </div>
                </form>
            </div>
        )}
      </AnimatePresence>

      <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
        {activeTab === 'My Listings' && (
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#FCFDFF] border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Property</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Type</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Price</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Views</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {properties.map(p => (
                            <tr key={p._id} className="table-row-classic">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded bg-gray-100 overflow-hidden shrink-0 border border-gray-100">
                                            <img src={`http://localhost:5000${p.images[0]}`} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900 text-sm line-clamp-1">{p.name}</div>
                                            <div className="text-[10px] text-gray-400 flex items-center gap-1"><MapPin size={10} /> {p.address}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="text-[10px] font-bold bg-gray-50 border border-gray-200 px-2 py-0.5 rounded text-gray-500 uppercase">{p.type}</span>
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-gray-700 text-sm">
                                    ₹{p.price?.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button 
                                        onClick={() => updatePropertyStatus(p._id, p.status === 'open' ? 'booked' : 'open')}
                                        className={`text-[9px] font-bold uppercase px-3 py-1 rounded border shadow-sm transition-all ${
                                            p.status === 'open' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                                        }`}
                                    >
                                        {p.status}
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-gray-500">
                                        <Eye size={12} className="text-gray-300" /> {p.views}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex gap-2 justify-end">
                                        <button 
                                            onClick={() => navigate(`/property/${p._id}`)} 
                                            style={{ color: 'var(--primary)' }}
                                            className="p-2 border border-gray-100 hover:bg-gray-50 rounded transition-all"
                                        >
                                            <ArrowUpRight size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {properties.length === 0 && (
                    <div className="py-20 text-center text-gray-400 font-bold text-[10px] uppercase tracking-widest">No assets registered.</div>
                )}
            </div>
        )}

        {activeTab === 'Visit Requests' && (
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#FCFDFF] border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Requester Identity</th>
                            <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Target Asset</th>
                            <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Inquiry Timestamp</th>
                            <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Status</th>
                            <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Operational Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map(a => (
                            <tr key={a._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-all">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-gray-900 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                                            {a.customerId?.name?.[0]}
                                        </div>
                                        <div className="font-black text-gray-800 text-[10px] uppercase tracking-wider">{a.customerId?.name}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-[10px] font-black text-gray-600 uppercase tracking-tight">{a.propertyId?.name}</td>
                                <td className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">{new Date(a.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`text-[9px] font-black uppercase px-3 py-1 rounded leading-none border shadow-xs ${
                                        a.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-200' : 
                                        a.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'
                                    }`}>
                                        {a.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex gap-2 justify-end">
                                        {a.status === 'pending' ? (
                                            <>
                                                <button 
                                                    onClick={() => handleUpdateAppointment(a._id, 'approved')} 
                                                    style={{ color: 'var(--primary)' }}
                                                    className="p-2 border border-gray-100 hover:bg-gray-50 rounded transition-all"
                                                >
                                                    <Check size={14} />
                                                </button>
                                                <button onClick={() => handleUpdateAppointment(a._id, 'rejected')} className="text-red-500 p-2 border border-gray-100 hover:bg-red-50 rounded transition-all">
                                                    <X size={14} />
                                                </button>
                                            </>
                                        ) : (
                                            findChatForAppointment(a._id) ? (
                                                <Link 
                                                    to={`/chats/${findChatForAppointment(a._id)._id}`} 
                                                    style={{ color: 'var(--primary)' }}
                                                    className="px-4 py-1.5 border border-gray-100 rounded transition-all flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest hover:bg-gray-50"
                                                >
                                                    <MessageSquare size={12} /> Sync Comms
                                                </Link>
                                            ) : (
                                                <span className="text-[8px] text-gray-300 font-black uppercase tracking-[0.2em] px-2 py-1">ARCHIVED</span>
                                            )
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {appointments.length === 0 && (
                    <div className="py-20 text-center text-gray-400 font-medium">No visit requests found.</div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default TenantDashboard;
