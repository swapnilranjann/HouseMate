import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Home, LayoutGrid, MessageSquare, ShieldQuestion, User, LogOut, Bell, Settings, Search, Menu, Building, Briefcase, Palette, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { primaryColor, setPrimaryColor } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showThemePicker, setShowThemePicker] = useState(false);

  const themeColors = [
    { name: 'Sunset Orange', color: '#C2410C' },
    { name: 'Enterprise Blue', color: '#1E40AF' },
    { name: 'Forest Green', color: '#065F46' },
    { name: 'Royal Purple', color: '#6D28D9' },
    { name: 'Slate Gray', color: '#334155' },
    { name: 'Deep Crimson', color: '#991B1B' },
  ];

  const navItems = [
    { name: 'Dashboard', path: user?.role === 'tenant' ? '/tenant/dashboard' : '/customer-dashboard', icon: LayoutGrid },
    { name: 'Marketplace', path: '/', icon: Home },
    { name: 'Messaging', path: '/chats', icon: MessageSquare },
    { name: 'Help Hub', path: '/support', icon: ShieldQuestion },
    { name: 'Account', path: '/profile', icon: User },
  ];

  const getPageTitle = () => {
    const current = navItems.find(item => item.path === location.pathname);
    if (current) return current.name;
    if (location.pathname.startsWith('/property/')) return 'Viewing Property';
    if (location.pathname.startsWith('/chats/')) return 'Messaging';
    return 'HouseMate';
  };

  return (
    <div className="min-h-screen flex text-gray-800">
      
      {/* LEFT SIDEBAR */}
      <aside 
        style={{ backgroundColor: primaryColor }}
        className={`transition-all duration-300 flex flex-col items-center py-6 gap-8 shrink-0 overflow-hidden relative z-50 ${sidebarOpen ? 'w-20' : 'w-0'}`}
      >
        <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center mb-4 shadow-sm">
            <Building style={{ color: primaryColor }} size={24} />
        </div>
        
        <div className="flex flex-col gap-6 flex-1">
            {navItems.map((item, idx) => (
                <Link 
                    key={idx} 
                    to={item.path} 
                    className={`sidebar-icon ${location.pathname === item.path ? 'sidebar-active' : ''}`}
                    title={item.name}
                >
                    <item.icon size={22} />
                </Link>
            ))}
        </div>

        <button 
            onClick={() => { logout(); navigate('/'); }}
            className="sidebar-icon mt-auto" 
            title="Logout"
        >
            <LogOut size={22} />
        </button>
      </aside>

      {/* RIGHT CONTENT AREA */}
      <div className="flex-1 flex flex-col bg-[#F9FAFB]">
        
        {/* TOP DARK BANNER */}
        <header className="bg-[#3E2721] h-14 flex items-center justify-between px-6 shrink-0 shadow-lg relative z-20">
            <div className="flex items-center gap-4">
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white/70 hover:text-white transition-all">
                    <Menu size={20} />
                </button>
                <span className="text-white font-bold text-lg hidden sm:inline tracking-tight">HouseMate</span>
            </div>

            <div className="flex items-center gap-6">
                <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded px-3 py-1 gap-2">
                    <Search size={14} className="text-white/40" />
                    <input type="text" placeholder="Search..." className="bg-transparent text-white text-xs outline-none w-32 border-none ring-0 focus:ring-0" />
                </div>
                
                <div className="relative">
                    <button 
                        onClick={() => setShowThemePicker(!showThemePicker)}
                        className="text-white/60 hover:text-white transition-all p-1.5 hover:bg-white/10 rounded"
                        title="Theme Settings"
                    >
                        <Palette size={18} />
                    </button>
                    
                    <AnimatePresence>
                        {showThemePicker && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute top-full right-0 mt-3 w-48 bg-white rounded shadow-2xl border border-gray-100 p-3"
                            >
                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Select Theme</p>
                                <div className="grid grid-cols-3 gap-2">
                                    {themeColors.map(c => (
                                        <button 
                                            key={c.color}
                                            onClick={() => { setPrimaryColor(c.color); setShowThemePicker(false); }}
                                            className="w-10 h-10 rounded border border-gray-100 flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
                                            style={{ backgroundColor: c.color }}
                                            title={c.name}
                                        >
                                            {primaryColor === c.color && <Check size={14} className="text-white" />}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <button className="text-white/60 hover:text-white relative">
                    <Bell size={18} />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-stone-800"></span>
                </button>
                
                <div className="flex items-center gap-3 ml-2 group cursor-pointer" onClick={() => navigate('/profile')}>
                    <span className="text-white/70 text-[10px] font-bold uppercase tracking-widest group-hover:text-white transition-all">{user?.name?.split(' ')[0]}</span>
                    <div className="w-8 h-8 rounded bg-white/10 overflow-hidden border border-white/10 flex items-center justify-center text-white/40 font-bold text-xs uppercase">
                        {user?.name?.[0]}
                    </div>
                </div>
            </div>
        </header>

        {/* PAGE TITLE BAR */}
        <nav className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 shrink-0 relative z-10">
            <div>
                <span className="text-gray-400 text-[9px] font-black uppercase tracking-widest leading-none block">{user?.role} Portal</span>
                <h2 style={{ color: primaryColor }} className="text-2xl font-black leading-none mt-1 uppercase tracking-tight">{getPageTitle()}</h2>
            </div>
            
            <div className="flex items-center gap-3">
                <button 
                    onClick={() => navigate(user?.role === 'tenant' ? '/tenant/dashboard' : '/customer-dashboard')} 
                    className="p-2 border border-gray-100 bg-gray-50 text-gray-400 rounded hover:bg-gray-100 transition-all shadow-sm"
                    title="Dashboard"
                >
                    <LayoutGrid size={18} />
                </button>
                <button 
                    onClick={() => navigate('/profile')} 
                    className="p-2 border border-gray-100 bg-gray-50 text-gray-400 rounded hover:bg-gray-100 transition-all shadow-sm"
                    title="Settings"
                >
                    <Settings size={18} />
                </button>
                <div className="h-6 w-px bg-gray-100 mx-1"></div>
                <Link 
                    to="/" 
                    className="btn-primary"
                    style={{ backgroundColor: primaryColor }}
                >
                    {user?.role === 'tenant' ? '+ New Listing' : '+ New Visit'}
                </Link>
            </div>
        </nav>

        {/* MAIN SCROLLABLE AREA */}
        <main className="flex-1 overflow-auto custom-scrollbar bg-gray-50/50">
            <div className="p-10 max-w-7xl mx-auto">
                {children}
            </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
