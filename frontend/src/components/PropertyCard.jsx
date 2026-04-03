import React from 'react';
import { MapPin, ArrowUpRight, Bed, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const PropertyCard = ({ property }) => {
  return (
    <div 
        style={{ borderColor: 'var(--primary-hover, #eee)' }}
        className="bg-white border border-gray-200 rounded-sm overflow-hidden group hover:shadow-xl transition-all flex flex-col h-full shadow-sm"
    >
        {/* Compact Image */}
        <div className="relative h-48 overflow-hidden bg-gray-100">
            <img 
                src={`http://localhost:5000${property.images?.[0]}`} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                alt={property.name} 
            />
            <div className="absolute top-2 right-2 flex gap-1">
                <span 
                    style={{ backgroundColor: property.status === 'open' ? 'var(--primary)' : '#666' }}
                    className={`text-white text-[9px] font-black px-2.5 py-1 rounded-sm shadow-sm uppercase tracking-[0.2em]`}
                >
                    {property.status === 'open' ? 'Active' : 'Closed'}
                </span>
            </div>
            <div className="absolute bottom-2 left-2">
                <span className="bg-white/80 backdrop-blur-md text-gray-800 text-[9px] font-black px-2.5 py-1 rounded-sm border border-gray-200 shadow-sm flex items-center gap-1.5 uppercase tracking-widest">
                    <Eye size={12} style={{ color: 'var(--primary)' }} /> {property.views || 0}
                </span>
            </div>
        </div>

        {/* Content Area */}
        <div className="p-5 flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-3">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">{property.type}</span>
                <span style={{ color: 'var(--primary)' }} className="text-sm font-black tracking-tight">₹{property.price?.toLocaleString()} / MO</span>
            </div>
            
            <h3 className="text-md font-black text-gray-900 group-hover:text-primary transition-colors leading-tight mb-3 line-clamp-1 uppercase tracking-tight" style={{ color: 'inherit' }}>
                {property.name}
            </h3>

            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest flex items-start gap-1.5 mb-5 flex-1 leading-relaxed">
                <MapPin size={14} style={{ color: 'var(--primary)' }} className="shrink-0 mt-0.5 opacity-60" /> {property.address}
            </p>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                <div className="flex gap-4">
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-600 font-black uppercase tracking-widest">
                        <Bed size={16} className="text-gray-300" /> {property.bhk} BHK
                    </div>
                </div>

                <Link 
                    to={`/property/${property._id}`} 
                    style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
                    className="p-2 border rounded-sm hover:bg-gray-50 transition-all shadow-xs"
                >
                    <ArrowUpRight size={16} />
                </Link>
            </div>
        </div>
    </div>
  );
};

export default PropertyCard;
