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
    <div className="bg-white border border-gray-200 rounded p-8 mb-8 shadow-sm">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-[#FFF7ED] text-[#C2410C] font-bold text-[10px] px-3 py-1 rounded border border-[#FFEDD5] uppercase tracking-widest">
              {roleLabel}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 uppercase tracking-tight">
            {title}
          </h1>
          <p className="text-gray-500 text-sm font-medium">
            {subtitle}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 w-full lg:w-auto">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-[#FCFDFF] border border-gray-100 p-5 rounded flex-1 md:flex-none min-w-[140px] text-center md:text-left shadow-sm">
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className={`text-2xl font-bold ${stat.highlight ? 'text-[#C2410C]' : 'text-gray-900'}`}>
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
