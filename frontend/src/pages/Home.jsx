import React, { useState, useEffect } from 'react';
import { getProperties } from '../services/api';
import PropertyCard from '../components/PropertyCard';
import { Search, SlidersHorizontal, Activity } from 'lucide-react';

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const { data } = await getProperties();
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
    p.bhk.includes(searchTerm)
    )
  );

  return (
    <div className="flex-1 w-full bg-gray-50 flex flex-col">
      {/* Straightforward Hero Header */}
      <div className="bg-white border-b border-gray-200 pt-16 pb-12 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Find the Perfect Property
          </h1>
          <p className="text-lg text-gray-500 max-w-3xl mb-10">
            A comprehensive, reliable directory connecting tenants with property owners through simple search and verified listings.
          </p>

          {/* Standard Search Bar */}
          <div className="bg-white p-2 max-w-3xl rounded-lg shadow-sm border border-gray-300 flex items-center">
            <div className="flex-grow flex items-center px-4">
              <Search className="text-gray-400 shrink-0 w-5 h-5 mr-3" />
              <input 
                type="text" 
                placeholder="Search by city, property name, or BHK..."
                className="w-full text-base text-gray-900 focus:outline-none placeholder-gray-400 py-3 bg-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-md font-semibold text-sm flex items-center gap-2 transition-colors border border-gray-200 shrink-0 ml-2">
              <SlidersHorizontal size={16} /> Filters
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        
        {/* Results Info */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Featured Listings</h2>
          <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100">
            <Activity size={14} />
            <span className="text-xs font-semibold uppercase">{filteredProperties.length} Results</span>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="w-full">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white h-96 animate-pulse rounded-xl border border-gray-200 shadow-sm"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.length > 0 ? (
                filteredProperties.map((p, idx) => <PropertyCard key={p._id} property={p} index={idx} />)
              ) : (
                <div className="col-span-full py-24 text-center bg-white rounded-xl border border-dashed border-gray-300">
                  <Search className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-xl text-gray-700 font-semibold">No properties matched</p>
                  <p className="text-gray-500 mt-1">Try broadening your search term.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
