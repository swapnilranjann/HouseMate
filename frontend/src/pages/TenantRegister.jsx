import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';
import { Lock, Mail, Building, User, Phone, ArrowRight, ShieldCheck, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const TenantRegister = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', role: 'tenant' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser(formData);
      toast.success('Partner account created! Sign in to command your portfolio.');
      navigate('/tenant/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-white">
      
      {/* High-End Split Imagery */}
      <div className="hidden lg:block lg:w-1/2 relative bg-slate-900 overflow-hidden text-sky-400">
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.7 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200" 
          alt="Modern Architecture" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent flex flex-col justify-end p-20">
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="max-w-md"
            >
                <div className="w-12 h-1 bg-sky-500 mb-8 rounded-full"></div>
                <h2 className="text-6xl font-serif font-black text-white mb-6 leading-tight uppercase italic-none tracking-tighter">Grow Your <br/> Portfolio.</h2>
                <p className="text-slate-400 text-xl font-medium leading-relaxed">Join premier property owners worldwide who trust HouseMate to command their high-end real estate assets.</p>
            </motion.div>
        </div>
      </div>

      {/* Boutique Form Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white relative">
        <div className="w-full max-w-md text-sky-900">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="mb-12"
          >
              <div className="w-16 h-16 bg-slate-900 text-white rounded-[1.5rem] flex items-center justify-center mb-8 shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
                  <Building size={32} />
              </div>
              <h1 className="text-5xl font-serif font-black text-slate-900 mb-4 tracking-tighter uppercase italic-none">Owner Access</h1>
              <p className="text-slate-400 font-medium text-lg leading-relaxed">Register your company to list and manage your properties with absolute precision.</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-2"
            >
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Business Entity Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-300 group-focus-within:text-sky-600 transition-colors">
                  <User size={18} />
                </div>
                <input 
                    type="text" 
                    required 
                    className="pl-14 w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-8 focus:ring-sky-500/5 focus:border-sky-500 focus:bg-white transition-all font-black text-[11px] uppercase tracking-widest outline-none hover:shadow-md" 
                    placeholder="ENTER YOUR BUSINESS NAME..." 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                />
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Contact Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-300 group-focus-within:text-sky-600 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input 
                    type="email" 
                    required 
                    className="pl-14 w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-8 focus:ring-sky-500/5 focus:border-sky-500 focus:bg-white transition-all font-black text-[11px] uppercase tracking-widest outline-none hover:shadow-md" 
                    placeholder="BUSINESS@EMAIL.COM" 
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                  />
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Phone</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-300 group-focus-within:text-sky-600 transition-colors">
                    <Phone size={18} />
                  </div>
                  <input 
                    type="tel" 
                    required 
                    className="pl-14 w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-8 focus:ring-sky-500/5 focus:border-sky-500 focus:bg-white transition-all font-black text-[11px] uppercase tracking-widest outline-none hover:shadow-md" 
                    placeholder="+1 234 567 890" 
                    value={formData.phone} 
                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                  />
                </div>
              </motion.div>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
            >
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Command Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-300 group-focus-within:text-sky-600 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                    type="password" 
                    required 
                    className="pl-14 w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-8 focus:ring-sky-500/5 focus:border-sky-500 focus:bg-white transition-all font-black text-[11px] uppercase tracking-widest outline-none hover:shadow-md" 
                    placeholder="MINIMUM 8 CHARACTERS..." 
                    value={formData.password} 
                    onChange={e => setFormData({...formData, password: e.target.value})} 
                />
              </div>
            </motion.div>

            <motion.button 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                type="submit" 
                disabled={loading} 
                className="w-full py-6 bg-slate-900 border border-slate-900 hover:bg-black text-white rounded-2xl md:rounded-3xl font-black tracking-[0.4em] text-[12px] shadow-2xl transition-all hover:-translate-y-1 flex items-center justify-center gap-4 active:scale-95 uppercase mt-6"
            >
              {loading ? 'Creating Record...' : 'Complete Owner Registration'} <ArrowRight size={20} />
            </motion.button>
          </form>

          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.7 }}
            className="mt-12 pt-10 border-t border-slate-50 flex items-center justify-between text-[11px] font-black uppercase tracking-widest"
          >
            <span className="text-slate-400">Already part of HouseMate?</span>
            <Link to="/tenant/login" className="text-sky-600 hover:text-slate-900 border-b-2 border-sky-600/10 hover:border-slate-900 transition-all pb-1">Owner Sign In</Link>
          </motion.div>
        </div>

        {/* Floating Trust Indicator */}
        <div className="absolute top-10 right-10 hidden xl:flex items-center gap-3 bg-slate-50/50 px-4 py-2 rounded-full border border-slate-100 backdrop-blur-sm">
            <ShieldCheck size={14} className="text-sky-600" />
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Premier Partner Access</span>
        </div>
      </div>
    </div>
  );
};

export default TenantRegister;
