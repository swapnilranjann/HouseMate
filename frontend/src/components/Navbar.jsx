import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, LogOut, LayoutDashboard, Heart, MessageSquare, ShieldCheck, UserCircle, Menu, UserPlus, Building, Key } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 decoration-none text-slate-900 font-extrabold text-2xl tracking-tight">
            <div className="bg-indigo-600 p-2 rounded-xl">
               <Home className="text-white w-6 h-6 border-2 border-transparent" />
            </div>
            <span>HouseMate</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {user ? (
              <>
                <Link to={user.role === 'tenant' ? '/tenant-dashboard' : '/customer-dashboard'} className="text-sm font-semibold text-slate-600 hover:text-indigo-600 flex items-center gap-2 transition-colors">
                  <LayoutDashboard size={18} />
                  <span>Dashboard</span>
                </Link>
                
                {user.role === 'customer' && (
                  <Link to="/favorites" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 flex items-center gap-2 transition-colors">
                    <Heart size={18} />
                    <span>Favorites</span>
                  </Link>
                )}

                <Link to="/chats" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 flex items-center gap-2 transition-colors">
                  <MessageSquare size={18} />
                  <span>Messages</span>
                </Link>

                <div className="h-8 w-px bg-gray-200 mx-2"></div>
                
                {/* User Profile */}
                <div className="flex items-center gap-3 bg-slate-50 px-3 py-2 rounded-full border border-gray-200 shadow-inner">
                  <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-slate-500 shadow-sm">
                    {user.role === 'tenant' ? <ShieldCheck size={18} className="text-sky-600" /> : <UserCircle size={18} className="text-indigo-600" />}
                  </div>
                  <div className="flex flex-col pr-2">
                    <span className="text-sm font-bold text-slate-900 leading-tight">{user.name.split(' ')[0]}</span>
                    <span className="text-[10px] font-black tracking-wider text-slate-500 uppercase">{user.role}</span>
                  </div>
                  <button 
                    onClick={() => { logout(); navigate('/'); }} 
                    className="ml-2 text-slate-400 hover:text-red-500 p-1.5 rounded-full hover:bg-white transition-all shadow-sm border border-transparent hover:border-red-100"
                    title="Logout"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-6">
                
                {/* Customers */}
                <div className="flex items-center gap-4">
                  <div className="flex flex-col text-right mr-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Looking for a home?</span>
                  </div>
                  <Link to="/customer/login" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1"><Key size={16}/> Sign In</Link>
                  <Link to="/customer/register" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-5 py-2.5 rounded-lg font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                    <UserPlus size={16} /> Register
                  </Link>
                </div>

                <div className="h-10 w-px bg-gray-200"></div>

                {/* Tenants/Owners */}
                <div className="flex items-center gap-4">
                   <div className="flex flex-col text-right mr-2">
                    <span className="text-[10px] font-bold text-sky-500 uppercase tracking-widest">Property Owners</span>
                  </div>
                  <Link to="/tenant/login" className="text-sm font-bold text-slate-600 hover:text-sky-600 transition-colors flex items-center gap-1"><Key size={16}/> Admin Portal</Link>
                  <Link to="/tenant/register" className="bg-white border border-gray-300 hover:border-sky-300 hover:bg-sky-50 text-slate-700 hover:text-sky-700 text-sm px-5 py-2.5 rounded-lg font-bold transition-all shadow-sm flex items-center gap-2">
                    <Building size={16} /> List Property
                  </Link>
                </div>

              </div>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <button className="md:hidden text-slate-500 p-2 hover:bg-slate-100 rounded-md transition-colors" onClick={() => setShowDropdown(!showDropdown)}>
            <Menu size={28} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
