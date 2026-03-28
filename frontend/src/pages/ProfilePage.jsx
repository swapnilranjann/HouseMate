import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile, changePassword } from '../services/api';
import { User, Mail, Phone, Lock, Save, ShieldCheck, UserCircle, Briefcase, Key, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardHeader from '../components/DashboardHeader';

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
      login(data, localStorage.getItem('house_token')); 
      toast.success('Identity profile updated successfully!');
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
      toast.success('Security credentials changed successfully!');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password change failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <DashboardHeader 
        title={<>Account <span className="text-indigo-600">Protocol</span></>}
        subtitle={`Managing your personal identity across the HouseMate ecosystem. Logged in as verified ${user.role}.`}
        icon={UserCircle}
        roleLabel="Identity Management"
        accentColor="indigo"
        stats={[
           { label: "Account Role", value: user.role.toUpperCase() },
           { label: "Identity Verified", value: "YES", highlight: true }
        ]}
      />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden">
            
            {/* Nav Tabs */}
            <div className="flex border-b border-slate-100 bg-slate-50/50">
                <button 
                    onClick={() => setActiveTab('profile')}
                    className={`flex-1 py-8 text-[11px] font-black uppercase tracking-[0.25em] transition-all border-b-4 ${activeTab === 'profile' ? 'text-indigo-600 border-indigo-600 bg-white scale-105' : 'text-slate-400 hover:text-slate-900 border-transparent'}`}
                >
                    Account Credentials
                </button>
                <button 
                    onClick={() => setActiveTab('password')}
                    className={`flex-1 py-8 text-[11px] font-black uppercase tracking-[0.25em] transition-all border-b-4 ${activeTab === 'password' ? 'text-indigo-600 border-indigo-600 bg-white scale-105' : 'text-slate-400 hover:text-slate-900 border-transparent'}`}
                >
                    Security Protocol
                </button>
            </div>

            <div className="p-14 md:p-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-20 opacity-[0.03] scale-150 rotate-12">
                   <ShieldCheck size={200} />
                </div>
                
                <AnimatePresence mode="wait">
                    {activeTab === 'profile' ? (
                        <form onSubmit={handleProfileUpdate} className="space-y-10 max-w-md mx-auto relative z-10">
                            <div className="space-y-8">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Verified Persona Name</label>
                                    <div className="relative">
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                        <input type="text" className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all font-bold text-xs" value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Secure Email Frequency</label>
                                    <div className="relative">
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                        <input type="email" className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all font-bold text-xs" value={profileData.email} onChange={e => setProfileData({...profileData, email: e.target.value})} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Contact Signal</label>
                                    <div className="relative">
                                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                        <input type="tel" className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all font-bold text-xs" value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} />
                                    </div>
                                </div>
                            </div>
                            <button type="submit" disabled={loading} className="w-full py-5 bg-slate-900 hover:bg-black text-white rounded-2xl font-black tracking-[0.3em] text-[11px] shadow-2xl transition-all hover:-translate-y-1 flex items-center justify-center gap-3 active:scale-95">
                                <Save size={18} /> {loading ? 'SAVING DATA...' : 'UPDATE IDENTITY RECORD'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handlePasswordChange} className="space-y-10 max-w-md mx-auto relative z-10">
                            <div className="space-y-8">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Current Encryption Key (Password)</label>
                                    <div className="relative">
                                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                        <input type="password" required className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all font-bold text-xs" value={passwordData.oldPassword} onChange={e => setPasswordData({...passwordData, oldPassword: e.target.value})} />
                                    </div>
                                </div>
                                <div className="h-px bg-slate-100 my-4"></div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">New Protocol Key</label>
                                    <input type="password" required className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all font-bold text-xs" value={passwordData.newPassword} onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Retype Protocol Key</label>
                                    <input type="password" required className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all font-bold text-xs" value={passwordData.confirmPassword} onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})} />
                                </div>
                            </div>
                            <button type="submit" disabled={loading} className="w-full py-5 bg-indigo-600 hover:bg-black text-white rounded-2xl font-black tracking-[0.3em] text-[11px] shadow-2xl transition-all hover:-translate-y-1 flex items-center justify-center gap-3 active:scale-95">
                                <Key size={18} /> {loading ? 'RELAYING KEY...' : 'ACTIVATE NEW SECURITY PROTOCOL'}
                            </button>
                        </form>
                    )}
                </AnimatePresence>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
