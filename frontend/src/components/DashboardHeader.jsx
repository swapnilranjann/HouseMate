import React from 'react';
import { motion } from 'framer-motion';

const DashboardHeader = ({ 
  title, 
  subtitle, 
  stats = [], 
  icon: Icon, 
  roleLabel = "Management Portal",
  accentColor = "indigo" 
}) => {
  const accentText = accentColor === 'sky' ? 'text-sky-400' : 'text-indigo-600';
  const accentBg = accentColor === 'sky' ? 'bg-sky-500/10 border-sky-500/20' : 'bg-indigo-500/10 border-indigo-500/20';

  return (
    <div className="bg-slate-900 rounded-[2.5rem] p-10 md:p-14 mb-10 text-white relative overflow-hidden shadow-2xl">
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
        <div className="max-w-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className={`${accentBg} p-2 rounded-xl border`}>
              {Icon && <Icon className={accentText} size={20} />}
            </div>
            <span className={`${accentText} font-black text-[10px] uppercase tracking-[0.2em] leading-none`}>
              {roleLabel}
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif italic font-black tracking-tighter mb-4 leading-none text-white">
            {title}
          </h1>
          <p className="text-slate-400 font-medium text-base">
            {subtitle}
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-[2rem] min-w-[140px] shadow-inner">
              <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1 leading-none">{stat.label}</p>
              <h3 className={`text-4xl font-serif italic font-black ${stat.highlight ? accentText : ''}`}>
                {stat.value}
              </h3>
            </div>
          ))}
        </div>
      </div>
      
      <div className={`absolute -bottom-24 -right-24 w-64 h-64 ${accentColor === 'sky' ? 'bg-sky-500/10' : 'bg-indigo-500/10'} rounded-full blur-3xl animate-pulse-slow`}></div>
      <div className={`absolute -top-24 -left-24 w-64 h-64 ${accentColor === 'sky' ? 'bg-indigo-500/10' : 'bg-sky-500/10'} rounded-full blur-3xl animate-pulse-slow`}></div>
    </div>
  );
};

export default DashboardHeader;
