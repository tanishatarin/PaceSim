// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define user interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  institution?: string;
  profilePicture?: string;
}

// Define session stats interface
export interface SessionStats {
  totalTime: number; // in minutes
  successRate: number; // percentage
  sessionsCompleted: number;
  lastLogin: Date;
}

// Define auth context interface
interface AuthContextType {
  user: User | null;
  stats: SessionStats | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string, role: string, institution?: string) => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for development
const MOCK_USERS = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah@example.com',
    password: 'password123',
    role: 'Cardiology Fellow',
    institution: 'Cleveland Clinic',
    profilePicture: '',
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    email: 'michael@example.com',
    password: 'password123',
    role: 'Medical Student',
    institution: 'Johns Hopkins',
    profilePicture: '',
  },
];

// Mock stats data
const MOCK_STATS: Record<string, SessionStats> = {
  '1': {
    totalTime: 750, // 12.5 hours in minutes
    successRate: 85,
    sessionsCompleted: 24,
    lastLogin: new Date('2025-02-25T10:30:00'),
  },
  '2': {
    totalTime: 480, // 8 hours in minutes
    successRate: 72,
    sessionsCompleted: 15,
    lastLogin: new Date('2025-02-26T14:15:00'),
  },
};

// Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<SessionStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check localStorage for session
        const storedUser = localStorage.getItem('pacesim_user');
        
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser({
            id: parsedUser.id,
            name: parsedUser.name,
            email: parsedUser.email,
            role: parsedUser.role,
            institution: parsedUser.institution,
            profilePicture: parsedUser.profilePicture,
          });

          // Get user stats
          if (MOCK_STATS[parsedUser.id]) {
            setStats({
              ...MOCK_STATS[parsedUser.id],
              lastLogin: new Date(), // Update last login to now
            });
          }
        }
      } catch (err) {
        console.error("Authentication error:", err);
        setError("Session expired. Please log in again.");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Find user in mock data
      const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);
      
      if (!foundUser) {
        throw new Error("Invalid email or password");
      }

      // Destructure to omit password before storing
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Set user in state and localStorage
      setUser(userWithoutPassword);
      localStorage.setItem('pacesim_user', JSON.stringify(userWithoutPassword));

      // Set user stats
      if (MOCK_STATS[foundUser.id]) {
        const updatedStats = {
          ...MOCK_STATS[foundUser.id],
          lastLogin: new Date(),
        };
        setStats(updatedStats);
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('pacesim_user');
    setUser(null);
    setStats(null);
  };

  // Register function
  const register = async (name: string, email: string, password: string, role: string, institution?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Check if user already exists
      if (MOCK_USERS.some(u => u.email === email)) {
        throw new Error("Email already in use");
      }

      // Create new user (for demo purposes)
      const newUser = {
        id: `${MOCK_USERS.length + 1}`,
        name,
        email,
        password,
        role,
        institution,
      };

      // In a real app, we would send this to the backend
      // For now, we'll just simulate success
      
      // Destructure to omit password before storing
      const { password: _, ...userWithoutPassword } = newUser;
      
      // Set user in state and localStorage
      setUser(userWithoutPassword);
      localStorage.setItem('pacesim_user', JSON.stringify(userWithoutPassword));

      // Initialize user stats
      const initialStats: SessionStats = {
        totalTime: 0,
        successRate: 0,
        sessionsCompleted: 0,
        lastLogin: new Date(),
      };
      setStats(initialStats);
      
    } catch (err: any) {
      setError(err.message || "Registration failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Create context value
  const value = {
    user,
    stats,
    isLoading,
    error,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};