import React from 'react';
import { motion } from 'framer-motion';

const DashboardHeader = ({ 
  title, 
  subtitle, 
  stats = [], 
  icon: Icon, 
  roleLabel = "User Portal",
  accentColor = "indigo" 
}) => {
  const accentText = accentColor === 'sky' ? 'text-sky-400' : 'text-indigo-600';
  const accentBg = accentColor === 'sky' ? 'bg-sky-500/10 border-sky-500/20' : 'bg-indigo-500/10 border-indigo-500/20';

  return (
    <div className="bg-slate-900 rounded-[2rem] p-8 md:p-14 mb-8 text-white relative overflow-hidden shadow-2xl">
      <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className={`${accentBg} p-2.5 rounded-xl border`}>
              {Icon && <Icon className={accentText} size={20} />}
            </div>
            <span className={`${accentText} font-black text-[10px] uppercase tracking-[0.2em] leading-none`}>
              {roleLabel}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-black tracking-tighter mb-6 leading-tight text-white uppercase">
            {title}
          </h1>
          <p className="text-slate-400 font-medium text-sm md:text-lg leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 w-full lg:w-auto">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-[2rem] flex-1 md:flex-none min-w-[140px] shadow-inner text-center md:text-left">
              <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-2 leading-none">{stat.label}</p>
              <h3 className={`text-3xl md:text-5xl font-serif font-black ${stat.highlight ? accentText : 'text-white'}`}>
                {stat.value}
              </h3>
            </div>
          ))}
        </div>
      </div>
      
      <div className={`absolute -bottom-24 -right-24 w-64 h-64 ${accentColor === 'sky' ? 'bg-sky-500/10' : 'bg-indigo-500/10'} rounded-full blur-3xl`}></div>
      <div className={`absolute -top-24 -left-24 w-64 h-64 ${accentColor === 'sky' ? 'bg-indigo-500/10' : 'bg-sky-500/10'} rounded-full blur-3xl`}></div>
    </div>
  );
};

export default DashboardHeader;
