import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPropertyById, requestAppointment, incrementPropertyView, getMyAppointments, getChats } from '../services/api';
import { MapPin, Bed, Bath, Maximize, Calendar, MessageSquare, Share2, ShieldCheck, User, Clock, Eye, Layout, ChevronLeft, Map as MapIcon, ExternalLink, Building, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestStatus, setRequestStatus] = useState('idle');
  const [existingChatId, setExistingChatId] = useState(null);

  useEffect(() => {
    fetchProperty();
    incrementPropertyView(id);
    if (user) checkExistingStatus();
  }, [id, user]);

  const fetchProperty = async () => {
    try {
      const data = await getPropertyById(id);
      setProperty(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkExistingStatus = async (forceInquiryResult = null) => {
    try {
        const [aRes, cRes] = await Promise.all([getMyAppointments(), getChats()]);
        const appt = aRes.data.find(a => a.propertyId?._id === id);
        
        if (appt) setRequestStatus(appt.status);
        else if (forceInquiryResult) setRequestStatus('pending');

        // Look for chat linked to this property's appointment
        const chat = cRes.data.find(c => c.appointmentId?._id === appt?._id || c.appointmentId === (appt?._id || forceInquiryResult?._id));
        if (chat) setExistingChatId(chat._id);
    } catch (err) {
        console.error("Discovery Error:", err);
    }
  };

  const handleRequestAppointment = async () => {
    if (!user) return navigate('/customer/login');
    try {
      const res = await requestAppointment(id);
      setRequestStatus('pending');
      toast.success('Inquiry transmitted! Instant channel established.');
      // Re-sync status to get the CID immediately
      setTimeout(() => checkExistingStatus(res.data), 500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Transaction error');
    }
  };

  const handleMessageTap = () => {
     if (!user) return navigate('/customer/login');
     if (existingChatId && requestStatus !== 'rejected') {
        navigate(`/chats/${existingChatId}`);
     } else if (requestStatus === 'rejected') {
        toast.error('This inquiry was denied. Communication is blocked.');
     } else if (requestStatus === 'pending') {
        // If we have an inquiry but no chat ID synced yet, try to find it
        checkExistingStatus();
        toast('Establishing secure frequency... try again in a moment.', { icon: '📡' });
     } else {
        toast.error('Submit an inspection request first to open a direct channel.');
     }
  };

  if (loading) return <div className="h-screen flex items-center justify-center animate-pulse text-indigo-600 font-serif italic text-xl">Establishing secure link...</div>;
  if (!property) return <div className="text-center p-20 text-slate-400 font-serif">Asset Frequency Lost.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Navigation & Status Header */}
      <div className="flex justify-between items-center mb-10">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all font-black text-[10px] uppercase tracking-widest leading-none">
              <ChevronLeft size={16} /> Return to Portfolio
          </button>
          <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-400 leading-none">
                  <Eye size={12} /> {property.views || 0} Market Views
              </span>
          </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* Gallery & Description Column */}
        <div className="grow space-y-12">
            
            {/* Hero Gallery */}
            <div className="grid grid-cols-4 gap-4 h-[500px]">
                <div className="col-span-4 md:col-span-3 rounded-[3rem] overflow-hidden relative group shadow-2xl">
                    <img src={property.images?.[0] ? `http://localhost:5000${property.images[0]}` : ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={property.name} />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent p-12">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-600 text-white rounded-full text-[9px] font-black tracking-widest uppercase mb-4 shadow-xl">
                            Verified Offering
                        </div>
                        <h1 className="text-4xl md:text-6xl font-serif italic text-white font-black tracking-tighter italic">{property.name}</h1>
                        <p className="text-white/70 font-bold text-sm mt-2 flex items-center gap-2"><MapPin size={16} className="text-sky-400" /> {property.address}</p>
                    </div>
                </div>
                <div className="hidden md:flex flex-col gap-4">
                    {property.images?.slice(1, 3).map((img, i) => (
                        <div key={i} className="flex-1 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl group cursor-pointer">
                            <img src={`http://localhost:5000${img}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Spec View" />
                        </div>
                    ))}
                    {property.images?.length > 3 && (
                        <div className="flex-1 rounded-[2.5rem] bg-slate-900 flex items-center justify-center text-white border-4 border-white shadow-xl cursor-pointer hover:bg-black transition-all">
                            <span className="text-[10px] font-black tracking-widest">+{property.images.length - 3} MORE</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Spec Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                    { label: 'Type', value: property.type, icon: Layout, color: 'text-indigo-600' },
                    { label: 'Configuration', value: property.bhk + ' BHK', icon: Bed, color: 'text-sky-500' },
                    { label: 'Floor Level', value: property.floor, icon: Building, color: 'text-rose-500' },
                    { label: 'Area Details', value: (property.dimensions || '800') + ' SqFt', icon: MapIcon, color: 'text-emerald-500' }
                ].map((spec, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center text-center group hover:border-indigo-100 transition-all">
                         <div className={`p-4 rounded-2xl bg-slate-50 mb-4 ${spec.color} group-hover:scale-110 transition-transform shadow-sm`}>
                             <spec.icon size={24} />
                         </div>
                         <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1 leading-none">{spec.label}</span>
                         <span className="text-lg font-black text-slate-900">{spec.value}</span>
                    </div>
                ))}
            </div>

            {/* Description Area */}
            <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-[0.02] -rotate-12 translate-x-10 translate-y-10">
                    <Layout size={200} />
                </div>
                <div className="flex items-center gap-3 mb-8">
                   <div className="h-10 w-1.5 bg-indigo-600 rounded-full"></div>
                   <h2 className="text-4xl font-serif italic text-slate-900 font-black italic">Property Description</h2>
                </div>
                <p className="text-slate-500 text-lg leading-relaxed font-normal">
                    Step into a masterpiece of modern architecture. This {property.bhk} BHK {property.type} situated at {property.address} is the epitome of refined living. Boasting a strategic location on the {property.floor} floor, this space has been designed with premium high-end aesthetics and maximum utility in mind. Perfect for those seeking a high-trust, verified real estate experience.
                </p>
                
                {/* Location Map Shortcut */}
                {property.locationLink && (
                    <div className="mt-12 p-8 bg-indigo-50 border border-indigo-100 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h4 className="text-indigo-900 font-serif italic font-black text-xl mb-1 italic">Exact Location Intelligence</h4>
                            <p className="text-indigo-600 text-xs font-bold uppercase tracking-widest">Verify the coordinates on Google Maps</p>
                        </div>
                        <a 
                            href={property.locationLink} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="bg-indigo-600 text-white px-8 py-4 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-black transition-all hover:-translate-y-1"
                        >
                            Open Maps Protocol <ExternalLink size={16} />
                        </a>
                    </div>
                )}

                {/* Owner Information */}
                <div className="mt-16 pt-16 border-t border-slate-100 flex items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white font-black text-2xl shadow-xl">
                            {property.listerId?.name?.[0] || 'O'}
                        </div>
                        <div>
                            <h4 className="text-xl font-serif italic font-black text-slate-900 italic">Verified Owner</h4>
                            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1.5">
                                <ShieldCheck size={14} /> ID: HM_V_{property.listerId?._id?.slice(-5).toUpperCase() || 'E48243'}
                            </p>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-3 px-6 py-2 bg-emerald-50 border border-emerald-100 rounded-full">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Ownership Verified</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Action Sidebar */}
        <div className="w-full lg:w-96 shrink-0">
            <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl p-10 lg:sticky lg:top-24">
                
                <div className="flex justify-between items-center mb-10">
                   <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Market Status</p>
                       <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest leading-none ${property.status === 'open' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                           {property.status === 'open' ? 'Immediate Availability' : 'Listing Booked'}
                       </span>
                   </div>
                   <div className="text-right">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Metrics</p>
                       <div className="flex items-center gap-2 text-indigo-600 font-black">
                          <Eye size={16} /> <span className="text-sm">{property.views || 0}</span>
                       </div>
                   </div>
                </div>

                <div className="space-y-6">
                    {requestStatus === 'idle' ? (
                        <button onClick={handleRequestAppointment} className="w-full bg-slate-900 hover:bg-black text-white py-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl transition-all hover:-translate-y-1 active:scale-95">
                            Request Inspection
                        </button>
                    ) : ( 
                        <div className={`w-full py-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] text-center shadow-inner border flex items-center justify-center gap-3 ${
                            requestStatus === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                            requestStatus === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                            'bg-rose-50 text-rose-600 border-rose-100'
                        }`}>
                            {requestStatus === 'pending' && <><Clock size={16}/> INQUIRY SENT</>}
                            {requestStatus === 'approved' && <><ShieldCheck size={16}/> VISIT SECURED</>}
                            {requestStatus === 'rejected' && <><Lock size={16}/> REQUEST DENIED</>}
                        </div>
                    )}
                    
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={handleMessageTap}
                            className={`p-4 rounded-xl shadow-sm transition-all border flex-1 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest min-h-[56px] ${
                                existingChatId && requestStatus !== 'rejected' 
                                ? 'bg-indigo-600 text-white border-indigo-500 hover:bg-black' 
                                : 'bg-white text-slate-400 border-slate-200 hover:text-slate-900'
                            }`}
                        >
                            <MessageSquare size={18} /> {existingChatId && requestStatus !== 'rejected' ? 'OPEN CHAT' : 'CHANNELS'}
                        </button>
                        <button className="p-4 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-slate-900 transition-all shadow-sm">
                             <Share2 size={18} />
                        </button>
                    </div>
                </div>

                {/* Security Badge */}
                <div className="mt-12 p-8 bg-indigo-600 rounded-[2.5rem] text-white overflow-hidden relative shadow-2xl">
                    <div className="relative z-10">
                        <h4 className="font-serif italic text-xl font-black italic mb-2">100% Secured</h4>
                        <p className="text-indigo-100 text-[11px] font-medium leading-relaxed">Verified by HouseMate Intelligence. Inquiries are shared only with the verified owner.</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
