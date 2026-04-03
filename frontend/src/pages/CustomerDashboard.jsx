import React, { useState, useEffect } from 'react';
import { getMyAppointments } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, CheckCircle, XCircle, MessageSquare, MapPin, Building, ArrowRight, ShieldCheck, UserCircle, Briefcase, Eye, LayoutGrid, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import DashboardHeader from '../components/DashboardHeader';
import EmptyState from '../components/EmptyState';

const CustomerDashboard = ({ isFavorites = false }) => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data } = await getMyAppointments();
      setAppointments(data.data); // Standardised response util returns { success, data, message }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter(a => {
      if (isFavorites) return false; 
      return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      
      <DashboardHeader 
        title={`Welcome, ${user.name}`}
        subtitle={`You have ${appointments.length} visit requests.`}
        icon={UserCircle}
        roleLabel="Customer"
        stats={[
           { label: "Total Visits", value: appointments.length },
           { label: "Approved", value: appointments.filter(a => a.status === 'approved').length, highlight: true }
        ]}
      />

      <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">My Visit History</h2>
      </div>

      <div className="space-y-4">
        {loading ? (
             <div className="space-y-4">
                {[1,2,3].map(i => <div key={i} className="h-32 bg-gray-100 animate-pulse rounded border border-gray-200"></div>)}
             </div>
        ) : filteredAppointments.length > 0 ? (
            <div className="space-y-4">
                {filteredAppointments.map(a => (
                    <div 
                        key={a._id}
                        className="bg-white rounded p-5 border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 hover:border-[#C2410C] transition-colors"
                    >
                        <div className="flex items-center gap-6 grow w-full">
                            <Link to={`/property/${a.propertyId?._id}`} className="w-24 h-24 rounded border border-gray-100 overflow-hidden shrink-0">
                                <img src={`http://localhost:5000${a.propertyId?.images?.[0]}`} className="w-full h-full object-cover" alt={a.propertyId?.name} />
                            </Link>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-[#C2410C] uppercase bg-[#FFF7ED] px-2 py-0.5 rounded">{a.propertyId?.type || 'HOUSE'}</span>
                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                                        a.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                                        a.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                                    }`}>
                                        {a.status.toUpperCase()}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight">{a.propertyId?.name}</h3>
                                <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                                    <MapPin size={14} className="text-[#C2410C]" /> {a.propertyId?.address}
                                </p>
                                <p className="text-[10px] text-gray-400 font-medium">
                                    {new Date(a.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2 w-full md:w-auto">
                            {a.status !== 'rejected' && (
                                <Link to={`/chats/${a._id}`} className="bg-gray-900 hover:bg-black text-white px-6 py-2 rounded text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all">
                                    <MessageSquare size={14} /> Message
                                </Link>
                            )}
                            <Link to={`/property/${a.propertyId?._id}`} className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2 rounded text-xs font-bold uppercase tracking-widest transition-all">
                                View
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <EmptyState 
                title="No visits found"
                message="Browse properties to request your first visit."
                icon={MapPin}
                actionText="Browse Properties"
                onAction={() => navigate('/')}
                color="orange"
            />
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
