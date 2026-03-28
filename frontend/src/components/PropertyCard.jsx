import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Eye, ArrowUpRight, Home, Building, Briefcase, ShoppingBag, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const PropertyCard = ({ property }) => {
  
  const getTypeIcon = (type) => {
    switch (type) {
      case 'Office': return <Briefcase size={14} />;
      case 'Shop': return <ShoppingBag size={14} />;
      case 'Flat': return <Building size={14} />;
      default: return <Home size={14} />;
    }
  };

  return (
    <Link to={`/property/${property._id}`} className="block group">
      <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2 flex flex-col h-full bg-gradient-to-b from-white to-slate-50/30">
        
        {/* Visual Header */}
        <div className="relative h-64 overflow-hidden">
          <img 
            src={property.images?.[0] ? `http://localhost:5000${property.images[0]}` : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800'} 
            alt={property.name} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          
          {/* Status & Type Overlays */}
          <div className="absolute top-6 left-6 flex flex-col gap-2">
            <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-xl flex items-center gap-2 border border-white/50">
              {getTypeIcon(property.type)} {property.type || 'House'}
            </span>
            {property.bhk !== 'N/A' && (
                <span className="bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl flex items-center self-start border border-white/10">
                    {property.bhk} BHK
                </span>
            )}
          </div>

          <div className="absolute bottom-6 right-6">
             <div className="bg-indigo-600 text-white p-3 rounded-2xl shadow-2xl transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <ArrowUpRight size={20} />
             </div>
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>

        {/* Property Info */}
        <div className="p-8 flex flex-col grow">
          <div className="flex justify-between items-start mb-4">
            <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight mb-2 group-hover:text-indigo-600 transition-colors">
                {property.name}
                </h3>
                <p className="text-slate-400 font-bold text-xs flex items-center gap-1.5 transition-colors group-hover:text-slate-600">
                    <MapPin size={14} className="text-indigo-500" /> 
                    {property.address}
                </p>
            </div>
            {property.status === 'open' ? (
                <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">Open</span>
            ) : (
                <span className="bg-rose-50 text-rose-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-rose-100">Booked</span>
            )}
          </div>
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4 py-6 border-y border-slate-100 my-auto">
              <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1 leading-none">Floor</span>
                  <span className="text-sm font-black text-slate-900">{property.floor}</span>
              </div>
              <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1 leading-none">Listed On</span>
                  <span className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                    <Clock size={14} className="text-indigo-400" />
                    {new Date(property.createdAt).toLocaleDateString()}
                  </span>
              </div>
          </div>

          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-black text-[10px] text-slate-400 border border-slate-200">
                    {property.views || 0}
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Views gathered</span>
            </div>
            
            <div className="text-indigo-600 font-black text-xs uppercase tracking-widest group-hover:underline underline-offset-8 transition-all">
                Full Details
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
