import React, { useState, useEffect } from 'react';
import { getProperties } from '../services/api';
import PropertyCard from '../components/PropertyCard';
import { Search, Filter, LayoutGrid, Eye, Calendar, Globe } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
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
      setProperties(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const types = ['All', 'House', 'Flat', 'Office', 'Shop'];

  const filteredProperties = properties.filter(p => {
    const matchesType = activeType === 'All' || p.type === activeType;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className={`min-h-screen ${user ? 'bg-transparent' : 'bg-gray-50'}`}>
      
      {!user && (
        <section className="bg-white border-b border-gray-200 py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
              <h1 className="text-5xl font-bold text-gray-900 mb-6">Find your perfect space</h1>
              <p className="text-gray-500 text-xl mb-10 max-w-2xl mx-auto font-medium">Direct connection to property owners. No middleman. Real listings.</p>
              
              <div className="max-w-4xl mx-auto bg-white border border-gray-300 rounded p-1 flex shadow-lg overflow-hidden">
                <div className="flex-1 flex items-center gap-3 px-6 py-4">
                    <Search className="text-gray-400" size={24} />
                    <input 
                       type="text" 
                       placeholder="Search by city, area, or property name..." 
                       className="w-full bg-transparent outline-none text-gray-800 text-lg font-medium"
                       value={searchQuery}
                       onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
                <button 
                    style={{ backgroundColor: 'var(--primary)' }}
                    className="hover:brightness-110 text-white px-12 py-4 font-black text-lg transition-all uppercase tracking-[0.2em] shadow-lg"
                >
                    Initialize Search
                </button>
              </div>
          </div>
        </section>
      )}

      <main className={`${user ? 'p-0' : 'max-w-7xl mx-auto px-4 py-16'}`}>
        {/* Enterprise Search Header (matches screenshot) */}
        <div className="bg-white border border-gray-200 rounded-sm p-5 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="flex flex-col md:flex-row flex-1 items-center gap-4 w-full">
                <div className="flex-1 relative flex items-center w-full">
                    <input 
                        type="text" 
                        placeholder="ASSET NAME OR LOCATION IDENTIFIER" 
                        className="w-full bg-[#FCFDFF] border border-gray-200 rounded-sm px-10 py-3 text-[10px] font-black uppercase tracking-[0.15em] outline-none focus:border-primary transition-all"
                        style={{ borderLeftWidth: '4px', borderLeftColor: 'var(--primary)' }}
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-3 text-gray-300" size={14} />
                    <button className="absolute right-3 text-gray-300 hover:text-gray-500"><Filter size={14}/></button>
                </div>
                <div className="flex-1 relative flex items-center w-full">
                    <input 
                        type="text" 
                        placeholder="TEMPORAL RANGE / CREATED DATE" 
                        className="w-full bg-[#FCFDFF] border border-gray-200 rounded-sm px-10 py-3 text-[10px] font-black uppercase tracking-[0.15em] outline-none focus:border-primary transition-all"
                    />
                    <Calendar className="absolute left-3 text-gray-300" size={14} />
                    <button className="absolute right-3 text-gray-300 hover:text-gray-500"><Filter size={14}/></button>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button className="p-3 bg-gray-50 text-gray-400 rounded-sm hover:text-gray-600 border border-gray-100"><LayoutGrid size={18}/></button>
                <button className="p-3 bg-gray-50 text-gray-400 rounded-sm hover:text-gray-600 border border-gray-100"><Eye size={18}/></button>
            </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-4 no-scrollbar">
            {types.map(type => (
                <button 
                    key={type}
                    onClick={() => setActiveType(type)}
                    style={{ 
                        backgroundColor: activeType === type ? 'var(--primary)' : 'white',
                        borderColor: activeType === type ? 'var(--primary)' : '#eee',
                        color: activeType === type ? 'white' : '#999'
                    }}
                    className={`px-8 py-2.5 border rounded-sm text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xs ${
                        activeType === type ? 'shadow-md' : 'hover:border-gray-300'
                    }`}
                >
                    {type}
                </button>
            ))}
        </div>

        {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-96 bg-white animate-pulse rounded-sm border border-gray-100 shadow-sm"></div>)}
            </div>
        ) : filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProperties.map(p => (
                    <PropertyCard key={p._id} property={p} />
                ))}
            </div>
        ) : (
            <EmptyState 
                title="NO ASSETS IDENTIFIED"
                message="Adjust search parameters to locate matching inventory."
                icon={Search}
                actionText="RESET ALL FILTERS"
                onAction={() => { setActiveType('All'); setSearchQuery(''); }}
                color="var(--primary)"
            />
        )}
      </main>

      {!user && (
        <footer className="bg-[#111827] text-white py-24 mt-24 border-t-4" style={{ borderColor: 'var(--primary)' }}>
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-start gap-12">
              <div className="max-w-md">
                  <h2 className="text-4xl font-black mb-6 uppercase tracking-tight">HouseMate</h2>
                  <p className="text-gray-400 font-bold text-sm leading-relaxed uppercase tracking-widest opacity-60">Standardizing the real estate rental bridge across the nation with enterprise-grade infrastructure.</p>
              </div>
              <div className="grid grid-cols-2 gap-24">
                  <div className="space-y-6">
                      <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-[0.3em]">Operational</h4>
                      <div className="flex flex-col gap-4 font-black text-[11px] uppercase tracking-widest text-gray-400">
                          <a href="#" className="hover:text-white transition-colors">Asset Management</a>
                          <a href="#" className="hover:text-white transition-colors">Market Analysis</a>
                      </div>
                  </div>
                  <div className="space-y-6">
                      <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-[0.3em]">Institutional</h4>
                      <div className="flex flex-col gap-4 font-black text-[11px] uppercase tracking-widest text-gray-400">
                          <a href="#" className="hover:text-white transition-colors">Protocol</a>
                          <a href="#" className="hover:text-white transition-colors">Governance</a>
                      </div>
                  </div>
              </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 mt-20 pt-8 border-t border-white/5 flex justify-between items-center">
             <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">© 2024 HOUSEMATE INFRASTRUCTURE. ALL RIGHTS RESERVED.</p>
             <div className="flex gap-6">
                 <div className="w-8 h-8 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center">
                    <Globe size={14} className="text-gray-500" />
                 </div>
             </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Home;
