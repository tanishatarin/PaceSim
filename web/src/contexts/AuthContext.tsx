import React, { createContext, useState, useContext, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  userData: any;
  login: (userData: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    // Check if user data exists in localStorage on initial load
    const savedAuth = localStorage.getItem('pacesim_auth');
    if (savedAuth) {
      try {
        const parsedAuth = JSON.parse(savedAuth);
        setUserData(parsedAuth);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing saved auth data:', error);
        localStorage.removeItem('pacesim_auth');
      }
    }
  }, []);

  const login = (userData: any) => {
    setIsAuthenticated(true);
    setUserData(userData);
    localStorage.setItem('pacesim_auth', JSON.stringify(userData));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserData(null);
    localStorage.removeItem('pacesim_auth');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};