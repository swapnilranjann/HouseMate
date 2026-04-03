import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { updateProfile, changePassword } from '../services/api';
import { User, Mail, Phone, Lock, Save, UserCircle, Key, Palette, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import DashboardHeader from '../components/DashboardHeader';

const ProfilePage = () => {
  const { user, login } = useAuth();
  const { primaryColor, setPrimaryColor } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [focus, setFocus] = useState(null);

  const themeColors = [
    { name: 'Sunset Orange', color: '#C2410C' },
    { name: 'Enterprise Blue', color: '#1E40AF' },
    { name: 'Forest Green', color: '#065F46' },
    { name: 'Royal Purple', color: '#6D28D9' },
    { name: 'Slate Gray', color: '#334155' },
    { name: 'Deep Crimson', color: '#991B1B' },
    { name: 'Midnight', color: '#111827' },
    { name: 'Ocean', color: '#0369A1' },
    { name: 'Emerald', color: '#047857' },
  ];

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await updateProfile(profileData);
      login(data.data, localStorage.getItem('house_token')); 
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
    <div className="max-w-4xl mx-auto py-6">
      <DashboardHeader 
        title="Account Central"
        subtitle="Manage your identity, security, and interface preferences."
        icon={UserCircle}
        roleLabel="Identity Management"
        stats={[
           { label: "Account Type", value: (user?.role || 'User').toUpperCase() },
           { label: "Account Status", value: "Verified", highlight: true }
        ]}
      />

      <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden mt-8">
          <div className="flex border-b border-gray-200 bg-gray-50/50 overflow-x-auto no-scrollbar">
              <button 
                  onClick={() => setActiveTab('profile')}
                  className={`px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2 whitespace-nowrap ${activeTab === 'profile' ? 'border-primary' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
                  style={{ color: activeTab === 'profile' ? primaryColor : undefined, borderColor: activeTab === 'profile' ? primaryColor : undefined }}
              >
                  Account Details
              </button>
              <button 
                  onClick={() => setActiveTab('password')}
                  className={`px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2 whitespace-nowrap ${activeTab === 'password' ? 'border-primary' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
                  style={{ color: activeTab === 'password' ? primaryColor : undefined, borderColor: activeTab === 'password' ? primaryColor : undefined }}
              >
                  Security
              </button>
              <button 
                  onClick={() => setActiveTab('theme')}
                  className={`px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2 whitespace-nowrap ${activeTab === 'theme' ? 'border-primary' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
                  style={{ color: activeTab === 'theme' ? primaryColor : undefined, borderColor: activeTab === 'theme' ? primaryColor : undefined }}
              >
                  Interface Theme
              </button>
          </div>

          <div className="p-10 md:p-14">
                <AnimatePresence mode="wait">
                    {activeTab === 'profile' && (
                        <motion.form key="profile" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleProfileUpdate} className="max-w-md">
                            <div className="space-y-8">
                                <div>
                                    <label className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Legal Full Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" size={16} style={{ color: focus === 'name' ? primaryColor : undefined }}/>
                                        <input 
                                            type="text" 
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-sm outline-none focus:border-primary text-xs font-bold uppercase tracking-tight transition-all" 
                                            style={{ borderColor: focus === 'name' ? primaryColor : undefined }}
                                            placeholder="Your Name"
                                            value={profileData.name} 
                                            onChange={e => setProfileData({...profileData, name: e.target.value})} 
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Email Identifier</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 transition-colors" size={16} />
                                        <input 
                                            type="email" 
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-sm outline-none focus:border-primary text-xs font-bold transition-all" 
                                            placeholder="Your Email"
                                            value={profileData.email} 
                                            onChange={e => setProfileData({...profileData, email: e.target.value})} 
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Contact Phone</label>
                                    <div className="relative group">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 transition-colors" size={16} />
                                        <input 
                                            type="tel" 
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-sm outline-none focus:border-primary text-xs font-bold transition-all" 
                                            placeholder="Your Phone Number"
                                            value={profileData.phone} 
                                            onChange={e => setProfileData({...profileData, phone: e.target.value})} 
                                        />
                                    </div>
                                </div>
                            </div>
                            <button type="submit" disabled={loading} className="btn-primary mt-12 px-10 h-12 uppercase text-[11px] tracking-widest" style={{ backgroundColor: primaryColor }}>
                                <Save size={16} /> {loading ? 'Processing...' : 'Apply Changes'}
                            </button>
                        </motion.form>
                    )}

                    {activeTab === 'password' && (
                        <motion.form key="password" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} onSubmit={handlePasswordChange} className="max-w-md">
                            <div className="space-y-8">
                                <div>
                                    <label className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Current Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                        <input 
                                            type="password" 
                                            required 
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-sm outline-none focus:border-primary text-xs font-bold transition-all" 
                                            placeholder="••••••••"
                                            value={passwordData.oldPassword} 
                                            onChange={e => setPasswordData({...passwordData, oldPassword: e.target.value})} 
                                        />
                                    </div>
                                </div>
                                <div className="pt-8 border-t border-gray-100">
                                    <label className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1 text-primary" style={{ color: primaryColor }}>Generate New Access Key</label>
                                    <input 
                                        type="password" 
                                        required 
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-sm outline-none focus:border-primary text-xs font-bold mb-6 transition-all" 
                                        placeholder="Min. 8 characters"
                                        value={passwordData.newPassword} 
                                        onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} 
                                    />
                                    <label className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Confirm New Key</label>
                                    <input 
                                        type="password" 
                                        required 
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-sm outline-none focus:border-primary text-xs font-bold transition-all" 
                                        placeholder="Repeat new password"
                                        value={passwordData.confirmPassword} 
                                        onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})} 
                                    />
                                </div>
                            </div>
                            <button type="submit" disabled={loading} className="btn-primary mt-12 px-10 h-12 uppercase text-[11px] tracking-widest" style={{ backgroundColor: primaryColor }}>
                                <Key size={16} /> {loading ? 'Verifying...' : 'Update Password'}
                            </button>
                        </motion.form>
                    )}

                    {activeTab === 'theme' && (
                        <motion.div key="theme" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-8 ml-1">Platform Interface Colors</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                {themeColors.map(c => (
                                    <button 
                                        key={c.color}
                                        onClick={() => setPrimaryColor(c.color)}
                                        className={`group p-4 rounded-sm border transition-all text-left flex items-center gap-4 ${primaryColor === c.color ? 'bg-white border-gray-200 shadow-lg' : 'bg-gray-50 border-gray-100 hover:bg-white hover:border-gray-200'}`}
                                    >
                                        <div 
                                            className="w-10 h-10 rounded-sm shrink-0 flex items-center justify-center shadow-sm"
                                            style={{ backgroundColor: c.color }}
                                        >
                                            {primaryColor === c.color && <Check size={18} className="text-white" />}
                                        </div>
                                        <div>
                                            <p className={`text-[9px] font-black uppercase tracking-widest ${primaryColor === c.color ? 'text-gray-900' : 'text-gray-400'}`}>{c.name}</p>
                                            <p className="text-[10px] font-bold text-gray-300 mt-0.5">{c.color}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            
                            <div className="mt-12 p-8 bg-gray-50 border border-gray-100 rounded-sm">
                                <div className="flex items-center gap-2 mb-2">
                                    <Palette size={14} style={{ color: primaryColor }} />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Preview Mode</span>
                                </div>
                                <p className="text-[11px] font-medium text-gray-400 leading-relaxed">
                                    Selecting a theme color updates the primary accent across the entire HouseMate ecosystem, 
                                    including navigation, buttons, and status indicators. Preferences are saved locally to your device.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
          </div>
      </div>
    </div>
  );
};

export default ProfilePage;
