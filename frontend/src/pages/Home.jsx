import React, { useState, useEffect } from 'react';
import { getProperties } from '../services/api';
import PropertyCard from '../components/PropertyCard';
import { Search, MapPin, Home as HomeIcon, LayoutGrid, Building, Briefcase, ShoppingBag, Activity, ChevronRight, Filter, ShieldCheck, Globe, ArrowRight, Eye, Layout } from 'lucide-react';
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
    { name: 'All', icon: <Layout size={14} />, color: 'bg-indigo-600' },
    { name: 'House', icon: <HomeIcon size={14} />, color: 'bg-emerald-600' },
    { name: 'Flat', icon: <Building size={14} />, color: 'bg-sky-600' },
    { name: 'Office', icon: <Briefcase size={14} />, color: 'bg-rose-600' },
    { name: 'Shop', icon: <ShoppingBag size={14} />, color: 'bg-amber-600' },
  ];

  const filteredProperties = properties.filter(p => {
    const matchesType = activeType === 'All' || p.type === activeType;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="flex flex-col items-center">
      
      {/* High-Performance Hero */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px]"></div>
            <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-sky-500/5 rounded-full blur-[120px]"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center">
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-8 bg-white/50 backdrop-blur-md px-6 py-2 rounded-full border border-slate-100 shadow-xl group">
                <ShieldCheck className="text-indigo-600" size={16} />
                <span className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-500">Verified Direct House Marketplace</span>
             </motion.div>

             <motion.h1 
                initial={{ opacity: 0, y: 30 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-6xl md:text-8xl font-serif font-black text-slate-900 leading-[1.05] tracking-tighter mb-10 uppercase italic-none"
             >
                Find Your <br/> <span className="text-indigo-600">Perfect Home</span> <br/> With Ease.
             </motion.h1>

             <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 0.4 }}
                className="max-w-2xl text-slate-400 text-lg md:text-xl font-medium mb-12 leading-relaxed"
             >
                Search verified houses, flats, and offices in your city. Chat directly with owners and schedule a visit in seconds.
             </motion.p>

             {/* Search Area */}
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }} 
               animate={{ opacity: 1, scale: 1 }} 
               transition={{ delay: 0.6 }}
               className="w-full max-w-4xl p-2 bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-slate-100 flex flex-col md:flex-row items-center gap-2 group hover:border-indigo-100 transition-all"
             >
                <div className="flex-1 w-full flex items-center gap-6 px-8 py-4">
                    <Search className="text-indigo-600" size={24} />
                    <input 
                       type="text" 
                       placeholder="SEARCH BY LOCATION OR NAME..." 
                       className="w-full bg-transparent text-xs font-black tracking-widest outline-none uppercase"
                       value={searchQuery}
                       onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="hidden md:block h-10 w-px bg-slate-100 mx-4"></div>
                <div className="flex-1 w-full flex items-center gap-6 px-8 py-4 md:border-l border-slate-50">
                    <MapPin className="text-sky-500" size={24} />
                    <span className="text-xs font-black tracking-widest text-slate-400 uppercase">Available Everywhere</span>
                </div>
                <button className="w-full md:w-auto bg-slate-900 hover:bg-black text-white px-12 py-5 rounded-[1.5rem] md:rounded-[2.2rem] text-[11px] font-black uppercase tracking-[0.3em] shadow-xl transition-all hover:scale-105 active:scale-95">
                    SEARCH NOW
                </button>
             </motion.div>
        </div>
      </section>

      {/* Grid Control */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10 mb-16 px-4">
            <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-[2rem] border border-slate-100 overflow-x-auto custom-scrollbar w-full md:w-auto">
                {types.map(t => (
                    <button 
                        key={t.name}
                        onClick={() => setActiveType(t.name)}
                        className={`flex items-center gap-3 px-8 py-3 rounded-[1.2rem] text-[10px] font-black uppercase tracking-[0.25em] transition-all whitespace-nowrap ${
                            activeType === t.name ? 'bg-indigo-600 text-white shadow-2xl scale-105 px-12' : 'text-slate-400 hover:text-slate-900'
                        }`}
                    >
                        {activeType === t.name ? t.icon : null}
                        {t.name}
                    </button>
                ))}
            </div>
            
            <div className="flex items-center gap-4 text-slate-400">
                <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Activity size={16} className="text-indigo-400" /> Houses Near You: {filteredProperties.length}
                </span>
            </div>
        </div>

        {/* Home Grid */}
        <AnimatePresence mode="wait">
            {loading ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {[1,2,3,4,5,6].map(i => <div key={i} className="h-[500px] bg-white shimmer rounded-[3rem] border border-slate-100 shadow-sm"></div>)}
                </motion.div>
            ) : filteredProperties.length > 0 ? (
                <motion.div 
                    key="results"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                    }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
                >
                    {filteredProperties.map(p => (
                        <motion.div key={p._id} variants={{ hidden: { opacity: 0, scale: 0.95, y: 30 }, visible: { opacity: 1, scale: 1, y: 0 } }}>
                            <PropertyCard property={p} />
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <EmptyState 
                    title="No Results Found"
                    message="We couldn't find any properties matching your search. Try changing your filters or location."
                    icon={LayoutGrid}
                    actionText="VIEW ALL PROPERTIES"
                    onAction={() => { setActiveType('All'); setSearchQuery(''); }}
                    color="indigo"
                />
            )}
        </AnimatePresence>
      </section>

      {/* Trust Footer */}
      <footer className="w-full bg-slate-900 py-24 px-4 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-32 opacity-10 -rotate-12 translate-x-20">
              <ShieldCheck size={400} className="text-indigo-500" />
          </div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
              <h4 className="font-serif text-4xl md:text-6xl text-white mb-8 font-black uppercase tracking-tighter">Verified Homes. Direct Chats.</h4>
              <p className="text-slate-400 text-lg mb-12 leading-relaxed">Every house on HouseMate is verified by our team, ensuring 100% trust for you and your family.</p>
              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                  <div className="flex flex-col items-center">
                      <span className="text-indigo-400 text-6xl font-black tracking-tighter mb-2">1,000+</span>
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Verified Homes</span>
                  </div>
                  <div className="h-10 w-px bg-slate-800 hidden md:block"></div>
                  <div className="flex flex-col items-center">
                      <span className="text-sky-400 text-6xl font-black tracking-tighter mb-2">100%</span>
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Direct Safety</span>
                  </div>
              </div>
          </div>
      </footer>
    </div>
  );
};

export default Home;
