import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile, changePassword } from '../services/api';
import { User, Mail, Phone, Lock, Save, UserCircle, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
        title="Profile Settings"
        subtitle="Manage your personal information and security preferences."
        icon={UserCircle}
        roleLabel="Settings"
        stats={[
           { label: "Role", value: user.role.toUpperCase() },
           { label: "Status", value: "Verified", highlight: true }
        ]}
      />

      <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-200">
              <button 
                  onClick={() => setActiveTab('profile')}
                  className={`px-8 py-4 text-[11px] font-bold uppercase tracking-widest transition-all border-b-2 ${activeTab === 'profile' ? 'text-[#C2410C] border-[#C2410C]' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
              >
                  Account Details
              </button>
              <button 
                  onClick={() => setActiveTab('password')}
                  className={`px-8 py-4 text-[11px] font-bold uppercase tracking-widest transition-all border-b-2 ${activeTab === 'password' ? 'text-[#C2410C] border-[#C2410C]' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
              >
                  Security
              </button>
          </div>

          <div className="p-8 md:p-12">
                <AnimatePresence mode="wait">
                    {activeTab === 'profile' ? (
                        <motion.form key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleProfileUpdate} className="max-w-lg">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                        <input 
                                            type="text" 
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded outline-none focus:border-[#C2410C] text-sm font-medium" 
                                            placeholder="Your Name"
                                            value={profileData.name} 
                                            onChange={e => setProfileData({...profileData, name: e.target.value})} 
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                        <input 
                                            type="email" 
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded outline-none focus:border-[#C2410C] text-sm font-medium" 
                                            placeholder="Your Email"
                                            value={profileData.email} 
                                            onChange={e => setProfileData({...profileData, email: e.target.value})} 
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                        <input 
                                            type="tel" 
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded outline-none focus:border-[#C2410C] text-sm font-medium" 
                                            placeholder="Your Phone Number"
                                            value={profileData.phone} 
                                            onChange={e => setProfileData({...profileData, phone: e.target.value})} 
                                        />
                                    </div>
                                </div>
                            </div>
                            <button type="submit" disabled={loading} className="btn-primary mt-10 px-10 h-11">
                                <Save size={16} /> {loading ? 'Saving...' : 'Update Details'}
                            </button>
                        </motion.form>
                    ) : (
                        <motion.form key="password" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handlePasswordChange} className="max-w-lg">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Current Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                        <input 
                                            type="password" 
                                            required 
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded outline-none focus:border-[#C2410C] text-sm font-medium" 
                                            placeholder="••••••••"
                                            value={passwordData.oldPassword} 
                                            onChange={e => setPasswordData({...passwordData, oldPassword: e.target.value})} 
                                        />
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-gray-100">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">New Password</label>
                                    <input 
                                        type="password" 
                                        required 
                                        className="w-full px-4 py-2 border border-gray-300 rounded outline-none focus:border-[#C2410C] text-sm font-medium mb-6" 
                                        placeholder="Min. 8 characters"
                                        value={passwordData.newPassword} 
                                        onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} 
                                    />
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Confirm Password</label>
                                    <input 
                                        type="password" 
                                        required 
                                        className="w-full px-4 py-2 border border-gray-300 rounded outline-none focus:border-[#C2410C] text-sm font-medium" 
                                        placeholder="Repeat new password"
                                        value={passwordData.confirmPassword} 
                                        onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})} 
                                    />
                                </div>
                            </div>
                            <button type="submit" disabled={loading} className="btn-primary mt-10 px-10 h-11">
                                <Key size={16} /> {loading ? 'Updating...' : 'Update Password'}
                            </button>
                        </motion.form>
                    )}
                </AnimatePresence>
          </div>
      </div>
    </div>
  );
};

export default ProfilePage;
