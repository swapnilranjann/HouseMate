import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { forgotPassword } from '../services/api';
import { Mail, ArrowLeft, RefreshCw, KeyRound, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await forgotPassword(email);
            toast.success(data.message);
            setIsSent(true);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Password reset failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-80px)] bg-slate-50 py-12 px-4 shadow-inner">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden transform transition-all hover:scale-[1.01]">
                {!isSent ? (
                    <div className="p-10">
                        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-indigo-100/50">
                            <KeyRound size={28} />
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Recover Password</h1>
                        <p className="text-slate-500 mb-8 font-medium">Enter your email and we'll send you a link to reset your password safely.</p>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-800 mb-2">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                        <Mail size={18} />
                                    </div>
                                    <input 
                                        type="email" 
                                        required 
                                        className="pl-12 w-full py-4 bg-slate-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 font-medium transition-all" 
                                        placeholder="Enter your email" 
                                        value={email} 
                                        onChange={e => setEmail(e.target.value)} 
                                    />
                                </div>
                            </div>

                            <button type="submit" disabled={loading} className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-bold transition-all shadow-lg flex items-center justify-center gap-2">
                                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} /> {loading ? 'Checking Account...' : 'Request Reset Link'}
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <Link to="/customer/login" className="text-slate-500 text-sm font-bold flex items-center justify-center gap-2 group hover:text-indigo-600 transition-colors">
                                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Wait, I remember my password
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6 mx-auto shadow-sm border border-green-100">
                            <Mail size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Reset link sent!</h2>
                        <p className="text-slate-500 mb-8 font-medium">We have sent the recovery instructions to <span className="text-indigo-600 font-bold">{email}</span>. Please check your inbox.</p>
                        <Link to="/customer/login" className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all">
                            Back to Sign In <ArrowRight size={18} />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
