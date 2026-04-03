import React, { useState, useEffect } from 'react';
import { createSupportTicket, getMyTickets } from '../services/api';
import { LifeBuoy, Send, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
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
      setTickets(data.data);
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
      toast.success('Ticket submitted successfully');
      setFormData({ subject: 'General Question', description: '', priority: 'Normal' });
      setShowForm(false);
      fetchTickets();
    } catch (err) {
      toast.error('Failed to submit ticket');
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Open': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'In Progress': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Resolved': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6">
      <DashboardHeader 
        title="Help & Support"
        subtitle="Contact our support team or browse your previous requests."
        icon={LifeBuoy}
        roleLabel="Support"
        stats={[
          { label: "Active Tickets", value: tickets.filter(t => t.status !== 'Resolved').length },
          { label: "Resolution Rate", value: `${Math.round((tickets.filter(t => t.status === 'Resolved').length / (tickets.length || 1)) * 100)}%` }
        ]}
      />

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 px-4 md:px-0">
          <div className="flex border-b border-gray-100 w-full md:w-auto">
              <button 
                  onClick={() => setShowForm(false)}
                  style={{ borderBottomColor: !showForm ? 'var(--primary)' : 'transparent', color: !showForm ? 'var(--primary)' : '#999' }}
                  className={`px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2`}
              >
                  Operational History
              </button>
              <button 
                  onClick={() => setShowForm(true)}
                  style={{ borderBottomColor: showForm ? 'var(--primary)' : 'transparent', color: showForm ? 'var(--primary)' : '#999' }}
                  className={`px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2`}
              >
                  Initiate Request
              </button>
          </div>
      </div>

      <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
        {showForm ? (
            <div className="p-8 md:p-16 max-w-3xl">
                <h3 className="text-2xl font-black text-gray-900 mb-10 uppercase tracking-[0.2em] border-b border-gray-100 pb-6">Submit Support Protocol</h3>
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3">Service Category</label>
                            <select 
                                className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-sm outline-none focus:border-primary focus:bg-white text-[11px] font-black uppercase tracking-widest transition-all shadow-sm"
                                style={{ borderLeftWidth: '4px', borderLeftColor: 'var(--primary)' }}
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
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3">Priority Level</label>
                            <div className="flex gap-2">
                                {['Low', 'Normal', 'High'].map(p => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setFormData({...formData, priority: p})}
                                        style={{ 
                                            backgroundColor: formData.priority === p ? 'var(--primary)' : 'white',
                                            borderColor: formData.priority === p ? 'var(--primary)' : '#eee',
                                            color: formData.priority === p ? 'white' : '#999'
                                        }}
                                        className={`flex-1 py-3 rounded-sm text-[10px] font-black uppercase tracking-[0.2em] border transition-all shadow-xs`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3">Incident Description</label>
                        <textarea 
                            required
                            rows="6"
                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-sm outline-none focus:border-primary focus:bg-white text-[11px] font-black uppercase tracking-widest transition-all shadow-sm leading-relaxed"
                            style={{ borderLeftWidth: '4px', borderLeftColor: 'var(--primary)' }}
                            placeholder="Provide comprehensive details regarding the operational issue..."
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                        ></textarea>
                    </div>

                    <button 
                        type="submit" 
                        style={{ backgroundColor: 'var(--primary)' }}
                        className="text-white px-12 py-4 rounded-sm font-black text-[10px] uppercase tracking-[0.3em] transition-all flex items-center gap-3 shadow-lg hover:brightness-110 active:scale-[0.98]"
                    >
                        <Send size={16} /> Submit Ticket
                    </button>
                </form>
            </div>
        ) : (
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#FCFDFF] border-b border-gray-100">
                        <tr>
                            <th className="px-8 py-5 text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Temporal Intel</th>
                            <th className="px-8 py-5 text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Subject Identifier</th>
                            <th className="px-8 py-5 text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] text-center">Priority</th>
                            <th className="px-8 py-5 text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] text-center">Status protocol</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map(t => (
                            <tr key={t._id} className="hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-3 text-[11px] text-gray-500 font-black uppercase tracking-widest">
                                        <Clock size={14} style={{ color: 'var(--primary)' }} className="opacity-50" />
                                        {new Date(t.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })}
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-[11px] font-black text-gray-900 uppercase tracking-tight">{t.subject}</td>
                                <td className="px-8 py-5 text-center">
                                    <span 
                                        style={{ color: t.priority === 'High' ? 'var(--primary)' : '#999' }}
                                        className={`text-[9px] font-black uppercase tracking-widest`}
                                    >
                                        {t.priority}
                                    </span>
                                </td>
                                <td className="px-8 py-5 text-center">
                                    <span 
                                        style={{ 
                                            backgroundColor: t.status === 'Resolved' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(var(--primary-rgb), 0.05)',
                                            color: t.status === 'Resolved' ? '#10b981' : 'var(--primary)',
                                            borderColor: t.status === 'Resolved' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(var(--primary-rgb), 0.1)'
                                        }}
                                        className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-sm border`}
                                    >
                                        {t.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {tickets.length === 0 && !loading && (
                    <div className="py-24 text-center">
                         <LifeBuoy size={48} className="mx-auto mb-4 text-gray-100" />
                         <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">Operational history is clear</p>
                    </div>
                )}
                {loading && (
                    <div className="py-24 text-center">
                         <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }}></div>
                         <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">Retrieving Secure Data...</p>
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default SupportPage;
