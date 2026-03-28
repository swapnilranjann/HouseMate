import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Home, LogOut, LayoutDashboard, Heart, MessageSquare, ShieldCheck, UserCircle, Menu, UserPlus, Building, Key, LifeBuoy, Command, ArrowUpRight } from 'lucide-react';
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
    { to: user?.role === 'tenant' ? '/tenant-dashboard' : '/customer-dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/chats', icon: MessageSquare, label: 'Messages' },
    { to: '/support', icon: LifeBuoy, label: 'Help Center' }
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-[100] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 md:h-24">
          
          {/* Logo Identity */}
          <Link to="/" className="flex items-center gap-4 group cursor-pointer">
            <div className="bg-slate-900 p-2.5 rounded-2xl shadow-2xl group-hover:scale-110 group-hover:bg-indigo-600 transition-all duration-500">
               <Home className="text-white w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-black text-2xl md:text-3xl tracking-tighter text-slate-900 leading-none uppercase italic-none">HouseMate</span>
              <span className="text-[8px] font-black uppercase tracking-[0.4em] text-indigo-600 leading-none mt-1.5">Premium Home Service</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-10">
            {user ? (
              <>
                <div className="flex items-center gap-8">
                    {navLinks.map((link, idx) => {
                        const active = isActive(link.to);
                        return (
                            <Link 
                                key={idx} 
                                to={link.to} 
                                className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 transition-all group relative py-2 ${active ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-900'}`}
                            >
                                <link.icon size={16} className={`transition-all ${active ? 'text-indigo-600 scale-110' : 'group-hover:text-indigo-600 group-hover:-translate-y-1'}`} />
                                <span className="relative z-10">{link.label}</span>
                                {active && (
                                    <motion.div 
                                        layoutId="nav-active" 
                                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-indigo-600 rounded-full"
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </div>

                <div className="h-4 w-px bg-slate-100"></div>
                
                {/* User Identity */}
                <div className="flex items-center gap-6">
                    <Link to="/profile" className={`flex items-center gap-4 px-4 py-2 rounded-2xl border transition-all hover:shadow-xl group ${location.pathname === '/profile' ? 'bg-indigo-50 border-indigo-100 shadow-sm' : 'bg-slate-50/50 border-slate-100 hover:bg-white hover:border-indigo-100'}`}>
                        <div className={`w-9 h-9 rounded-xl border flex items-center justify-center text-white shadow-xl transition-all ${location.pathname === '/profile' || user.role === 'tenant' ? 'bg-indigo-600 border-indigo-400' : 'bg-slate-900 border-slate-800 group-hover:bg-indigo-600'}`}>
                            {user.role === 'tenant' ? <ShieldCheck size={18} /> : <UserCircle size={18} />}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-black text-slate-900 leading-none">{user.name.split(' ')[0]}</span>
                            <span className={`text-[9px] font-black tracking-widest uppercase mt-1 ${location.pathname === '/profile' ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-600'}`}>SECURED {user.role.toUpperCase()}</span>
                        </div>
                    </Link>

                    <button 
                        onClick={() => { logout(); navigate('/'); }} 
                        className="p-3 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all shadow-sm active:scale-95"
                        title="Log Out"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-10">
                <div className="flex items-center gap-8">
                  <Link to="/customer/login" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-slate-900 transition-all">Log In</Link>
                  <Link to="/customer/register" className="bg-slate-900 hover:bg-black text-white text-[10px] px-8 py-3.5 rounded-2xl font-black uppercase tracking-[0.25em] transition-all shadow-2xl hover:-translate-y-1">
                    JOIN NOW
                  </Link>
                </div>
                <div className="h-8 w-px bg-slate-100"></div>
                <div className="flex items-center gap-6">
                  <Link to="/tenant/login" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-sky-600 transition-all">Admin</Link>
                  <Link to="/tenant/register" className="bg-white text-sky-600 border border-sky-100 hover:bg-sky-600 hover:text-white text-[10px] px-8 py-3.5 rounded-2xl font-black uppercase tracking-[0.25em] transition-all shadow-sm hover:shadow-xl">
                    LIST PROPERTY
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Access Trigger */}
          <button className="lg:hidden p-3 bg-slate-50 text-slate-900 rounded-xl hover:bg-slate-100 transition-all" onClick={() => setShowDropdown(!showDropdown)}>
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {showDropdown && (
            <motion.div 
               initial={{ opacity: 0, height: 0 }} 
               animate={{ opacity: 1, height: 'auto' }} 
               exit={{ opacity: 0, height: 0 }}
               className="lg:hidden bg-white border-t border-slate-100 overflow-hidden"
            >
                <div className="p-6 space-y-4">
                    {user ? (
                        <>
                            {navLinks.map((link, idx) => (
                                <Link 
                                    key={idx} 
                                    to={link.to} 
                                    onClick={() => setShowDropdown(false)} 
                                    className={`block py-4 text-[10px] font-black uppercase tracking-widest border-b border-slate-50 ${isActive(link.to) ? 'text-indigo-600' : 'text-slate-900'}`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <Link to="/profile" onClick={() => setShowDropdown(false)} className={`block py-4 text-[10px] font-black uppercase tracking-widest border-b border-slate-50 ${location.pathname === '/profile' ? 'text-indigo-600' : 'text-slate-900'}`}>My Profile</Link>
                            <button onClick={() => { logout(); navigate('/'); setShowDropdown(false); }} className="w-full text-left py-4 text-[10px] font-black uppercase tracking-widest text-rose-500">Log Out</button>
                        </>
                    ) : (
                        <>
                            <Link to="/customer/login" onClick={() => setShowDropdown(false)} className="block py-4 text-[10px] font-black uppercase tracking-widest text-slate-900 border-b border-slate-50">Log In</Link>
                            <Link to="/customer/register" onClick={() => setShowDropdown(false)} className="block py-4 text-[10px] font-black uppercase tracking-widest text-indigo-600">Create Account</Link>
                            <Link to="/tenant/login" onClick={() => setShowDropdown(false)} className="block py-4 text-[10px] font-black uppercase tracking-widest text-slate-900 border-b border-slate-50">Admin Log In</Link>
                            <Link to="/tenant/register" onClick={() => setShowDropdown(false)} className="block py-4 text-[10px] font-black uppercase tracking-widest text-sky-600">List Property</Link>
                        </>
                    )}
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
