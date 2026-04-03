import React from 'react';

const DashboardHeader = ({ 
  title, 
  subtitle, 
  stats = [], 
  icon: Icon, 
  roleLabel = "User Portal",
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-sm p-6 mb-8 shadow-sm">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-3">
            <span 
              style={{ backgroundColor: 'var(--primary)', opacity: 0.1 }}
              className="absolute w-full h-full left-0 top-0 rounded-sm"
            ></span>
            <span 
               style={{ color: 'var(--primary)', borderColor: 'var(--primary)' }}
               className="relative z-10 font-extrabold text-[9px] px-2.5 py-1 rounded-sm border bg-[rgba(var(--primary-rgb),0.05)] uppercase tracking-[0.2em] leading-none"
            >
              {roleLabel}
            </span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-1 uppercase tracking-wider">
            {title}
          </h1>
          <p className="text-gray-500 text-[11px] font-bold opacity-40 uppercase tracking-widest">
            {subtitle}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-[#FCFDFF] border border-gray-100 p-4 rounded-sm flex-1 md:flex-none min-w-[120px] text-center md:text-left shadow-sm">
              <p className="text-gray-400 text-[8px] font-black uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <h3 
                style={{ color: stat.highlight ? 'var(--primary)' : 'inherit' }}
                className={`text-[10px] font-black uppercase tracking-widest ${!stat.highlight ? 'text-gray-800' : ''}`}
              >
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
