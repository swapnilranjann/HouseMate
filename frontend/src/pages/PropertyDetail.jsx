import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPropertyById, requestAppointment, incrementPropertyView, getMyAppointments, getChats, favoriteProperty } from '../services/api';
import { MapPin, Bed, Bath, Maximize, Calendar, MessageSquare, Share2, ShieldCheck, User, Clock, Eye, Layout, ChevronLeft, Map as MapIcon, ExternalLink, Building, Lock, X, ChevronRight, Image as ImageIcon, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestStatus, setRequestStatus] = useState('idle');
  const [existingChatId, setExistingChatId] = useState(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  useEffect(() => {
    fetchProperty();
    incrementPropertyView(id);
    if (user) {
        checkExistingStatus();
        setIsFavorited(user.favorites?.includes(id));
    }
  }, [id, user]);

  const fetchProperty = async () => {
    try {
      const { data } = await getPropertyById(id);
      setProperty(data.data); // data is the axios body, which contains { success, data, message }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkExistingStatus = async (forceInquiryResult = null) => {
    try {
        const [aRes, cRes] = await Promise.all([getMyAppointments(), getChats()]);
        const appt = aRes.data.find(a => String(a.propertyId?._id) === String(id));
        
        if (appt) setRequestStatus(appt.status);
        else if (forceInquiryResult) setRequestStatus('pending');

        const chat = cRes.data.find(c => 
            String(c.appointmentId?._id) === String(appt?._id) || 
            String(c.appointmentId?._id || c.appointmentId) === String(appt?._id || forceInquiryResult?._id)
        );
        if (chat) {
            setExistingChatId(chat._id);
            return chat._id;
        }
        return null;
    } catch (err) {
        console.error("Discovery Error:", err);
        return null;
    }
  };

  const handleRequestAppointment = async () => {
    if (!user) return navigate('/customer/login');
    try {
      const res = await requestAppointment(id);
      setRequestStatus('pending');
      toast.success('Inquiry transmitted! Linking secure channel...');
      // Instant sync
      await checkExistingStatus(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Transaction error');
    }
  };

  const handleMessageTap = async () => {
     if (!user) return navigate('/customer/login');
     
     if (requestStatus === 'rejected') {
        return toast.error('This inquiry was denied. Communication is blocked.');
     }

     if (existingChatId) {
        return navigate(`/chats/${existingChatId}`);
     }

     if (requestStatus === 'pending' || requestStatus === 'approved') {
        const tid = toast.loading('Syncing secure frequency...');
        const cid = await checkExistingStatus();
        if (cid) {
           toast.success('Frequency established.', { id: tid });
           navigate(`/chats/${cid}`);
        } else {
           toast.error('Channel routing to general hub.', { id: tid });
           navigate('/chats');
        }
        return;
     }

     toast.error('Submit an inspection request first to open a direct channel.');
  };

  const handleFavorite = async () => {
    if (!user) return navigate('/customer/login');
    setFavoriteLoading(true);
    try {
        const res = await favoriteProperty(id);
        setIsFavorited(res.data.data.isFavorited);
        toast.success(res.data.data.isFavorited ? 'Asset added to favorites.' : 'Asset removed from favorites.');
    } catch (err) {
        toast.error('Favorite sync failure.');
    } finally {
        setFavoriteLoading(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center animate-pulse text-indigo-600 font-serif italic text-xl">Establishing secure link...</div>;
  if (!property) return <div className="text-center p-20 text-slate-400 font-serif">Asset Frequency Lost.</div>;

  const allImages = property.images || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Lightbox / Full Gallery Overlay */}
      <AnimatePresence>
        {showLightbox && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-xl flex flex-col p-10">
                 <div className="flex justify-between items-center mb-10">
                    <div className="text-white">
                        <h2 className="text-3xl font-serif italic font-black uppercase tracking-tighter italic">Portfolio Expansion</h2>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Viewing selection {activeImageIdx + 1} of {allImages.length}</p>
                    </div>
                    <button onClick={() => setShowLightbox(false)} className="p-4 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all">
                        <X size={24} />
                    </button>
                 </div>
                 
                 <div className="flex-1 flex items-center justify-center relative">
                    <button onClick={() => setActiveImageIdx(prev => (prev > 0 ? prev - 1 : allImages.length - 1))} className="absolute left-0 p-6 bg-white/5 text-white rounded-full hover:bg-white/10 transition-all -translate-x-1/2 md:translate-x-0">
                        <ChevronLeft size={32} />
                    </button>
                    
                    <motion.img 
                        key={activeImageIdx}
                        initial={{ opacity: 0, scale: 0.9, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        src={`http://localhost:5000${allImages[activeImageIdx]}`} 
                        className="max-h-[70vh] rounded-[3rem] shadow-2xl object-contain"
                    />

                    <button onClick={() => setActiveImageIdx(prev => (prev < allImages.length - 1 ? prev + 1 : 0))} className="absolute right-0 p-6 bg-white/5 text-white rounded-full hover:bg-white/10 transition-all translate-x-1/2 md:translate-x-0">
                        <ChevronRight size={32} />
                    </button>
                 </div>

                 <div className="mt-10 flex gap-4 overflow-x-auto custom-scrollbar pb-6 px-10">
                    {allImages.map((img, i) => (
                        <button key={i} onClick={() => setActiveImageIdx(i)} className={`w-24 h-24 rounded-2xl overflow-hidden border-4 transition-all shrink-0 ${activeImageIdx === i ? 'border-indigo-500 scale-110' : 'border-white/5'}`}>
                            <img src={`http://localhost:5000${img}`} className="w-full h-full object-cover" alt="Thumb" />
                        </button>
                    ))}
                 </div>
            </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center mb-10">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all font-black text-[10px] uppercase tracking-widest leading-none">
              <ChevronLeft size={16} /> Return to Portfolio
          </button>
          <div className="flex items-center gap-4 text-slate-400 text-[10px] uppercase tracking-widest font-black">
              <button 
                onClick={handleFavorite}
                disabled={favoriteLoading}
                className={`flex items-center gap-1.5 px-4 py-1.5 transition-all rounded-full leading-none border ${isFavorited ? 'bg-rose-50 border-rose-100 text-rose-500' : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-rose-50 hover:text-rose-500'}`}
              >
                  <Heart size={14} fill={isFavorited ? "currentColor" : "none"} className={favoriteLoading ? 'animate-pulse' : ''} /> 
                  {isFavorited ? 'SAVED' : 'FAVORITE'}
              </button>
              <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-100 rounded-full leading-none">
                  <Eye size={12} /> {property.views || 0} Market Views
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-100 rounded-full leading-none">
                  <ImageIcon size={12} /> {allImages.length} Visuals
              </span>
          </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="grow space-y-12">
            
            {/* Interactive Hero Gallery Grid */}
            <div className="grid grid-cols-4 gap-4 h-[600px]">
                <div 
                    onClick={() => { setActiveImageIdx(0); setShowLightbox(true); }}
                    className="col-span-4 md:col-span-3 rounded-[3rem] overflow-hidden relative group shadow-2xl cursor-pointer"
                >
                    <img src={`http://localhost:5000${allImages[0]}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={property.name} />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent p-12">
                         <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-600 text-white rounded-full text-[9px] font-black tracking-widest uppercase mb-4 shadow-xl">Verified Offering</div>
                         <div className="flex justify-between items-start">
                            <h1 className="text-4xl md:text-6xl font-serif italic text-white font-black tracking-tighter italic">{property.name}</h1>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-1">Monthly Asset Fee</p>
                                <p className="text-4xl font-serif text-white font-black tracking-tighter">₹{property.price?.toLocaleString() || 'N/A'}</p>
                            </div>
                         </div>
                         <p className="text-white/70 font-bold text-sm mt-2 flex items-center gap-2"><MapPin size={16} className="text-sky-400" /> {property.address}</p>
                    </div>
                </div>

                <div className="hidden md:flex flex-col gap-4">
                    {allImages.slice(1, 4).map((img, i) => (
                        <div 
                            key={i} 
                            onClick={() => { setActiveImageIdx(i+1); setShowLightbox(true); }}
                            className="flex-1 rounded-[2.5rem] overflow-hidden shadow-xl group cursor-pointer border border-white relative"
                        >
                            <img src={`http://localhost:5000${img}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Spec View" />
                            {i === 2 && allImages.length > 4 && (
                                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center text-white flex-col gap-1 transition-all group-hover:bg-slate-900/80">
                                   <span className="text-2xl font-serif italic font-black">+{allImages.length - 4}</span>
                                   <span className="text-[9px] font-black uppercase tracking-widest">Expansion</span>
                                </div>
                            )}
                        </div>
                    ))}
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
                         <div className={`p-4 rounded-2xl bg-slate-50 mb-4 ${spec.color} shadow-sm`}><spec.icon size={24} /></div>
                         <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">{spec.label}</span>
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
                    Step into a masterpiece of modern architecture. This {property.bhk} BHK {property.type} situated at {property.address} is the epitome of refined living. Boasting a strategic location on the {property.floor} floor, this space has been designed with premium high-end aesthetics and maximum utility in mind.
                </p>
                
                {property.locationLink && (
                    <div className="mt-12 p-8 bg-indigo-50 border border-indigo-100 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h4 className="text-indigo-900 font-serif italic font-black text-xl mb-1 italic">Location Intelligence</h4>
                            <p className="text-indigo-600 text-xs font-bold uppercase tracking-widest">Verify coordinates via Google Maps Protocol</p>
                        </div>
                        <a href={property.locationLink} target="_blank" rel="noreferrer" className="bg-indigo-600 text-white px-8 py-4 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-black transition-all hover:-translate-y-1">OPEN MAPS <ExternalLink size={16} /></a>
                    </div>
                )}
            </div>
        </div>

        {/* Action Sidebar */}
        <div className="w-full lg:w-96 shrink-0">
            <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl p-10 lg:sticky lg:top-24">
                <div className="flex justify-between items-center mb-10">
                   <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Market Status</p>
                       <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${property.status === 'open' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                           {property.status === 'open' ? 'Ready for Possession' : 'Occupied'}
                       </span>
                   </div>
                   <div className="text-right">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Metrics</p>
                       <div className="flex items-center gap-2 text-indigo-600 font-black"><Eye size={16} /> <span className="text-sm">{property.views || 0}</span></div>
                   </div>
                </div>

                <div className="space-y-6">
                    {requestStatus === 'idle' ? (
                        <button onClick={handleRequestAppointment} className="w-full bg-slate-900 hover:bg-black text-white py-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl transition-all hover:-translate-y-1">Request Inspection</button>
                    ) : ( 
                        <div className={`w-full py-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] text-center shadow-inner border flex items-center justify-center gap-3 ${
                            requestStatus === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                            requestStatus === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
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
                                existingChatId && requestStatus !== 'rejected' ? 'bg-indigo-600 text-white border-indigo-500 hover:bg-black' : 'bg-white text-slate-400 border-slate-200 hover:text-slate-900'
                            }`}
                        >
                            <MessageSquare size={18} /> {existingChatId && requestStatus !== 'rejected' ? 'ENTER CHAT' : 'CHANNELS'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
