import React from 'react';

const DashboardHeader = ({ 
  title, 
  subtitle, 
  stats = [], 
  icon: Icon, 
  roleLabel = "User Portal",
  accentColor = "orange" 
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-sm p-6 mb-8 shadow-sm">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-[#FFF7ED] text-[#C2410C] font-extrabold text-[9px] px-2.5 py-1 rounded-sm border border-[#FFEDD5] uppercase tracking-[0.2em] leading-none">
              {roleLabel}
            </span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-1 uppercase tracking-wider">
            {title}
          </h1>
          <p className="text-gray-500 text-xs font-semibold opacity-70">
            {subtitle}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-[#FCFDFF] border border-gray-100 p-4 rounded-sm flex-1 md:flex-none min-w-[120px] text-center md:text-left shadow-sm">
              <p className="text-gray-400 text-[9px] font-bold uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className={`text-xs font-black uppercase tracking-widest ${stat.highlight ? 'text-[#C2410C]' : 'text-gray-800'}`}>
                {stat.value}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
