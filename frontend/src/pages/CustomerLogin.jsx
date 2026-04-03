import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/api';
import { Lock, Mail, User, ShieldCheck, ChevronRight, Building } from 'lucide-react';
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
    <div className="flex min-h-[calc(100vh-64px)] bg-white">
      <div className="hidden lg:block lg:w-1/2 relative bg-gray-900 border-r border-gray-200 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200" 
          alt="Modern Architecture" 
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent flex flex-col justify-end p-16">
            <h2 className="text-4xl font-bold text-white mb-4 uppercase tracking-tight">HouseMate Enterprise</h2>
            <p className="text-gray-400 text-lg font-medium max-w-sm">Verified properties directly from trusted owners.</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#F8FAFC]">
        <div className="w-full max-w-md bg-white p-10 rounded border border-gray-200 shadow-sm">
          <div className="mb-10">
              <div className="w-12 h-12 bg-gray-900 text-white rounded flex items-center justify-center mb-6">
                  <User size={24} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2 uppercase tracking-widest">Customer Login</h1>
              <p className="text-gray-500 font-medium text-sm">Sign in to manage your inquiries and favorites.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                <input 
                    type="email" 
                    required 
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded outline-none focus:border-[#C2410C] text-sm font-medium" 
                    placeholder="name@company.com" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                <input 
                    type="password" 
                    required 
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded outline-none focus:border-[#C2410C] text-sm font-medium" 
                    placeholder="••••••••" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                />
              </div>
              <div className="flex justify-end mt-2">
                <Link to="/forgot-password" virtual="true" className="text-[10px] font-bold text-[#C2410C] uppercase tracking-widest hover:underline">Forgot password?</Link>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full h-11 uppercase text-[11px] tracking-widest">
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-gray-100 flex flex-col gap-6">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest">
                <span className="text-gray-400">New user?</span>
                <Link to="/customer/register" className="text-[#C2410C] hover:underline">Create Account</Link>
              </div>

              <Link to="/tenant/login" className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded group hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                    <Building size={16} className="text-gray-400" />
                    <div>
                        <p className="text-[9px] font-bold text-gray-900 uppercase tracking-widest mb-0.5">Are you an owner?</p>
                        <p className="text-[8px] font-bold text-[#C2410C] uppercase tracking-widest">Switch to Owner Portal</p>
                    </div>
                </div>
                <ChevronRight size={14} className="text-gray-300 group-hover:text-[#C2410C] transition-colors" />
              </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerLogin;
