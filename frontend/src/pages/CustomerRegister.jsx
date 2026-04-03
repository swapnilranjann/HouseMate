import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerUser, loginUser } from '../services/api';
import { User, Mail, Phone, Lock, ChevronRight, Building } from 'lucide-react';
import toast from 'react-hot-toast';

const CustomerRegister = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', role: 'customer' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser(formData);
      const { data } = await loginUser({ email: formData.email, password: formData.password, role: 'customer' });
      login(data.data.user, data.data.token);
      toast.success('Registration successful. Welcome to HouseMate!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-white">
      <div className="hidden lg:block lg:w-1/2 relative bg-gray-900 border-r border-gray-200 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1560448204-61dc36dc98ce?q=80&w=1200" 
          alt="Modern Home" 
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent flex flex-col justify-end p-16">
            <h2 className="text-4xl font-bold text-white mb-4 uppercase tracking-tight">Verified Listings</h2>
            <p className="text-gray-400 text-lg font-medium max-w-sm">Join our platform to find and secure your next home with ease.</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#F8FAFC]">
        <div className="w-full max-w-md bg-white p-10 rounded border border-gray-200 shadow-sm">
          <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2 uppercase tracking-widest">Customer Registration</h1>
              <p className="text-gray-500 font-medium text-sm">Create an account to start your search.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                <input 
                    type="text" 
                    required 
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded outline-none focus:border-primary text-sm font-medium" 
                    style={{ '--tw-ring-color': 'transparent' }}
                    placeholder="John Doe" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input 
                        type="email" 
                        required 
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded outline-none focus:border-primary text-sm font-medium" 
                        style={{ '--tw-ring-color': 'transparent' }}
                        placeholder="email@example.com" 
                        value={formData.email} 
                        onChange={e => setFormData({...formData, email: e.target.value})} 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Phone</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input 
                        type="tel" 
                        required 
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded outline-none focus:border-primary text-sm font-medium" 
                        style={{ '--tw-ring-color': 'transparent' }}
                        placeholder="Phone Number" 
                        value={formData.phone} 
                        onChange={e => setFormData({...formData, phone: e.target.value})} 
                    />
                  </div>
                </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                <input 
                    type="password" 
                    required 
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded outline-none focus:border-primary text-sm font-medium" 
                    style={{ '--tw-ring-color': 'transparent' }}
                    placeholder="••••••••" 
                    value={formData.password} 
                    onChange={e => setFormData({...formData, password: e.target.value})} 
                />
              </div>
            </div>

            <button type="submit" disabled={loading} style={{ backgroundColor: 'var(--primary)' }} className="text-white w-full h-11 uppercase text-[11px] tracking-widest font-bold rounded flex justify-center items-center hover:opacity-90 transition-opacity mt-4">
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col gap-4">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest">
                <span className="text-gray-400">Already have an account?</span>
                <Link to="/customer/login" style={{ color: 'var(--primary)' }} className="hover:underline">Sign In</Link>
              </div>

              <Link to="/tenant/register" className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded group hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                    <Building size={16} className="text-gray-400" />
                    <div>
                        <p className="text-[9px] font-bold text-gray-900 uppercase tracking-widest mb-0.5">Are you an owner?</p>
                        <p className="text-[8px] font-bold uppercase tracking-widest" style={{ color: 'var(--primary)' }}>Register as Owner</p>
                    </div>
                </div>
                <ChevronRight size={14} className="text-gray-300 transition-colors" />
              </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerRegister;
