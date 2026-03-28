import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/api';
import { Lock, Mail, User } from 'lucide-react';
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
      <div className="hidden lg:block lg:w-1/2 relative bg-indigo-900 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200" 
          alt="Luxury Living Room" 
          className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-1000 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/80 via-indigo-900/20 to-transparent flex flex-col justify-end p-12">
            <h2 className="text-4xl font-extrabold text-white mb-2 leading-tight">Find exactly what <br/> you're looking for.</h2>
            <p className="text-indigo-100 text-lg w-3/4">Browse thousands of verified, exclusive properties directly from owners.</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-10">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6 border border-indigo-200 shadow-sm">
                  <User size={24} />
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Welcome Back</h1>
              <p className="text-gray-500 text-base">Sign in to your account to save favorites and chat.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Mail size={20} />
                </div>
                <input type="email" required className="pl-12 w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 transition-shadow bg-gray-50 hover:bg-white" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Lock size={20} />
                </div>
                <input type="password" required className="pl-12 w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 transition-shadow bg-gray-50 hover:bg-white" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <div className="flex justify-end mt-1.5">
                <Link to="/forgot-password" virtual="true" className="text-xs font-bold text-indigo-600 hover:text-indigo-500">Forgot password?</Link>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-4 px-6 border border-transparent rounded-xl shadow-md text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-50 mt-4">
              {loading ? 'Authenticating...' : 'Sign In Now'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100 flex items-center justify-between text-sm">
            <span className="text-gray-500">No account?</span>
            <Link to="/customer/register" className="font-bold text-indigo-600 hover:text-indigo-500">Register Free</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerLogin;
