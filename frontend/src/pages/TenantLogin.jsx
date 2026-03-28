import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/api';
import { Lock, Mail, Building } from 'lucide-react';

const TenantLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await loginUser({ email, password });
      if (data.user.role !== 'tenant') {
        setError('Incorrect portal. Please use the Customer login.');
        return;
      }
      login(data.user, data.token);
      navigate('/tenant-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-white">
      {/* Left side: Beautiful Real Estate Image */}
      <div className="hidden lg:block lg:w-1/2 relative bg-gray-900">
        <img 
          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200" 
          alt="Luxury Property" 
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent flex flex-col justify-end p-12">
            <h2 className="text-4xl font-extrabold text-white mb-2">Partner with us.</h2>
            <p className="text-gray-200 text-lg w-3/4">Access thousands of pre-approved renters looking for premium properties on HouseMate.</p>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white">
        <div className="w-full max-w-md">
            
          <div className="mb-10">
              <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center mb-6 border border-sky-200">
                  <Building size={24} />
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Owner Portal</h1>
              <p className="text-gray-500 text-base">Sign in to manage your property listings and engage with tenants.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 font-medium text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Corporate Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Mail size={20} />
                </div>
                <input 
                    type="email" 
                    required 
                    className="pl-12 w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-gray-900 transition-shadow bg-gray-50 hover:bg-white" 
                    placeholder="Enter your email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
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
                    className="pl-12 w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-gray-900 transition-shadow bg-gray-50 hover:bg-white" 
                    placeholder="Enter your password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-4 px-6 border border-transparent rounded-xl shadow-sm text-base font-bold text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all disabled:opacity-50 mt-4">
              {loading ? 'Authenticating...' : 'Sign In as Owner'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100 flex items-center justify-between text-sm">
            <span className="text-gray-500">Not listed yet?</span>
            <Link to="/tenant/register" className="font-bold text-sky-600 hover:text-sky-500 tracking-wide">
                Register Property
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantLogin;
