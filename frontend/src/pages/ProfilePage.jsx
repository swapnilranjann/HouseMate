import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile, changePassword } from '../services/api';
import { User, Mail, Phone, Lock, Save, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, login } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await updateProfile(profileData);
      login(data, localStorage.getItem('house_token')); // Refresh context
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    setLoading(true);
    try {
      await changePassword({ oldPassword: passwordData.oldPassword, newPassword: passwordData.newPassword });
      toast.success('Password changed successfully!');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password change failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 p-8 md:p-12 text-white relative">
            <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                <div className="w-24 h-24 rounded-2xl bg-indigo-500 flex items-center justify-center text-4xl font-bold shadow-xl border-4 border-slate-800">
                    {user?.name?.[0]}
                </div>
                <div className="text-center md:text-left">
                    <h1 className="text-3xl font-extrabold tracking-tight">{user?.name}</h1>
                    <p className="text-slate-400 font-medium uppercase tracking-widest text-xs mt-1">{user?.role} Account</p>
                </div>
            </div>
            {/* Background geometric shapes */}
            <div className="absolute top-0 right-0 p-12 opacity-10">
                <ShieldCheck size={120} />
            </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
            <button 
                onClick={() => setActiveTab('profile')}
                className={`flex-1 py-4 text-sm font-bold transition-all ${activeTab === 'profile' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/10' : 'text-slate-400 hover:bg-gray-50'}`}
            >
                Account Information
            </button>
            <button 
                onClick={() => setActiveTab('password')}
                className={`flex-1 py-4 text-sm font-bold transition-all ${activeTab === 'password' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/10' : 'text-slate-400 hover:bg-gray-50'}`}
            >
                Security Settings
            </button>
        </div>

        <div className="p-8 md:p-12">
            {activeTab === 'profile' ? (
                <form onSubmit={handleProfileUpdate} className="space-y-6 max-w-lg mx-auto">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Display Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                    <User size={18} />
                                </div>
                                <input type="text" className="pl-12 w-full py-3 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium" value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                    <Mail size={18} />
                                </div>
                                <input type="email" className="pl-12 w-full py-3 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium" value={profileData.email} onChange={e => setProfileData({...profileData, email: e.target.value})} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                    <Phone size={18} />
                                </div>
                                <input type="tel" className="pl-12 w-full py-3 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium" value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} />
                            </div>
                        </div>
                    </div>
                    <button type="submit" disabled={loading} className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2">
                        <Save size={18} /> {loading ? 'Saving Changes...' : 'Save Profile'}
                    </button>
                </form>
            ) : (
                <form onSubmit={handlePasswordChange} className="space-y-6 max-w-lg mx-auto">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Current Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                    <Lock size={18} />
                                </div>
                                <input type="password" required className="pl-12 w-full py-3 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium" value={passwordData.oldPassword} onChange={e => setPasswordData({...passwordData, oldPassword: e.target.value})} />
                            </div>
                        </div>
                        <div className="h-px bg-gray-100 my-4"></div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">New Password</label>
                            <input type="password" required className="w-full py-3 px-4 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium" value={passwordData.newPassword} onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Confirm New Password</label>
                            <input type="password" required className="w-full py-3 px-4 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium" value={passwordData.confirmPassword} onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})} />
                        </div>
                    </div>
                    <button type="submit" disabled={loading} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2">
                        <ShieldCheck size={18} /> {loading ? 'Updating Security...' : 'Update Password'}
                    </button>
                </form>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
