import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/api';
import { Lock, Mail, User, ShieldCheck, ChevronRight, Building } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const CustomerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await loginUser({ email, password, role: 'customer' });
      login(data.user, data.token);
      toast.success(`Welcome back, ${data.user.name.split(' ')[0]}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-white flex-row-reverse">
      
      {/* Visual Identity Side */}
      <div className="hidden lg:block lg:w-1/2 relative bg-slate-900 overflow-hidden">
        <motion.img 
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.6, scale: 1 }}
          transition={{ duration: 1.2 }}
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200" 
          alt="Luxury Living Room" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent flex flex-col justify-end p-20">
            <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-6xl font-serif font-black text-white mb-6 leading-tight uppercase italic-none tracking-tighter"
            >
                Find Your <br/> Perfect Home.
            </motion.h2>
            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-slate-400 text-xl font-medium max-w-md leading-relaxed"
            >
                Browse thousands of verified, exclusive properties directly from owners.
            </motion.p>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white relative">
        <div className="w-full max-w-md">
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
              <div className="w-16 h-16 bg-slate-900 text-white rounded-[1.5rem] flex items-center justify-center mb-8 shadow-2xl">
                  <User size={32} />
              </div>
              <h1 className="text-5xl font-serif font-black text-slate-900 mb-4 tracking-tighter uppercase italic-none">Customer login</h1>
              <p className="text-slate-400 font-medium text-lg leading-relaxed">Sign in to your account to save favorites and chat with owners.</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Identity Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-300 group-focus-within:text-indigo-600 transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                    type="email" 
                    required 
                    className="pl-14 w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-8 focus:ring-indigo-600/5 focus:border-indigo-600 focus:bg-white text-xs font-black uppercase tracking-widest outline-none transition-all hover:bg-white" 
                    placeholder="ENTER YOUR EMAIL..." 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Secure Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-300 group-focus-within:text-indigo-600 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                    type="password" 
                    required 
                    className="pl-14 w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-8 focus:ring-indigo-600/5 focus:border-indigo-600 focus:bg-white text-xs font-black uppercase tracking-widest outline-none transition-all hover:bg-white" 
                    placeholder="ENTER YOUR PASSWORD..." 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                />
              </div>
              <div className="flex justify-end pt-2">
                <Link to="/forgot-password" virtual="true" className="text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:text-slate-900 transition-colors">Forgot password?</Link>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-6 bg-slate-900 hover:bg-black text-white rounded-2xl md:rounded-3xl font-black tracking-[0.4em] text-[12px] shadow-2xl transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50 mt-4 uppercase border border-slate-900">
              {loading ? 'Authenticating...' : 'Sign In Now'}
            </button>
          </form>

          <div className="mt-12 flex flex-col gap-6">
              <div className="pt-10 border-t border-slate-50 flex items-center justify-between text-[11px] font-black uppercase tracking-widest">
                <span className="text-slate-400">No account yet?</span>
                <Link to="/customer/register" className="text-indigo-600 hover:text-slate-900 border-b-2 border-indigo-600/10 hover:border-slate-900 transition-all pb-1">Create Account</Link>
              </div>

              {/* Portal Switcher to prevent confusion */}
              <Link to="/tenant/login" className="flex items-center justify-between p-6 bg-indigo-50/30 rounded-3xl border border-indigo-100 hover:bg-indigo-50 transition-all group">
                <div className="flex items-center gap-4">
                    <div className="bg-white p-2 rounded-xl border border-indigo-100 text-indigo-600 shadow-sm group-hover:scale-110 transition-transform">
                        <Building size={18} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 leading-none mb-1">Are you a property owner?</p>
                        <p className="text-[9px] font-medium text-indigo-400 uppercase tracking-widest">Switch to Owner Portal</p>
                    </div>
                </div>
                <ChevronRight size={16} className="text-indigo-600 group-hover:translate-x-1 transition-transform" />
              </Link>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="absolute top-10 right-10 hidden xl:flex items-center gap-3 bg-slate-50/50 px-4 py-2 rounded-full border border-slate-100 backdrop-blur-sm">
            <ShieldCheck size={14} className="text-indigo-600" />
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Home Seeker Node</span>
        </div>
      </div>
    </div>
  );
};

export default CustomerLogin;
