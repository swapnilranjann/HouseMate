import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Home, LogOut, LayoutDashboard, Heart, MessageSquare, ShieldCheck, UserCircle, Menu, UserPlus, Building, Key, LifeBuoy, Command, ArrowUpRight, ChevronDown, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);

  const isActive = (path) => {
    if (path.includes('dashboard')) {
        return location.pathname.includes('dashboard');
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const navLinks = [
    { to: user?.role === 'tenant' ? '/tenant/dashboard' : '/customer-dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/chats', icon: MessageSquare, label: 'Messages' },
    { to: '/support', icon: LifeBuoy, label: 'Support' }
  ];

  return (
    <nav className="bg-[#3E2723] border-b border-[#4E342E] sticky top-0 z-[100] h-16 flex items-center">
      <div className="max-w-7xl mx-auto px-4 w-full">
        <div className="flex justify-between items-center h-full">
          
          {/* Logo Identity */}
          <Link to="/" className="flex items-center gap-3">
            <div className="bg-[#C2410C] p-1.5 rounded shadow-sm">
               <Home className="text-white w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-white leading-none uppercase">HouseMate</span>
              <span className="text-[8px] font-bold uppercase tracking-widest text-orange-200 leading-none mt-1">Enterprise Platform</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8 h-full">
            {user ? (
              <>
                <div className="flex items-center gap-1 h-full">
                    {navLinks.map((link, idx) => {
                        const active = isActive(link.to);
                        return (
                            <Link 
                                key={idx} 
                                to={link.to} 
                                className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 px-4 py-2 rounded transition-all ${active ? 'bg-white/10 text-white' : 'text-orange-100/60 hover:text-white hover:bg-white/5'}`}
                            >
                                <link.icon size={14} />
                                <span>{link.label}</span>
                            </Link>
                        );
                    })}
                </div>

                <div className="h-6 w-px bg-white/10 mx-2"></div>
                
                {/* User Identity */}
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <button 
                            onClick={() => setShowDropdown(!showDropdown)}
                            className={`flex items-center gap-3 px-3 py-1.5 rounded transition-all ${showDropdown ? 'bg-white/10' : 'hover:bg-white/5'}`}
                        >
                            <div className="w-8 h-8 rounded text-white flex items-center justify-center font-bold text-xs shadow-sm" style={{ backgroundColor: 'var(--primary)' }}>
                                {user.name?.[0]}
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="text-[11px] font-bold text-white leading-none">{user.name.split(' ')[0]}</span>
                                <span className="text-[8px] font-bold tracking-widest uppercase mt-1 text-orange-200/60">{user.role}</span>
                            </div>
                            <ChevronDown size={14} className={`text-orange-200/40 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                        </button>
                        
                        <AnimatePresence>
                            {showDropdown && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute top-full right-0 mt-2 w-48 bg-white rounded shadow-xl border border-gray-100 overflow-hidden py-1"
                                >
                                    <Link to="/profile" onClick={() => setShowDropdown(false)} className="flex items-center gap-2 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-700 hover:bg-gray-50 border-b border-gray-50">
                                        <User size={14} /> Account Profile
                                    </Link>
                                    <button 
                                        onClick={() => { logout(); setShowDropdown(false); navigate('/'); }} 
                                        className="w-full flex items-center gap-2 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-red-600 hover:bg-red-50 text-left"
                                    >
                                        <LogOut size={14} /> Log Out
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 pr-2">
                    <Link to="/customer/login" className="text-[10px] font-bold uppercase tracking-widest text-white/70 hover:text-white transition-all px-4 py-2">Sign In</Link>
                    <Link to="/customer/register" className="text-[10px] font-bold uppercase tracking-widest text-white/70 hover:text-white transition-all px-4 py-2">Sign Up</Link>
                  </div>
                  <div className="h-6 w-px bg-white/10 mx-1"></div>
                  <Link to="/tenant/register" className="hover:brightness-110 text-white text-[10px] px-5 py-2.5 rounded font-bold uppercase tracking-widest transition-all shadow-sm" style={{ backgroundColor: 'var(--primary)' }}>
                    List Property
                  </Link>
              </div>
            )}
          </div>

          {/* Mobile Access Trigger */}
          <div className="lg:hidden relative">
            <button className="p-2 text-white/70 hover:text-white" onClick={() => setShowDropdown(!showDropdown)}>
                <Menu size={20} />
            </button>
            <AnimatePresence>
                {showDropdown && !user && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full right-0 mt-2 w-48 bg-white rounded shadow-xl border border-gray-100 overflow-hidden py-1"
                    >
                        <Link to="/customer/login" onClick={() => setShowDropdown(false)} className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-700 hover:bg-gray-50 border-b border-gray-50 flex items-center gap-2">
                             <Key size={14} /> Sign In
                        </Link>
                        <Link to="/customer/register" onClick={() => setShowDropdown(false)} className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-700 hover:bg-gray-50 border-b border-gray-50 flex items-center gap-2">
                             <UserPlus size={14} /> Sign Up
                        </Link>
                        <Link to="/tenant/register" onClick={() => setShowDropdown(false)} className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary/5 flex items-center gap-2" style={{ color: 'var(--primary)' }}>
                             <Building size={14} /> List Property
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
