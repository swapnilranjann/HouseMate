import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Eye, ExternalLink, Activity } from 'lucide-react';

const PropertyCard = ({ property }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-[400px]">
      
      {/* Standard Image Area */}
      <div className="relative h-56 w-full bg-gray-100 flex-shrink-0">
        <img 
          src={property.images?.[0] ? `http://localhost:5000${property.images[0]}` : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800'} 
          alt={property.name} 
          className="w-full h-full object-cover"
        />
        
        {/* Simple Tags */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded text-xs font-bold text-gray-800 shadow-sm border border-gray-100 uppercase tracking-wide">
          {property.bhk} BHK
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900 truncate pr-4">
            {property.name}
          </h3>
          <div className="flex items-center text-xs font-semibold text-green-700 bg-green-50 px-2 py-1 rounded border border-green-100 mt-1 whitespace-nowrap">
            {property.status || 'Active'}
          </div>
        </div>
        
        <p className="text-gray-500 text-sm flex items-center gap-1.5 mb-4 line-clamp-1">
          <MapPin size={16} className="text-gray-400 shrink-0" /> 
          {property.address}
        </p>

        {/* Specs Table */}
        <div className="flex items-center justify-between text-xs text-gray-500 py-3 border-y border-gray-100 mt-auto mb-4 bg-gray-50/50 px-3 rounded-md">
            <div className="flex flex-col">
              <span className="font-semibold text-gray-400">Floor</span>
              <span className="text-gray-900 font-bold">{property.floor}</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="font-semibold text-gray-400">Listed</span>
              <span className="text-gray-900 font-bold">{new Date(property.createdAt).toLocaleDateString()}</span>
            </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-400 flex items-center gap-1 font-medium">
            <Eye size={16} /> {property.views || 0}
          </div>
          <Link to={`/property/${property._id}`} className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm">
            Details <ExternalLink size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
