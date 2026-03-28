import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';
import { Lock, Mail, User, Phone, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const CustomerRegister = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', role: 'customer' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser(formData);
      toast.success('Registration successful! Please login.');
      navigate('/customer/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-white flex-row-reverse">
      <div className="hidden lg:block lg:w-1/2 relative bg-indigo-900 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1200" 
          alt="Modern Architecture" 
          className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-1000 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/90 via-indigo-900/30 to-transparent flex flex-col justify-end p-12">
            <div className="w-16 h-1 bg-indigo-500 mb-6 rounded-full"></div>
            <h2 className="text-4xl font-extrabold text-white mb-2 leading-tight">Your next chapter <br/> starts here.</h2>
            <p className="text-indigo-100 text-lg w-3/4">Join a community of thousands finding their perfect slice of the world.</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6 border border-indigo-200">
                  <User size={24} />
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Create Account</h1>
              <p className="text-gray-500 text-base">Sign up to safely browse and contact property owners.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <User size={20} />
                </div>
                <input type="text" required className="pl-12 w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-gray-50 font-medium" placeholder="Full name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Mail size={18} />
                  </div>
                  <input type="email" required className="pl-12 w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-gray-50 font-medium text-sm" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Phone size={18} />
                  </div>
                  <input type="tel" required className="pl-12 w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-gray-50 font-medium text-sm" placeholder="+1..." value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Lock size={20} />
                </div>
                <input type="password" required className="pl-12 w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-gray-50 font-medium" placeholder="Secret password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2">
              {loading ? 'Registering...' : 'Complete Registration'} <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between text-sm">
            <span className="text-gray-500">Already have an account?</span>
            <Link to="/customer/login" className="font-bold text-indigo-600 hover:text-indigo-500">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerRegister;
