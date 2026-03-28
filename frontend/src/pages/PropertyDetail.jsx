import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProperties, incrementPropertyView, favoriteProperty, requestAppointment } from '../services/api';
import { Heart, MapPin, Home as HomeIcon, Eye, Calendar, User, LayoutGrid, ShieldCheck, Share2, MessageSquare, ChevronLeft, ChevronRight, Navigation } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

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
      alert('Added to favorites!');
    } catch (err) {
      alert('Error adding to favorites');
    }
  };

  const handleRequestAppointment = async () => {
    if (!user) return navigate('/customer/login');
    try {
      await requestAppointment(id);
      setRequestStatus('sent');
      alert('Appointment request sent successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error requesting appointment');
    }
  };

  if (loading) return <div className="py-20 text-center font-bold text-primary animate-pulse">Loading property details...</div>;
  if (!property) return <div className="py-20 text-center text-text-muted">Property not found.</div>;

  return (
    <div className="space-y-12 pb-24">
      {/* Visual Header */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-2 relative group overflow-hidden rounded-3xl"
        >
          <img 
            src={`http://localhost:5000${property.images?.[mainImage] || '/placeholder.jpg'}`} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            alt={property.name}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/80 via-transparent to-transparent"></div>
          <div className="absolute bottom-8 left-8 space-y-2">
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight drop-shadow-lg">{property.name}</h1>
            <p className="flex items-center gap-2 text-white/90 font-medium font-bold">
               <MapPin className="text-secondary shrink-0" size={20} /> {property.address}
            </p>
          </div>
        </motion.div>

        <div className="flex flex-col gap-4">
          {property.images?.map((img, idx) => (
             <motion.div 
               key={idx}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.1 }}
               className={`h-1/4 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${mainImage === idx ? 'border-primary' : 'border-transparent'}`}
               onClick={() => setMainImage(idx)}
             >
               <img src={`http://localhost:5000${img}`} className="w-full h-full object-cover hover:opacity-80" alt={`Thumbnail ${idx}`} />
             </motion.div>
          ))}
          {!property.images[1] && [1,2,3].map(i => (
             <div key={i} className="h-1/4 bg-bg-card rounded-2xl border border-border-glass/50 flex items-center justify-center">
               <Share2 size={24} className="opacity-10" />
             </div>
          ))}
        </div>
      </section>

      {/* Main Content Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="glass p-6 text-center space-y-2 group hover:bg-primary/5 transition-all">
               <div className="bg-primary/20 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto transition-transform group-hover:scale-110"><HomeIcon className="text-primary" size={24} /></div>
               <p className="text-[10px] uppercase tracking-widest font-black text-text-muted">Type</p>
               <p className="font-bold text-xl">{property.bhk} BHK</p>
            </div>
            <div className="glass p-6 text-center space-y-2 group hover:bg-secondary/5 transition-all">
               <div className="bg-secondary/20 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto transition-transform group-hover:scale-110"><LayoutGrid className="text-secondary" size={24} /></div>
               <p className="text-[10px] uppercase tracking-widest font-black text-text-muted">Floor</p>
               <p className="font-bold text-xl">{property.floor}</p>
            </div>
            <div className="glass p-6 text-center space-y-2">
               <div className="bg-primary/20 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto transition-transform group-hover:scale-110"><Share2 className="text-primary" size={24} /></div>
               <p className="text-[10px] uppercase tracking-widest font-black text-text-muted">Area</p>
               <p className="font-bold text-xl">{property.dimensions || 'N/A'}</p>
            </div>
            <div className="glass p-6 text-center space-y-2">
               <div className="bg-pink-500/20 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto transition-transform group-hover:scale-110"><Navigation className="text-pink-500" size={24} /></div>
               <p className="text-[10px] uppercase tracking-widest font-black text-text-muted">Road Info</p>
               <p className="font-bold text-xl">{property.roadInfo || 'Main Road'}</p>
            </div>
          </div>

          <section className="glass p-8 space-y-6">
            <div className="flex justify-between items-center border-b border-border-glass pb-6">
               <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-accent-gradient p-[2px]"><div className="w-full h-full rounded-full bg-bg-dark flex items-center justify-center font-black text-xl">L</div></div>
                  <div>
                    <h4 className="text-xl font-bold">Lister Details</h4>
                    <p className="text-sm text-text-muted flex items-center gap-2"><ShieldCheck size={14} className="text-primary" /> Verified Trusted Owner</p>
                  </div>
               </div>
               <div className="flex gap-4">
                  <button onClick={handleFavorite} className="p-4 rounded-full glass hover:bg-secondary/10 hover:text-secondary hover:border-secondary transition-all" title="Bookmark"><Heart size={20} /></button>
               </div>
            </div>

            <div className="space-y-4 pt-4">
               <h3 className="text-2xl font-black">Property Description</h3>
               <p className="text-text-muted leading-loose">
                 Discover a haven of luxury and comfort. This {property.bhk} BHK property located at {property.address} 
                 offers state-of-the-art facilities and a premier living experience. Perfect for families looking 
                 for a modern lifestyle with all essential amenities at their doorstep. 
                 The {property.floor} floor location ensures great ventilation and sunlight.
               </p>
            </div>
          </section>
        </div>

        {/* Sidebar Sticky Box */}
        <aside className="lg:col-span-1">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass p-8 sticky top-28 border-primary/20 space-y-8 bg-gradient-to-br from-bg-card to-bg-dark">
             <div className="flex justify-between items-start">
               <div>
                 <p className="text-[10px] uppercase tracking-[4px] font-black text-primary mb-1">Status</p>
                 <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${property.status === 'open' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                   {property.status === 'open' ? 'Available' : 'Booked'}
                 </span>
               </div>
               <div className="text-right">
                 <p className="text-[10px] uppercase tracking-[4px] font-black text-secondary mb-1">Interest</p>
                 <span className="flex items-center gap-1 font-black text-sm"><Eye size={14} /> {property.views} views</span>
               </div>
             </div>

             <div className="h-[1px] bg-border-glass"></div>

             {user?.role === 'customer' ? (
                <button 
                  onClick={handleRequestAppointment}
                  disabled={requestStatus === 'sent' || property.status === 'booked'}
                  className={`btn-primary w-full py-5 rounded-2xl flex items-center justify-center gap-3 font-black text-base shadow-2xl transition-all ${requestStatus === 'sent' || property.status === 'booked' ? 'opacity-50 grayscale' : 'hover:scale-105'}`}
                >
                  {requestStatus === 'sent' ? 'REQUEST SENT' : property.status === 'booked' ? 'ALREADY BOOKED' : 'BOOK AN APPOINTMENT'}
                  <Calendar size={20} />
                </button>
             ) : user?.role === 'tenant' ? (
                <div className="bg-yellow-500/10 p-4 rounded-xl border border-yellow-500/20 text-yellow-500 text-xs text-center font-bold uppercase tracking-widest">
                  YOU ARE THE OWNER
                </div>
             ) : (
                <button onClick={() => navigate('/customer/login')} className="btn-primary w-full py-5 rounded-2xl font-black shadow-2xl">
                  LOGIN TO BOOK APPOINTMENT
                </button>
             )}
          </motion.div>
        </aside>
      </div>
    </div>
  );
};

export default PropertyDetail;
