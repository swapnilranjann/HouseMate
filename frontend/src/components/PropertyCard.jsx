import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, ShieldCheck, Home, Building, Briefcase, ShoppingBag, Eye, Camera, Clock, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const PropertyCard = ({ property }) => {
  const getTypeIcon = (type) => {
    switch (type) {
      case 'Office': return <Briefcase size={14} />;
      case 'Shop': return <ShoppingBag size={14} />;
      case 'Flat': return <Building size={14} />;
      default: return <Home size={14} />;
    }
  };

  if (!property) return null;

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:border-indigo-100 flex flex-col relative h-full"
    >
      {/* Visual Identity */}
      <div className="relative h-72 overflow-hidden">
        <img 
          src={`http://localhost:5000${property.images?.[0]}`} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
          alt={property.name} 
        />
        
        {/* Verification Architecture */}
        <div className="absolute top-6 left-6 flex flex-col gap-2">
            <span className="bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-slate-900 shadow-xl flex gap-2 items-center leading-none border border-white/50">
                {getTypeIcon(property.type)} {property.type || 'House'}
            </span>
            <span className="bg-slate-900/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest text-emerald-400 self-start border border-white/10 shadow-2xl flex items-center gap-1.5 leading-none">
                <ShieldCheck size={12} /> Verified Home
            </span>
        </div>

        {/* Real-time Telemetry */}
        <div className="absolute bottom-6 right-6 flex gap-2">
            <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 border border-white/50">
                <Camera size={14} className="text-indigo-600" />
                <span className="text-[10px] font-black text-slate-900 leading-none">{property.images?.length || 0} Photos</span>
            </div>
        </div>
      </div>

      <div className="p-8 grow flex flex-col">
        <div className="flex justify-between items-start mb-2 gap-4">
            <h3 className="text-2xl md:text-3xl font-serif font-black text-slate-900 group-hover:text-indigo-600 transition-colors truncate uppercase italic-none">
                {property.name}
            </h3>
            <div className="text-right shrink-0">
                <p className="text-[14px] font-black text-slate-900 tracking-tighter">₹{property.price?.toLocaleString() || 'N/A'}</p>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">/ MONTH</p>
            </div>
        </div>
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 mb-8 leading-none">
          <MapPin size={14} className="text-sky-500" /> {property.address}
        </p>

        {/* Global Specs Area */}
        <div className="grid grid-cols-2 gap-3 mb-8">
            <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-50 flex flex-col items-center">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none text-center">Config</span>
                <span className="text-xs font-black text-slate-900">{property.bhk === 'N/A' ? 'COMM' : `${property.bhk} BHK`}</span>
            </div>
            <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-50 flex flex-col items-center">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none text-center">Area SqFt</span>
                <span className="text-xs font-black text-slate-900">{property.dimensions || 'N/A'}</span>
            </div>
        </div>

        <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
            <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Status</span>
                <span className={`text-[10px] font-black uppercase tracking-widest leading-none ${property.status === 'open' ? 'text-emerald-500' : 'text-rose-500'}`}>
                    Available Now
                </span>
            </div>
            <Link 
              to={`/property/${property._id}`} 
              className="bg-slate-900 hover:bg-black text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl transition-all hover:scale-105 flex items-center gap-2"
            >
              View Details <ArrowRight size={14} />
            </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
