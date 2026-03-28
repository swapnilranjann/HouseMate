import React, { useState, useEffect } from 'react';
import { getProperties } from '../services/api';
import PropertyCard from '../components/PropertyCard';
import { Search, SlidersHorizontal, Activity, Home as HomeIcon, Building, Briefcase, ShoppingBag, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeType, setActiveType] = useState('All');

  const categories = [
    { name: 'All', icon: LayoutGrid },
    { name: 'House', icon: HomeIcon },
    { name: 'Flat', icon: Building },
    { name: 'Office', icon: Briefcase },
    { name: 'Shop', icon: ShoppingBag },
  ];

  useEffect(() => {
    fetchProperties();
  }, [activeType]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const { data } = await getProperties(activeType === 'All' ? null : activeType);
      setProperties(data);
    } catch (err) {
      console.error('Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter(p => 
    (p.status === 'open' || !p.status) && (
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.bhk && p.bhk.includes(searchTerm))
    )
  );

  return (
    <div className="flex-1 w-full bg-slate-50 flex flex-col">
      {/* Search & Hero Section */}
      <div className="bg-white border-b border-gray-200 pt-16 pb-12 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4">
                Explore <span className="text-indigo-600">Premium</span> Spaces
              </h1>
              <p className="text-lg text-slate-500 max-w-2xl font-medium leading-relaxed">
                Connect with verified property owners. Whether it's a home, a startup office, or a premium retail shop, find it all here.
              </p>
            </div>
            
            <div className="w-full md:max-w-md">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                        <Search size={22} />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search by city or name..."
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-slate-900 font-bold transition-all placeholder-slate-400 shadow-inner"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveType(cat.name)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all border shrink-0 ${
                  activeType === cat.name 
                  ? 'bg-slate-900 border-slate-900 text-white shadow-lg scale-105' 
                  : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600'
                }`}
              >
                <cat.icon size={18} />
                <span>{cat.name === 'All' ? 'Everything' : `${cat.name}s`}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex items-center justify-between mb-8 group cursor-default">
            <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    Available <span className="text-indigo-600">{activeType === 'All' ? 'Listings' : `${activeType}s`}</span>
                </h2>
                <div className="h-1 w-12 bg-indigo-500 mt-1 rounded-full group-hover:w-24 transition-all duration-500"></div>
            </div>
            <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full border border-indigo-100 shadow-sm">
                <Activity size={14} className="animate-pulse" />
                <span className="text-xs font-black uppercase tracking-widest">{filteredProperties.length} Matches</span>
            </div>
        </div>

        {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="bg-white aspect-[4/5] animate-pulse rounded-3xl border border-slate-200 shadow-sm"></div>
                ))}
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProperties.length > 0 ? (
                    filteredProperties.map((p, idx) => (
                        <motion.div
                            key={p._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <PropertyCard property={p} />
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200 shadow-inner">
                        <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="w-10 h-10 text-slate-300" />
                        </div>
                        <p className="text-2xl text-slate-900 font-black tracking-tight">No {activeType}s Found</p>
                        <p className="text-slate-500 mt-2 font-medium">Try checking another category or clearing your search.</p>
                        <button 
                            onClick={() => {setActiveType('All'); setSearchTerm('');}}
                            className="mt-8 text-indigo-600 font-bold hover:underline underline-offset-4"
                        >
                            Reset all filters
                        </button>
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default Home;
