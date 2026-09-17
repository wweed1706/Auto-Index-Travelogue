import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('travelogue_auth') === 'true';
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('travelogue_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (email) => {
    const userData = {
      email,
      name: email.split('@')[0] || 'Nhà thám hiểm',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    };
    localStorage.setItem('travelogue_auth', 'true');
    localStorage.setItem('travelogue_user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('travelogue_auth');
    localStorage.removeItem('travelogue_user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
