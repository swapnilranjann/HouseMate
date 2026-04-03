import React from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Search, Mail, AlertTriangle, MapPin, MessageSquare, ShieldCheck, UserCircle, Briefcase, ShoppingBag, Building, Layout, Home } from 'lucide-react';

const EmptyState = ({ title, message, icon: Icon, actionText, onAction, color = "orange" }) => {
  const colorMap = {
    orange: "text-[#C2410C] bg-[#FFF7ED] border-[#FFEDD5]",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
    blue: "text-[#C2410C] bg-[#FFF7ED] border-[#FFEDD5]", // standardized
    gray: "text-gray-500 bg-gray-50 border-gray-100"
  };

  const selectedColor = colorMap[color] || colorMap.orange;

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-gray-200 rounded min-h-[300px]">
      <div className={`w-16 h-16 rounded border flex items-center justify-center mb-6 shadow-sm ${selectedColor}`}>
        {Icon ? <Icon size={32} /> : <Home size={32} />}
      </div>
      
      <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-2">
        {title || "No data available"}
      </h2>
      
      <p className="text-xs text-gray-500 font-medium max-w-sm mb-8 leading-relaxed">
        {message || "We couldn't find any information to display at this time. Please try refreshing or checking back later."}
      </p>

      {onAction && (
        <button 
          onClick={onAction}
          className="btn-primary uppercase text-[10px] tracking-[2px] h-10 px-6 shadow-sm"
        >
          {actionText || "Get Started"}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
