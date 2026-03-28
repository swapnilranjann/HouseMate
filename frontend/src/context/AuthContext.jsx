import React, { createContext, useContext, useMemo } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const savedUser = localStorage.getItem('house_user');
    const savedToken = localStorage.getItem('house_token');
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Local Storage parsing error");
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('house_user', JSON.stringify(userData));
    localStorage.setItem('house_token', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('house_user');
    localStorage.removeItem('house_token');
  };

  const value = useMemo(() => ({ user, login, logout, loading }), [user, loading]);

  if (loading) return null;

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
