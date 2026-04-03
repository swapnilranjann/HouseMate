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

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex border-b border-gray-200 w-full md:w-auto">
              <button 
                  onClick={() => setShowForm(false)}
                  className={`px-8 py-3 text-sm font-bold uppercase tracking-widest transition-all border-b-2 ${!showForm ? 'border-[#C2410C] text-[#C2410C]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
              >
                  All Tickets
              </button>
              <button 
                  onClick={() => setShowForm(true)}
                  className={`px-8 py-3 text-sm font-bold uppercase tracking-widest transition-all border-b-2 ${showForm ? 'border-[#C2410C] text-[#C2410C]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
              >
                  New Request
              </button>
          </div>
      </div>

      <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
        {showForm ? (
            <div className="p-8 md:p-12 max-w-2xl">
                <h3 className="text-xl font-bold text-gray-900 mb-8 uppercase border-b border-gray-100 pb-4">Submit a Support Ticket</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Subject Category</label>
                            <select 
                                className="w-full px-4 py-2 border border-gray-300 rounded outline-none focus:border-[#C2410C] text-sm font-medium"
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
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Priority Level</label>
                            <div className="flex gap-2">
                                {['Low', 'Normal', 'High'].map(p => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setFormData({...formData, priority: p})}
                                        className={`flex-1 py-2 rounded text-[10px] font-bold uppercase border transition-all ${formData.priority === p ? 'bg-[#C2410C] border-[#C2410C] text-white' : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'}`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Full Description</label>
                        <textarea 
                            required
                            rows="5"
                            className="w-full px-4 py-2 border border-gray-300 rounded outline-none focus:border-[#C2410C] text-sm font-medium"
                            placeholder="Please explain your issue in detail..."
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                        ></textarea>
                    </div>

                    <button type="submit" className="btn-primary px-10 h-11">
                        <Send size={16} /> Submit Ticket
                    </button>
                </form>
            </div>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#FCFDFF] border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date Reported</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Subject</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Priority</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map(t => (
                            <tr key={t._id} className="table-row-classic">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Clock size={14} className="text-gray-300" />
                                        {new Date(t.createdAt).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm font-bold text-gray-800 uppercase tracking-tight">{t.subject}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`text-[10px] font-bold uppercase ${t.priority === 'High' ? 'text-red-500' : 'text-gray-400'}`}>
                                        {t.priority}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${getStatusStyle(t.status)}`}>
                                        {t.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {tickets.length === 0 && !loading && (
                    <div className="py-20 text-center text-gray-400 font-medium">No support tickets found.</div>
                )}
                {loading && (
                    <div className="py-20 text-center text-gray-400 font-medium">Loading history...</div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default SupportPage;
