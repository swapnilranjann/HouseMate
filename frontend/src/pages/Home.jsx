import React, { useState, useEffect } from 'react';
import { getProperties } from '../services/api';
import PropertyCard from '../components/PropertyCard';
import { Search, Filter, LayoutGrid, Eye } from 'lucide-react';
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
                <button className="bg-[#C2410C] hover:bg-[#9A3412] text-white px-12 py-4 font-bold text-lg transition-all uppercase tracking-widest">Search</button>
              </div>
          </div>
        </section>
      )}

      <main className={`${user ? 'p-0' : 'max-w-7xl mx-auto px-4 py-16'}`}>
        {/* Enterprise Search Header (matches screenshot) */}
        <div className="bg-white border border-gray-200 rounded-sm p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex flex-1 items-center gap-4 w-full">
                <div className="flex-1 relative flex items-center">
                    <input 
                        type="text" 
                        placeholder="Organization Name Search" 
                        className="w-full bg-[#FCFDFF] border border-gray-300 rounded px-10 py-2.5 text-sm outline-none focus:border-[#C2410C] transition-all"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-3 text-gray-400" size={16} />
                    <button className="absolute right-3 text-gray-400 hover:text-gray-600"><Filter size={16}/></button>
                </div>
                <div className="flex-1 relative flex items-center">
                    <input 
                        type="text" 
                        placeholder="Search By Created On Date" 
                        className="w-full bg-[#FCFDFF] border border-gray-300 rounded px-10 py-2.5 text-sm outline-none focus:border-[#C2410C] transition-all"
                    />
                    <Search className="absolute left-3 text-gray-400" size={16} />
                    <button className="absolute right-3 text-gray-400 hover:text-gray-600"><Filter size={16}/></button>
                </div>
            </div>
            <div className="flex items-center gap-1">
                <button className="p-2.5 text-gray-400 hover:text-gray-600"><LayoutGrid size={20}/></button>
                <button className="p-2.5 text-gray-400 hover:text-gray-600"><Eye size={20}/></button>
            </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2 custom-scrollbar">
            {types.map(type => (
                <button 
                    key={type}
                    onClick={() => setActiveType(type)}
                    className={`px-6 py-2 border rounded-sm text-xs font-bold uppercase tracking-widest transition-all ${
                        activeType === type 
                        ? 'bg-[#C2410C] border-[#C2410C] text-white' 
                        : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                >
                    {type}
                </button>
            ))}
        </div>

        {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-80 bg-white animate-pulse rounded-sm border border-gray-200"></div>)}
            </div>
        ) : filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProperties.map(p => (
                    <PropertyCard key={p._id} property={p} />
                ))}
            </div>
        ) : (
            <EmptyState 
                title="No properties found"
                message="Try adjusting your search criteria."
                icon={Search}
                actionText="View All Properties"
                onAction={() => { setActiveType('All'); setSearchQuery(''); }}
                color="orange"
            />
        )}
      </main>

      {!user && (
        <footer className="bg-[#3E2721] text-white py-20 mt-20">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-10">
              <div className="max-w-xs">
                  <h2 className="text-3xl font-bold mb-4 uppercase">HouseMate</h2>
                  <p className="text-white/60 font-medium">Standardizing the real estate rental bridge across the nation.</p>
              </div>
              <div className="flex gap-20">
                  <div className="space-y-4">
                      <h4 className="text-xs font-black uppercase text-white/40 tracking-widest">Navigation</h4>
                      <div className="flex flex-col gap-2 font-bold text-sm">
                          <a href="#" className="hover:text-[#C2410C]">About</a>
                          <a href="#" className="hover:text-[#C2410C]">Terms</a>
                      </div>
                  </div>
              </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Home;
