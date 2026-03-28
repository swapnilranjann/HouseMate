import React, { useState, useEffect } from 'react';
import { createSupportTicket, getMyTickets } from '../services/api';
import { LifeBuoy, Send, Clock, AlertCircle, CheckCircle, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SupportPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ subject: 'General Question', description: '', priority: 'Normal' });
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const { data } = await getMyTickets();
      setTickets(data);
    } catch (err) {
      console.error('Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSupportTicket(formData);
      setMessage('Ticket submitted successfully! Our team will contact you soon.');
      setFormData({ subject: 'General Question', description: '', priority: 'Normal' });
      setShowForm(false);
      fetchTickets();
      setTimeout(() => setMessage(''), 5000);
    } catch (err) {
      setMessage('Failed to submit ticket. Please try again.');
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
             <LifeBuoy className="text-indigo-600 w-10 h-10" /> Support Center
          </h1>
          <p className="text-lg text-gray-500 mt-2">Need help? Submit a ticket and our team will get back to you.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md flex items-center gap-2 self-start"
        >
          {showForm ? 'Cancel' : 'New Support Ticket'}
        </button>
      </div>

      <AnimatePresence>
        {message && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mb-8 p-4 rounded-xl border font-bold text-center ${message.includes('success') ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-600'}`}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Form Section */}
        <div className={`lg:col-span-1 ${showForm ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 text-slate-900">
               <h2 className="text-lg font-bold flex items-center gap-2">
                 <Send size={18} className="text-indigo-600" /> Open a New Ticket
               </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                <select 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 transition-all font-medium text-slate-900"
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
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 transition-all font-medium text-slate-900"
                  placeholder="Tell us more about the issue..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Priority</label>
                <div className="flex gap-4">
                  {['Low', 'Normal', 'High'].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setFormData({...formData, priority: p})}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${formData.priority === p ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md transition-all">
                Submit Support Request
              </button>
            </form>
          </div>
        </div>

        {/* Ticket List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Your Support History</h2>
            <div className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-100 text-xs font-bold uppercase tracking-wider">
               {tickets.length} Tickets
            </div>
          </div>

          {loading ? (
             <div className="space-y-4">
               {[1,2,3].map(i => <div key={i} className="h-28 bg-gray-100 animate-pulse rounded-2xl border border-gray-200"></div>)}
             </div>
          ) : tickets.length > 0 ? (
            <div className="space-y-4">
              {tickets.map(ticket => (
                <div key={ticket._id} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                         <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(ticket.status)}`}>
                            {ticket.status}
                         </span>
                         <span className={`text-[10px] font-bold uppercase tracking-widest ${ticket.priority === 'High' ? 'text-red-500' : 'text-slate-400'}`}>
                            {ticket.priority} Priority
                         </span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{ticket.subject}</h3>
                      <p className="text-slate-500 text-sm line-clamp-2 mt-2 leading-relaxed">{ticket.description}</p>
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                       <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                         <Clock size={14} /> {new Date(ticket.createdAt).toLocaleDateString()}
                       </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <div className="py-24 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <LifeBuoy size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-xl text-gray-700 font-bold">No tickets yet.</p>
                <p className="text-gray-500 mt-1">When you encounter an issue, it will show up here.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
