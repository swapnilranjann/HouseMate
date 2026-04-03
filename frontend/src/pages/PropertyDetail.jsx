import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPropertyById, requestAppointment, incrementPropertyView, getMyAppointments, getChats, favoriteProperty } from '../services/api';
import { MapPin, Bed, Bath, Maximize, Calendar, MessageSquare, Share2, ShieldCheck, User, Clock, Eye, Layout, ChevronLeft, Map as MapIcon, ExternalLink, Building, Lock, X, ChevronRight, Image as ImageIcon, Heart, Home } from 'lucide-react';
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
      setProperty(data.data); 
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
      toast.success('Inquiry submitted successfully.');
      await checkExistingStatus(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission error');
    }
  };

  const handleMessageTap = async () => {
     if (!user) return navigate('/customer/login');
     
     if (requestStatus === 'rejected') {
        return toast.error('This inquiry was denied.');
     }

     if (existingChatId) {
        return navigate(`/chats/${existingChatId}`);
     }

     if (requestStatus === 'pending' || requestStatus === 'approved') {
        const tid = toast.loading('Opening chat...');
        const cid = await checkExistingStatus();
        if (cid) {
           toast.success('Connected.', { id: tid });
           navigate(`/chats/${cid}`);
        } else {
           toast.error('Channel routing to general hub.', { id: tid });
           navigate('/chats');
        }
        return;
     }

     toast.error('Submit an inquiry first to message the owner.');
  };

  const handleFavorite = async () => {
    if (!user) return navigate('/customer/login');
    setFavoriteLoading(true);
    try {
        const res = await favoriteProperty(id);
        setIsFavorited(res.data.data.isFavorited);
        toast.success(res.data.data.isFavorited ? 'Property added to favorites.' : 'Property removed from favorites.');
    } catch (err) {
        toast.error('Favorite sync failure.');
    } finally {
        setFavoriteLoading(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-[#C2410C] font-bold text-lg">Loading property...</div>;
  if (!property) return <div className="text-center p-20 text-gray-400">Property not found.</div>;

  const allImages = property.images || [];

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Back navigation */}
        <div className="mb-6 flex items-center justify-between">
            <button onClick={() => navigate(-1)} className="text-[#C2410C] hover:underline flex items-center gap-1 font-bold text-xs uppercase tracking-widest">
                <ChevronLeft size={16} /> Back to Listings
            </button>
            <div className="flex gap-4">
                <button 
                    onClick={handleFavorite} 
                    disabled={favoriteLoading}
                    className={`flex items-center gap-2 px-4 py-2 rounded border text-[10px] font-bold uppercase tracking-widest transition-colors ${
                        isFavorited ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    <Heart size={14} fill={isFavorited ? "currentColor" : "none"} />
                    {isFavorited ? 'Saved' : 'Save Property'}
                </button>
            </div>
        </div>

        {/* Main Header */}
        <div className="bg-white p-6 rounded border border-gray-200 shadow-sm mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2 uppercase tracking-tight">{property.name}</h1>
                    <p className="text-gray-500 flex items-center gap-2 text-xs font-medium">
                        <MapPin size={16} className="text-[#C2410C]" /> {property.address}
                    </p>
                </div>
                <div className="bg-[#FFF7ED] p-4 rounded border border-[#FFEDD5] text-right min-w-[200px]">
                    <p className="text-[10px] font-bold text-[#C2410C] uppercase tracking-widest mb-1">Monthly Rent</p>
                    <p className="text-2xl font-bold text-gray-900">₹{property.price?.toLocaleString() || 'N/A'}</p>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Photos and Details */}
            <div className="lg:col-span-2 space-y-8">
                {/* Simple Gallery */}
                <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
                    <div className="h-[400px] md:h-[500px] overflow-hidden bg-gray-50 flex items-center justify-center">
                        <img src={`http://localhost:5000${allImages[activeImageIdx]}`} className="max-w-full max-h-full object-contain" alt="Property main" />
                    </div>
                    {allImages.length > 1 && (
                        <div className="p-4 flex gap-2 overflow-x-auto border-t border-gray-100">
                            {allImages.map((img, i) => (
                                <button key={i} onClick={() => setActiveImageIdx(i)} className={`w-20 h-20 rounded border-2 transition-all shrink-0 overflow-hidden ${activeImageIdx === i ? 'border-[#C2410C]' : 'border-gray-100'}`}>
                                    <img src={`http://localhost:5000${img}`} className="w-full h-full object-cover" alt="Thumb" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Key Specs */}
                <div className="bg-white p-6 rounded border border-gray-200 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="flex flex-col items-center text-center">
                        <Home size={20} className="text-[#C2410C] mb-2" />
                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Type</span>
                        <span className="text-sm font-bold text-gray-800 uppercase">{property.type}</span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <Bed size={20} className="text-[#C2410C] mb-2" />
                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Conf.</span>
                        <span className="text-sm font-bold text-gray-800">{property.bhk} BHK</span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <Building size={20} className="text-[#C2410C] mb-2" />
                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Floor</span>
                        <span className="text-sm font-bold text-gray-800 uppercase">{property.floor}</span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <Maximize size={20} className="text-[#C2410C] mb-2" />
                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Area</span>
                        <span className="text-sm font-bold text-gray-800">{property.dimensions || '800'} SqFt</span>
                    </div>
                </div>

                {/* Description */}
                <div className="bg-white p-8 rounded border border-gray-200 shadow-sm">
                    <h2 className="text-sm font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4 uppercase tracking-widest">Description</h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        This {property.bhk} BHK {property.type} is located in {property.address}. 
                        Situated on the {property.floor} floor, it offers excellent ventilation and a professional layout. 
                        Suitable for tenants looking for a well-maintained property.
                    </p>
                    
                    {property.locationLink && (
                        <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
                            <span className="text-gray-500 text-xs font-bold uppercase tracking-tight">Location Verification:</span>
                            <a href={property.locationLink} target="_blank" rel="noreferrer" className="bg-gray-900 hover:bg-black text-white px-6 py-2 rounded font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 transition-colors">
                                <ExternalLink size={14} /> View Map
                            </a>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Column: Actions */}
            <div className="space-y-6">
                <div className="bg-white p-6 rounded border border-gray-200 shadow-sm sticky top-24">
                    <div className="mb-6 space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                            <span className="text-gray-400">Availability:</span>
                            <span className={property.status === 'open' ? 'text-emerald-600' : 'text-red-600'}>
                                {property.status === 'open' ? 'Active' : 'Closed'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                            <span className="text-gray-400">Asset Views:</span>
                            <span className="text-gray-900">{property.views || 0}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {requestStatus === 'idle' ? (
                            <button onClick={handleRequestAppointment} className="w-full bg-[#C2410C] hover:bg-[#9A3412] text-white py-3 rounded font-bold text-xs uppercase tracking-widest transition-all">
                                Request Visit
                            </button>
                        ) : ( 
                            <div className={`w-full py-3 rounded font-bold text-[10px] uppercase tracking-widest text-center border ${
                                requestStatus === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                requestStatus === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
                            }`}>
                                {requestStatus}
                            </div>
                        )}
                        
                        <button 
                            onClick={handleMessageTap}
                            className={`w-full py-3 rounded font-bold text-xs uppercase tracking-widest border transition-all flex items-center justify-center gap-2 ${
                                existingChatId && requestStatus !== 'rejected' ? 'bg-gray-900 text-white border-gray-900 hover:bg-black' : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            <MessageSquare size={16} /> 
                            {existingChatId && requestStatus !== 'rejected' ? 'Open Chat' : 'Message Owner'}
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
