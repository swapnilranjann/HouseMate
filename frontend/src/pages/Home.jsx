import React, { useState, useEffect } from 'react';
import { getProperties } from '../services/api';
import PropertyCard from '../components/PropertyCard';
import { Search, MapPin, Home as HomeIcon, LayoutGrid, Building, Briefcase, ShoppingBag, Activity, ChevronRight, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import EmptyState from '../components/EmptyState';

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [activeType, setActiveType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProps();
  }, []);

  const fetchProps = async () => {
    try {
      const { data } = await getProperties();
      setProperties(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const types = [
    { name: 'All', icon: <LayoutGrid size={14} /> },
    { name: 'House', icon: <HomeIcon size={14} /> },
    { name: 'Flat', icon: <Building size={14} /> },
    { name: 'Office', icon: <Briefcase size={14} /> },
    { name: 'Shop', icon: <ShoppingBag size={14} /> },
  ];

  const filteredProperties = properties.filter(p => {
    const matchesType = activeType === 'All' || p.type === activeType;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="flex flex-col items-center">
      
      {/* Editorial Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-sky-500/5 rounded-full blur-[120px]"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl text-center md:text-left">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-6 bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100 self-center md:self-start w-fit">
                    <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
                    <span className="text-[10px] font-black tracking-widest uppercase text-slate-500">Premium Real Estate Hub</span>
                </motion.div>
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl font-serif italic text-slate-900 leading-[1.1] tracking-tighter mb-8">
                    Curating <span className="text-indigo-600 underline-offset-8">Exquisite</span> <br/> Living Spaces.
                </motion.h1>
                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-slate-400 text-lg md:text-xl font-medium max-w-lg mb-12">
                    Connect with verified property owners. Whether it's a legacy home, a startup office, or a boutique retail shop.
                </motion.p>

                {/* Refined Search Area */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="relative max-w-md group">
                    <div className="absolute inset-x-0 bottom-0 bg-indigo-600/10 h-1 rounded-full transition-all group-focus-within:h-full group-focus-within:bg-indigo-600/5"></div>
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search by city or property name..." 
                        className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-3xl text-sm font-bold shadow-sm focus:shadow-xl focus:border-indigo-600 transition-all outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </motion.div>
            </div>

            {/* Visual Teaser */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="hidden md:block w-1/3">
                <div className="bg-white p-8 rounded-[3rem] shadow-2xl border border-slate-100 relative group overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                           <Activity size={20} />
                        </div>
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest italic">Market Active</span>
                    </div>
                    <h3 className="text-2xl font-serif font-black text-slate-900 mb-2">Portfolio Overview</h3>
                    <p className="text-xs text-slate-400 font-medium">Monitoring {properties.length} active listings across 5 categories.</p>
                    <div className="absolute -bottom-10 -right-10 opacity-5">
                       <LayoutGrid size={200} />
                    </div>
                </div>
            </motion.div>
        </div>
      </section>

      {/* Categories Bar */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 overflow-x-auto custom-scrollbar pb-6 flex items-center gap-4">
          <div className="p-2 bg-white rounded-2xl border border-slate-100 flex items-center gap-2 shadow-sm">
             <Filter size={16} className="text-slate-400 mx-2" />
             <div className="w-px h-6 bg-slate-100 mr-2"></div>
             {types.map(t => (
                <button 
                  key={t.name}
                  onClick={() => setActiveType(t.name)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeType === t.name ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'}`}
                >
                  {t.icon} {t.name}
                </button>
             ))}
          </div>
      </div>

      {/* Results Section */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
                <h2 className="text-4xl font-serif italic font-black text-slate-900 tracking-tight leading-none mb-4">
                    Active <span className="text-indigo-600">{activeType === 'All' ? 'Portfolio' : `${activeType}s`}</span>
                </h2>
                <div className="flex items-center gap-2">
                    <div className="h-1 w-12 bg-indigo-600 rounded-full"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Viewing {filteredProperties.length} Matches</span>
                </div>
            </div>
        </div>

        {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {[1,2,3].map(i => <div key={i} className="h-96 bg-white animate-pulse border border-slate-100 rounded-[2.5rem] shadow-sm"></div>)}
             </div>
        ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
                <AnimatePresence>
                    {filteredProperties.map(p => (
                        <motion.div key={p._id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                            <PropertyCard property={p} />
                        </motion.div>
                    ))}
                </AnimatePresence>
             </div>
        )}

        {filteredProperties.length === 0 && !loading && (
             <EmptyState 
                title="Search yielded zero results"
                message="Try adjusting your filters or search keywords to explore more premiums. Every asset is unique."
                icon={Search}
                actionText="RESET ALL FILTERS"
                onAction={() => { setActiveType('All'); setSearchQuery(''); }}
                color="indigo"
             />
        )}
      </div>
    </div>
  );
};

export default Home;
