import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, LayoutGrid, MessageSquare, ShieldQuestion, User, LogOut, Bell, Settings, Search, Menu, Building, Briefcase } from 'lucide-react';

const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { name: 'Dashboard', path: user?.role === 'tenant' ? '/tenant-dashboard' : '/customer-dashboard', icon: LayoutGrid },
    { name: 'Marketplace', path: '/', icon: Home },
    { name: 'Communications', path: '/chats', icon: MessageSquare },
    { name: 'Support', path: '/support', icon: ShieldQuestion },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const getPageTitle = () => {
    const current = navItems.find(item => item.path === location.pathname);
    if (current) return current.name;
    if (location.pathname.includes('/property/')) return 'Viewing Property';
    return 'HouseMate';
  };

  return (
    <div className="min-h-screen flex text-gray-800">
      
      {/* LEFT SIDEBAR - Red/Orange from screenshot */}
      <aside className={`bg-[#C2410C] ${sidebarOpen ? 'w-20' : 'w-0'} transition-all duration-300 flex flex-col items-center py-6 gap-8 shrink-0 overflow-hidden`}>
        <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center mb-4">
            <Building className="text-[#C2410C]" size={24} />
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
        
        {/* TOP DARK BANNER - Dark brown from screenshot */}
        <header className="bg-[#3E2721] h-14 flex items-center justify-between px-6 shrink-0 shadow-lg relative z-20">
            <div className="flex items-center gap-4">
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white/70 hover:text-white transition-all">
                    <Menu size={20} />
                </button>
                <span className="text-white font-bold text-lg hidden sm:inline">HouseMate</span>
            </div>

            <div className="flex items-center gap-6">
                <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded px-3 py-1 gap-2">
                    <Search size={14} className="text-white/40" />
                    <input type="text" placeholder="Search..." className="bg-transparent text-white text-xs outline-none w-32 border-none ring-0 focus:ring-0" />
                </div>
                <button className="text-white/60 hover:text-white relative">
                    <Bell size={18} />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-stone-800"></span>
                </button>
                <div className="flex items-center gap-3 ml-2 group cursor-pointer" onClick={() => navigate('/profile')}>
                    <span className="text-white/70 text-xs font-semibold group-hover:text-white transition-all">{user?.name}</span>
                    <div className="w-8 h-8 rounded-full bg-stone-700 overflow-hidden border border-white/10">
                         <img src="https://images.unsplash.com/photo-1543351611-58f69d7c1781?q=80&w=100&h=100&auto=format&fit=crop" alt="avatar" />
                    </div>
                </div>
            </div>
        </header>

        {/* PAGE TITLE BAR */}
        <nav className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 shrink-0">
            <div>
                <span className="text-gray-400 text-xs font-semibold uppercase tracking-widest">{user?.role} / {getPageTitle()}</span>
                <h2 className="text-[#C2410C] text-2xl font-bold leading-none mt-1 uppercase">{getPageTitle()}</h2>
            </div>
            
            <div className="flex gap-2">
                <button className="p-2 border border-blue-100 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-all shadow-sm">
                    <LayoutGrid size={18} />
                </button>
                <button className="p-2 border border-gray-100 bg-gray-50 text-gray-500 rounded hover:bg-gray-100 transition-all shadow-sm">
                    <Settings size={18} />
                </button>
                <Link to="/" className="flex items-center gap-2 bg-[#C2410C] hover:bg-[#9A3412] text-white px-6 py-2.5 rounded font-bold text-sm transition-all shadow-md uppercase tracking-wider">
                    {user?.role === 'tenant' ? '+ New Listing' : '+ New Visit'}
                </Link>
            </div>
        </nav>

        {/* MAIN SCROLLABLE AREA */}
        <main className="flex-1 overflow-auto custom-scrollbar p-10">
            {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
