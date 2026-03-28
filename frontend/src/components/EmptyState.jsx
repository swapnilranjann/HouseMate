import React from 'react';
import { Link } from 'react-router-dom';

const EmptyState = ({ 
  title, 
  message, 
  icon: Icon, 
  actionText, 
  actionLink, 
  onAction,
  color = "indigo"
}) => {
  const accentText = color === 'sky' ? 'text-sky-500' : 'text-indigo-600';
  const decoColor = color === 'sky' ? 'decoration-sky-300' : 'decoration-indigo-300';

  return (
    <div className="py-24 text-center bg-white rounded-[4rem] border-2 border-dashed border-slate-100 flex flex-col items-center gap-6 shadow-inner animate-fade-in">
        <div className={`w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200`}>
             {Icon && <Icon size={40} />}
        </div>
        <div>
            <h2 className="text-3xl font-serif italic text-slate-900 tracking-tighter uppercase leading-none mb-2 italic font-black">
              {title}
            </h2>
            <p className="text-slate-400 mt-2 font-bold text-[10px] uppercase tracking-widest max-w-xs mx-auto">
              {message}
            </p>
        </div>
        
        {actionLink ? (
          <Link 
            to={actionLink} 
            className={`mt-4 bg-slate-900 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-black transition-all hover:-translate-y-1 block`}
          >
            {actionText}
          </Link>
        ) : actionText && (
          <button 
            onClick={onAction}
            className={`mt-4 bg-slate-900 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-black transition-all hover:-translate-y-1`}
          >
            {actionText}
          </button>
        )}
    </div>
  );
};

export default EmptyState;
