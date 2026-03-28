import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProperties, incrementPropertyView, favoriteProperty, requestAppointment } from '../services/api';
import { Heart, MapPin, Home as HomeIcon, Eye, Calendar, User, LayoutGrid, ShieldCheck, Share2, MessageSquare, ChevronLeft, Navigation, Briefcase, ShoppingBag, Building, CheckCircle, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const PropertyDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestStatus, setRequestStatus] = useState('');
  const [mainImage, setMainImage] = useState(0);

  useEffect(() => {
    fetchProperty();
    incrementView();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const { data } = await getProperties();
      const selected = data.find(p => p._id === id);
      setProperty(selected);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const incrementView = async () => {
    try {
      if (id) await incrementPropertyView(id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFavorite = async () => {
    if (!user) return navigate('/customer/login');
    try {
      await favoriteProperty(id);
      toast.success('Successfully added to favorites!');
    } catch (err) {
      toast.error('Failed to add to favorites');
    }
  };

  const handleRequestAppointment = async () => {
    if (!user) return navigate('/customer/login');
    try {
      await requestAppointment(id);
      setRequestStatus('sent');
      toast.success('Interest sent! The owner will contact you.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error requesting appointment');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-pulse">
            <div className="p-4 bg-white rounded-2xl shadow-xl border border-slate-100">
                <HomeIcon className="text-indigo-600 w-12 h-12" />
            </div>
            <p className="text-lg font-black text-slate-800 tracking-widest uppercase text-xs">Fetching Premium Asset...</p>
        </div>
    </div>
  );

  if (!property) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center bg-white p-12 rounded-[3rem] shadow-xl border border-slate-200">
            <div className="bg-rose-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500">
                <Info size={40} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Property Not Found</h2>
            <p className="text-slate-500 mt-2 font-medium">This listing might have been removed or is no longer available.</p>
            <Link to="/" className="mt-8 inline-block bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all">Back to Home</Link>
        </div>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Visual Block - Hero Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[500px] md:h-[600px]">
            {/* Main Feature Image */}
            <div className="lg:col-span-3 relative rounded-[2.5rem] overflow-hidden shadow-2xl group border-4 border-white">
                <img 
                    src={`http://localhost:5000${property.images?.[mainImage] || '/placeholder.jpg'}`} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    alt={property.name}
                />
                <div className="absolute inset-x-0 bottom-0 p-8 md:p-12 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <span className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block shadow-lg">
                                Verified Offering
                            </span>
                            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight mb-2 drop-shadow-2xl">
                                {property.name}
                            </h1>
                            <p className="flex items-center gap-2 text-white/80 font-bold text-lg">
                                <MapPin className="text-indigo-400" size={24} /> {property.address}
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={handleFavorite} className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-rose-500 transition-all shadow-xl group/fav">
                                <Heart size={24} className={user?.favorites?.includes(id) ? 'fill-rose-500 text-rose-500' : ''} />
                            </button>
                            <button className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-indigo-600 transition-all shadow-xl">
                                <Share2 size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Thumbnail Sidebar */}
            <div className="hidden lg:flex flex-col gap-4">
                {property.images?.map((img, idx) => (
                    <button 
                        key={idx}
                        onClick={() => setMainImage(idx)}
                        className={`grow rounded-[1.5rem] overflow-hidden border-4 transition-all duration-300 transform hover:scale-[1.02] ${mainImage === idx ? 'border-indigo-600 shadow-xl' : 'border-white opacity-60 hover:opacity-100'}`}
                    >
                        <img src={`http://localhost:5000${img}`} className="w-full h-full object-cover" alt="Property View" />
                    </button>
                ))}
            </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            
            {/* Left Content Column */}
            <div className="lg:col-span-2 space-y-12">
                
                {/* Specs Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col items-center text-center group hover:border-indigo-200 transition-all">
                        <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
                            <HomeIcon size={24} />
                        </div>
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Type</p>
                        <p className="text-xl font-black text-slate-900">{property.type || 'House'}</p>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col items-center text-center group hover:border-sky-200 transition-all">
                        <div className="bg-sky-50 p-4 rounded-2xl text-sky-600 mb-4 group-hover:scale-110 transition-transform">
                            <LayoutGrid size={24} />
                        </div>
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Configuration</p>
                        <p className="text-xl font-black text-slate-900">{property.bhk} BHK</p>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col items-center text-center group hover:border-emerald-200 transition-all">
                        <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
                            <Building size={24} />
                        </div>
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Floor</p>
                        <p className="text-xl font-black text-slate-900">{property.floor}</p>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col items-center text-center group hover:border-rose-200 transition-all">
                        <div className="bg-rose-50 p-4 rounded-2xl text-rose-600 mb-4 group-hover:scale-110 transition-transform">
                            <Navigation size={24} />
                        </div>
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Area Details</p>
                        <p className="text-xl font-black text-slate-900">{property.dimensions || 'N/A'}</p>
                    </div>
                </div>

                {/* Description & Details */}
                <div className="bg-white rounded-[3rem] p-10 md:p-14 border border-slate-200 shadow-sm space-y-8">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                           <div className="h-8 w-1.5 bg-indigo-600 rounded-full"></div>
                           Property Description
                        </h2>
                        <p className="text-slate-500 mt-6 text-lg leading-relaxed font-medium">
                            Step into a masterpiece of modern architecture. This {property.bhk} BHK {property.type || 'residence'} situated at {property.address} is the epitome of refined living. 
                            Boasting a strategic location on the {property.floor} floor, this space has been designed with premium high-end aesthetics and maximum utility in mind. 
                            Perfect for those seeking a high-trust, verified real estate experience.
                        </p>
                    </div>

                    <div className="pt-10 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-[1.5rem] bg-slate-900 flex items-center justify-center font-black text-2xl text-white shadow-xl">
                                {property.listerId?.name?.[0]}
                            </div>
                            <div>
                                <h4 className="text-xl font-black text-slate-900 tracking-tight">Verified Owner</h4>
                                <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                                    <ShieldCheck size={14} /> ID: hm_v_{property.listerId?._id?.slice(-6)}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center justify-end">
                            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                                <CheckCircle className="text-emerald-500" size={18} />
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ownership Verified</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar Command Center */}
            <aside className="lg:col-span-1 space-y-6 lg:sticky lg:top-32">
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
                        <Calendar size={120} />
                    </div>

                    <div className="flex justify-between items-center mb-8 relative z-10">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Market Status</p>
                            <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors ${property.status === 'open' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                {property.status === 'open' ? 'Immediate Availability' : 'Listing Secured'}
                            </span>
                        </div>
                        <div className="text-right space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Metrics</p>
                            <div className="flex items-center gap-2 font-black text-slate-900">
                                <Eye className="text-indigo-500" size={18} /> {property.views}
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-slate-100 my-8"></div>

                    <div className="space-y-4 relative z-10">
                        {user?.role === 'customer' ? (
                            <button 
                                onClick={handleRequestAppointment}
                                disabled={requestStatus === 'sent' || property.status === 'booked'}
                                className={`w-full py-5 rounded-2xl flex items-center justify-center gap-3 font-black text-sm uppercase tracking-[0.2em] shadow-2xl transition-all ${requestStatus === 'sent' || property.status === 'booked' ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-black hover:-translate-y-1 active:scale-95 shadow-indigo-500/10'}`}
                            >
                                {requestStatus === 'sent' ? 'REQUEST SENT' : property.status === 'booked' ? 'PROPERTY RESERVED' : 'SCHEDULE A VISIT'}
                                {requestStatus !== 'sent' && property.status !== 'booked' && <Calendar size={18} />}
                            </button>
                        ) : user?.role === 'tenant' ? (
                            <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 text-center">
                                <ShieldCheck className="text-indigo-600 w-10 h-10 mx-auto mb-3" />
                                <h4 className="text-indigo-900 font-black text-sm uppercase tracking-widest mb-1">Administrative View</h4>
                                <p className="text-indigo-600 text-[10px] font-bold">You are the owner of this listling. Manage it from your dashboard.</p>
                                <Link to="/tenant-dashboard" className="mt-4 inline-block text-xs font-black text-indigo-600 hover:underline">Go to Dashboard</Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <button onClick={() => navigate('/customer/login')} className="w-full py-5 bg-slate-100 border border-slate-200 text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white transition-all">
                                    SIGN IN TO BOOK
                                </button>
                                <p className="text-[10px] text-center text-slate-400 font-bold uppercase">Booking requires a verified profile</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 flex items-center justify-center gap-6 relative z-10">
                        <button className="text-slate-400 hover:text-indigo-600 transition-colors p-2"><MessageSquare size={20}/></button>
                        <div className="h-4 w-px bg-slate-200"></div>
                        <button className="text-slate-400 hover:text-indigo-600 transition-colors p-2 font-black text-[10px] uppercase tracking-widest">Share Listing</button>
                    </div>
                </div>
                
                {/* Security Badge */}
                <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
                    <ShieldCheck className="absolute -bottom-4 -right-4 w-24 h-24 opacity-20" />
                    <h5 className="font-black text-sm uppercase tracking-widest mb-2 relative z-10">100% Secured</h5>
                    <p className="text-xs text-indigo-100 font-medium leading-relaxed relative z-10">This property was verified by HouseMate Intelligence. Booking requests are encrypted and shared only with the verified owner.</p>
                </div>
            </aside>

        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
