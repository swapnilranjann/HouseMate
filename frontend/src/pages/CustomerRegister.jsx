import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';
import { Lock, Mail, User } from 'lucide-react';

const CustomerRegister = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'customer' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await registerUser(formData);
      navigate('/customer/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-white flex-row-reverse">
      {/* Right side: Beautiful Real Estate Image */}
      <div className="hidden lg:block lg:w-1/2 relative bg-indigo-900 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1200" 
          alt="Modern Architecture" 
          className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-1000 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/90 via-indigo-900/30 to-transparent flex flex-col justify-end p-12">
            <div className="w-16 h-1 bg-indigo-500 mb-6 rounded-full"></div>
            <h2 className="text-4xl font-extrabold text-white mb-2 leading-tight">Your next chapter <br/> starts here.</h2>
            <p className="text-indigo-100 text-lg w-3/4">Join a community of thousands finding their perfect slice of the world without the traditional hassle.</p>
        </div>
      </div>

      {/* Left side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white">
        <div className="w-full max-w-md">
            
          <div className="mb-8">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6 border border-indigo-200 shadow-sm">
                  <User size={24} />
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Create Account</h1>
              <p className="text-gray-500 text-base">Sign up to freely browse and contact property owners.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 font-medium text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <User size={20} />
                </div>
                <input 
                    type="text" 
                    required 
                    className="pl-12 w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 transition-shadow bg-gray-50 hover:bg-white" 
                    placeholder="Enter full name" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Mail size={20} />
                </div>
                <input 
                    type="email" 
                    required 
                    className="pl-12 w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 transition-shadow bg-gray-50 hover:bg-white" 
                    placeholder="you@example.com" 
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Lock size={20} />
                </div>
                <input 
                    type="password" 
                    required 
                    className="pl-12 w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 transition-shadow bg-gray-50 hover:bg-white" 
                    placeholder="Create a strong password" 
                    value={formData.password} 
                    onChange={e => setFormData({...formData, password: e.target.value})} 
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-4 px-6 border border-transparent rounded-xl shadow-md text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-50 mt-4">
              {loading ? 'Processing...' : 'Complete Sign Up'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100 flex items-center justify-between text-sm">
            <span className="text-gray-500">Already a member?</span>
            <Link to="/customer/login" className="font-bold text-indigo-600 hover:text-indigo-500 tracking-wide">
                Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerRegister;
