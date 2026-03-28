import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Maximize, Heart, Eye, ArrowRight, ShieldCheck, ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const PropertyCard = ({ property, onFavorite }) => {
  if (!property) return null;

  return (
    <Link to={`/property/${property._id}`} className="block group">
      <motion.div 
        whileHover={{ y: -8 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-[0_15px_60px_-15px_rgba(0,0,0,0.03)] hover:shadow-[0_45px_100px_-20px_rgba(99,102,241,0.08)] transition-all duration-500 flex flex-col h-full relative"
      >
        {/* Image Container */}
        <div className="relative h-72 overflow-hidden">
          <img 
            src={property.images?.[0] ? `http://localhost:5000${property.images[0]}` : 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80'} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
            alt={property.name} 
          />
          
          {/* Status Overlay */}
          <div className="absolute top-6 left-6 flex flex-col gap-2">
            <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-slate-900 shadow-xl border border-white/50 flex gap-2 items-center leading-none">
               <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-pulse"></div>
               {property.type || 'House'}
            </span>
            {property.images?.length > 1 && (
               <span className="bg-slate-900/80 backdrop-blur-sm px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest text-white/90 border border-white/10 flex items-center gap-1.5 leading-none">
                  <ImageIcon size={10} className="text-indigo-400" /> {property.images.length} Visuals
               </span>
            )}
          </div>

          <button 
            onClick={(e) => { e.preventDefault(); onFavorite?.(property._id); }}
            className="absolute top-6 right-6 p-3 bg-white/90 backdrop-blur-md text-slate-400 rounded-2xl hover:text-rose-500 transition-all border border-white/50 shadow-xl hover:scale-110 active:scale-95 group/btn"
          >
            <Heart size={18} />
          </button>

          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
             <div className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-2xl flex items-center gap-2">
                VERIFIED ASSET <ShieldCheck size={14} />
             </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="p-8 flex flex-col grow">
          <div className="flex justify-between items-start gap-4 mb-4">
            <h3 className="text-xl md:text-2xl font-serif italic text-slate-900 font-black tracking-tight group-hover:text-indigo-600 transition-colors truncate italic">
              {property.name}
            </h3>
          </div>

          <p className="text-slate-400 text-xs font-bold flex items-center gap-1.5 mb-8 line-clamp-1 uppercase tracking-widest">
            <MapPin size={14} className="text-sky-500 shrink-0" /> {property.address}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-50 flex flex-col items-center text-center group-hover:border-indigo-100 transition-all">
               <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Layout</span>
               <span className="text-xs font-black text-slate-900 uppercase tracking-tighter">{property.bhk} BHK Configuration</span>
            </div>
            <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-50 flex flex-col items-center text-center group-hover:border-indigo-100 transition-all">
               <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Market Level</span>
               <span className="text-xs font-black text-slate-900 uppercase tracking-tighter">Floor {property.floor || 'G'} Perspective</span>
            </div>
          </div>

          <div className="mt-auto pt-8 border-t border-slate-100 flex items-center justify-between">
              <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Market Views</p>
                  <div className="flex items-center gap-1.5 text-indigo-600 font-black">
                     <Eye size={14} /> <span className="text-sm font-black-condensed">{property.views || 0}</span>
                  </div>
              </div>
              <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg group-hover:bg-indigo-600 group-hover:translate-x-1 transition-all">
                  <ArrowRight size={18} />
              </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default PropertyCard;
