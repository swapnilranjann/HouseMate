import React from 'react';
import { MapPin, ArrowUpRight, Bed, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const PropertyCard = ({ property }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-sm overflow-hidden group hover:border-[#C2410C] transition-all flex flex-col h-full shadow-sm">
        {/* Compact Image */}
        <div className="relative h-48 overflow-hidden bg-gray-100">
            <img 
                src={`http://localhost:5000${property.images?.[0]}`} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                alt={property.name} 
            />
            <div className="absolute top-2 right-2 flex gap-1">
                <span className={`text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm uppercase tracking-wider ${property.status === 'open' ? 'bg-[#C2410C]' : 'bg-gray-500'}`}>
                    {property.status === 'open' ? 'Immediate' : 'Reserved'}
                </span>
            </div>
            <div className="absolute bottom-2 left-2">
                <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-[10px] font-bold px-2 py-0.5 rounded border border-gray-200 shadow-sm flex items-center gap-1">
                    <Eye size={12} className="text-[#C2410C]" /> {property.views || 0}
                </span>
            </div>
        </div>

        {/* Content Area */}
        <div className="p-4 flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{property.type}</span>
                <span className="text-sm font-bold text-[#C2410C]">₹{property.price?.toLocaleString()} / mo</span>
            </div>
            
            <h3 className="text-md font-bold text-gray-900 group-hover:text-[#C2410C] transition-colors leading-tight mb-2 line-clamp-1">
                {property.name}
            </h3>

            <p className="text-gray-500 text-[11px] flex items-start gap-1 mb-4 flex-1">
                <MapPin size={12} className="shrink-0 mt-0.5" /> {property.address}
            </p>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between mt-auto">
                <div className="flex gap-3">
                    <div className="flex items-center gap-1 text-[11px] text-gray-600 font-medium">
                        <Bed size={14} className="text-gray-400" /> {property.bhk} BHK
                    </div>
                </div>

                <Link to={`/property/${property._id}`} className="p-1.5 border border-gray-200 text-gray-400 hover:text-[#C2410C] hover:border-[#C2410C] rounded transition-all">
                    <ArrowUpRight size={16} />
                </Link>
            </div>
        </div>
    </div>
  );
};

export default PropertyCard;
