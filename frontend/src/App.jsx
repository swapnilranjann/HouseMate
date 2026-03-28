import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
import { useAuth } from './context/AuthContext.jsx';

function App() {
  const { user } = useAuth();

  return (
    <div className="container min-h-screen py-10">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Customer Auth */}
        <Route path="/customer/login" element={!user ? <CustomerLogin /> : <Navigate to="/" />} />
        <Route path="/customer/register" element={!user ? <CustomerRegister /> : <Navigate to="/" />} />
        
        {/* Tenant Auth */}
        <Route path="/tenant/login" element={!user ? <TenantLogin /> : <Navigate to="/" />} />
        <Route path="/tenant/register" element={!user ? <TenantRegister /> : <Navigate to="/" />} />

        <Route path="/property/:id" element={<PropertyDetail />} />
        
        {/* Protected Tenant Routes */}
        <Route path="/tenant-dashboard" element={
          user?.role === 'tenant' ? <TenantDashboard /> : <Navigate to="/tenant/login" />
        } />

        {/* Protected Customer Routes */}
        <Route path="/customer-dashboard" element={
          user?.role === 'customer' ? <CustomerDashboard /> : <Navigate to="/customer/login" />
        } />
        <Route path="/favorites" element={
          user?.role === 'customer' ? <CustomerDashboard isFavorites={true} /> : <Navigate to="/customer/login" />
        } />

        {/* Global Protected Routes */}
        <Route path="/chats" element={
          user ? <ChatPage /> : <Navigate to="/" />
        } />
        <Route path="/chats/:id" element={
          user ? <ChatPage /> : <Navigate to="/" />
        } />
        <Route path="/support" element={
          user ? <SupportPage /> : <Navigate to="/customer/login" />
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
