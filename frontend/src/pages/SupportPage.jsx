import React, { useState, useEffect } from 'react';
import { createSupportTicket, getMyTickets } from '../services/api';
import { LifeBuoy, Send, Clock, AlertCircle, CheckCircle, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import DataTable from '../components/ui/DataTable';

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
      setTickets(data);
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
      case 'Open': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'In Progress': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Resolved': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const columns = [
    {
      header: 'Created',
      accessor: 'createdAt',
      render: (row) => (
        <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
          <Clock size={14} /> {new Date(row.createdAt).toLocaleDateString()}
        </span>
      )
    },
    {
      header: 'Subject',
      accessor: 'subject',
      cellClassName: 'font-bold text-slate-900'
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(row.status)}`}>
          {row.status}
        </span>
      )
    },
    {
      header: 'Priority',
      accessor: 'priority',
      render: (row) => (
        <span className={`text-[10px] font-black uppercase tracking-widest ${row.priority === 'High' ? 'text-red-500' : 'text-slate-400'}`}>
          {row.priority}
        </span>
      )
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
             <LifeBuoy className="text-indigo-600 w-10 h-10" /> Support Center
          </h1>
          <p className="text-lg text-gray-500 mt-2 font-medium">Have an issue? We're here to help.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 hover:bg-black text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg flex items-center gap-2 self-start"
        >
          {showForm ? 'View History' : 'New Support Ticket'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Form Section */}
        <div className={`lg:col-span-1 ${showForm ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 text-slate-900">
               <h2 className="text-lg font-bold flex items-center gap-2">
                 <Send size={18} className="text-indigo-600" /> Open a New Ticket
               </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Issue Category</label>
                <select 
                  className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 transition-all font-bold text-slate-700"
                  value={formData.subject}
                  onChange={e => setFormData({...formData, subject: e.target.value})}
                >
                  <option>Bug Report</option>
                  <option>Scam Property</option>
                  <option>Account Access</option>
                  <option>Billing Issue</option>
                  <option>General Question</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                <textarea 
                  required
                  rows="4"
                  className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 transition-all font-medium"
                  placeholder="Details of your request..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider text-[10px]">Set Priority</label>
                <div className="flex gap-4">
                  {['Low', 'Normal', 'High'].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setFormData({...formData, priority: p})}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${formData.priority === p ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="w-full py-4 bg-indigo-600 hover:bg-black text-white rounded-2xl font-bold shadow-lg transition-all">
                Submit Request
              </button>
            </form>
          </div>
        </div>

        {/* Ticket List */}
        <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Support Interactions</h2>
                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                {tickets.length} Total
                </span>
            </div>
            
            <DataTable 
                columns={columns} 
                data={tickets} 
                emptyMessage="You haven't submitted any support tickets yet."
            />
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
