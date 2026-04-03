import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CustomerLogin from './pages/CustomerLogin';
import CustomerRegister from './pages/CustomerRegister';
import TenantLogin from './pages/TenantLogin';
import TenantRegister from './pages/TenantRegister';
import PropertyDetail from './pages/PropertyDetail';
import TenantDashboard from './pages/TenantDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import ChatPage from './pages/ChatPage';
import SupportPage from './pages/SupportPage';
import ProfilePage from './pages/ProfilePage';
import ForgotPassword from './pages/ForgotPassword';
import PageLoader from './components/PageLoader';
import { useAuth } from './context/AuthContext.jsx';
import { ToastProvider } from './components/ui/ToastProvider.jsx';
import MainLayout from './components/MainLayout';
import { AnimatePresence } from 'framer-motion';

function App() {
  const { user } = useAuth();
  const location = useLocation();
  const [navLoading, setNavLoading] = useState(false);

  useEffect(() => {
    setNavLoading(true);
    const timer = setTimeout(() => {
      setNavLoading(false);
    }, 400); 
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="min-h-screen">
      <ToastProvider />
      <AnimatePresence>
        {navLoading && <PageLoader />}
      </AnimatePresence>
      
      {user ? (
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
            <Route path="/tenant/dashboard" element={user.role === 'tenant' ? <TenantDashboard /> : <Navigate to="/" />} />
            <Route path="/customer-dashboard" element={user.role === 'customer' ? <CustomerDashboard /> : <Navigate to="/" />} />
            <Route path="/favorites" element={user.role === 'customer' ? <CustomerDashboard isFavorites={true} /> : <Navigate to="/" />} />
            <Route path="/chats" element={<ChatPage />} />
            <Route path="/chats/:id" element={<ChatPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </MainLayout>
      ) : (
        <div className="min-h-screen bg-[#F9FAFB]">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/customer/login" element={<CustomerLogin />} />
            <Route path="/customer/register" element={<CustomerRegister />} />
            <Route path="/tenant/login" element={<TenantLogin />} />
            <Route path="/tenant/register" element={<TenantRegister />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      )}
    </div>
  );
}

export default App;
