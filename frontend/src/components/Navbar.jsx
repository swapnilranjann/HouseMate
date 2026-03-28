import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, LogOut, LayoutDashboard, Heart, MessageSquare, ShieldCheck, UserCircle, Menu, UserPlus, Building, Key, LifeBuoy } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="bg-white border-b border-slate-100 shadow-[0_2px_15px_-5px_rgba(0,0,0,0.02)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 decoration-none text-slate-900 tracking-tighter">
            <div className="bg-slate-900 p-1.5 rounded-lg shadow-lg">
               <Home className="text-white w-5 h-5" />
            </div>
            <span className="font-serif italic font-black text-xl md:text-2xl">HouseMate</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {user ? (
              <>
                <Link to={user.role === 'tenant' ? '/tenant-dashboard' : '/customer-dashboard'} className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 flex items-center gap-2 transition-all">
                  <LayoutDashboard size={14} />
                  <span>Dashboard</span>
                </Link>
                
                {user.role === 'customer' && (
                  <Link to="/favorites" className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 flex items-center gap-2 transition-all">
                    <Heart size={14} />
                    <span>Favorites</span>
                  </Link>
                )}

                <Link to="/chats" className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 flex items-center gap-2 transition-all">
                  <MessageSquare size={14} />
                  <span>Messages</span>
                </Link>

                <Link to="/support" className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 flex items-center gap-2 transition-all">
                  <LifeBuoy size={14} />
                  <span>Support</span>
                </Link>

                {user.role === 'tenant' && (
                  <Link to="/tenant-dashboard?add=true" className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-indigo-600 hover:text-white flex items-center gap-2">
                     <Building size={14} /> List Property
                  </Link>
                )}

                <div className="h-6 w-px bg-slate-100 mx-1"></div>
                
                {/* User Profile */}
                <Link to="/profile" className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-white transition-all hover:border-indigo-100 cursor-pointer group">
                  <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 shadow-sm group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-200 transition-all">
                    {user.role === 'tenant' ? <ShieldCheck size={14} /> : <UserCircle size={14} />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-900 leading-none">{user.name.split(' ')[0]}</span>
                    <span className="text-[9px] font-bold tracking-tighter text-slate-400 uppercase">{user.role}</span>
                  </div>
                </Link>
                <button 
                  onClick={() => { logout(); navigate('/'); }} 
                  className="text-slate-300 hover:text-rose-500 transition-colors"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4 lg:gap-6">
                
                {/* Auth Actions */}
                <div className="flex items-center gap-4">
                  <Link to="/customer/login" className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-all">Sign In</Link>
                  <Link to="/customer/register" className="bg-slate-900 hover:bg-black text-white text-[10px] px-5 py-2.5 rounded-xl font-black uppercase tracking-widest transition-all shadow-lg">
                    Register
                  </Link>
                </div>

                <div className="h-8 w-px bg-slate-100"></div>

                <div className="flex items-center gap-4">
                  <Link to="/tenant/login" className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-sky-600 transition-all">Admin</Link>
                  <Link to="/tenant/register" className="bg-sky-50 text-sky-600 border border-sky-100 hover:bg-sky-600 hover:text-white text-[10px] px-5 py-2.5 rounded-xl font-black uppercase tracking-widest transition-all">
                    List Property
                  </Link>
                </div>

              </div>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <button className="md:hidden text-slate-500 p-2 hover:bg-slate-50 rounded-lg transition-colors" onClick={() => setShowDropdown(!showDropdown)}>
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
