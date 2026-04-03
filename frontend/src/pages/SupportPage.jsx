import React, { useState, useEffect } from 'react';
import { createSupportTicket, getMyTickets } from '../services/api';
import { LifeBuoy, Send, Clock, AlertCircle, CheckCircle, ChevronRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import DataTable from '../components/ui/DataTable';
import DashboardHeader from '../components/DashboardHeader';

const SupportPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ subject: 'General Question', description: '', priority: 'Normal' });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const { data } = await getMyTickets();
      setTickets(data.data); // Standardised response util returns { success, data, message }
    } catch (err) {
      toast.error('Failed to fetch support history');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSupportTicket(formData);
      toast.success('Ticket submitted! Our team will get back to you soon.');
      setFormData({ subject: 'General Question', description: '', priority: 'Normal' });
      setShowForm(false);
      fetchTickets();
    } catch (err) {
      toast.error('Failed to submit ticket. Please try again.');
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Open': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'In Progress': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Resolved': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const columns = [
    {
      header: 'Created',
      accessor: 'createdAt',
      render: (row) => (
        <span className="text-[10px] font-black text-slate-400 flex items-center gap-1.5 uppercase tracking-widest leading-none">
          <Clock size={12} className="text-indigo-400" /> {new Date(row.createdAt).toLocaleDateString()}
        </span>
      )
    },
    {
      header: 'Priority',
      accessor: 'priority',
      render: (row) => (
        <span className={`text-[10px] font-black uppercase tracking-widest leading-none ${row.priority === 'High' ? 'text-rose-500' : 'text-slate-400'}`}>
          {row.priority}
        </span>
      )
    },
    {
      header: 'Subject',
      accessor: 'subject',
      cellClassName: 'font-serif italic font-black text-slate-900 uppercase italic text-sm'
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border leading-none ${getStatusStyle(row.status)}`}>
          {row.status}
        </span>
      )
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <DashboardHeader 
        title={<>Support <span className="text-indigo-600">Protocol</span></>}
        subtitle="Our high-tier assistance desk is active. Every inquiry is verified and tracked by our intelligence layer."
        icon={LifeBuoy}
        roleLabel="Platform Concierge"
        accentColor="indigo"
        stats={[
          { label: "Active Tickets", value: tickets.filter(t => t.status !== 'Resolved').length },
          { label: "Resolution Status", value: `${Math.round((tickets.filter(t => t.status === 'Resolved').length / (tickets.length || 1)) * 100)}%` }
        ]}
      />

      <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          <h2 className="text-2xl font-serif italic text-slate-900 font-black italic uppercase">Support Interactions</h2>
          <button 
            onClick={() => setShowForm(!showForm)}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl transition-all ${showForm ? 'bg-slate-50 text-slate-400 border border-slate-200' : 'bg-indigo-600 text-white hover:bg-black hover:-translate-y-1'}`}
          >
            {showForm ? 'VIEW INTERACTION HISTORY' : 'OPEN NEW PROTOCOL'}
          </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Form Section */}
        <AnimatePresence>
            {showForm && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="lg:col-span-1">
                <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden sticky top-24">
                    <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                       <h3 className="text-xl font-serif italic font-black text-slate-900 uppercase italic">New Inquiry</h3>
                       <Send className="text-indigo-600" size={20} />
                    </div>
                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Protocol Category</label>
                        <select 
                        className="w-full px-6 py-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 bg-slate-50 transition-all font-black text-[10px] uppercase tracking-widest appearance-none outline-none"
                        value={formData.subject}
                        onChange={e => setFormData({...formData, subject: e.target.value})}
                        >
                        <option>General Question</option>
                        <option>Bug Report</option>
                        <option>Scam Property</option>
                        <option>Account Access</option>
                        <option>Billing Issue</option>
                        <option>Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Incident Description</label>
                        <textarea 
                        required
                        rows="4"
                        className="w-full px-6 py-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 bg-slate-50 transition-all text-xs font-bold leading-relaxed outline-none"
                        placeholder="Provide deep details of your request..."
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Urgency Rating</label>
                        <div className="flex gap-3">
                        {['Low', 'Normal', 'High'].map(p => (
                            <button
                            key={p}
                            type="button"
                            onClick={() => setFormData({...formData, priority: p})}
                            className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${formData.priority === p ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl scale-105' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}
                            >
                            {p}
                            </button>
                        ))}
                        </div>
                    </div>

                    <button type="submit" className="w-full py-5 bg-slate-900 border border-slate-900 hover:bg-black text-white rounded-2xl font-black tracking-[0.3em] text-[11px] shadow-2xl transition-all hover:-translate-y-1">TRANSMIT INQUIRY</button>
                    </form>
                </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Ticket List */}
        <div className={showForm ? 'lg:col-span-2' : 'lg:col-span-3 max-w-5xl mx-auto w-full'}>
            <DataTable 
                columns={columns} 
                data={tickets} 
                emptyMessage="No active support protocols found in history."
            />
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
