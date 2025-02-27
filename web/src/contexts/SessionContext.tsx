// src/contexts/SessionContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

// Define session interface
export interface Session {
  id: string;
  userId: string;
  moduleId: number;
  moduleName: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // in seconds
  completed: boolean;
  score?: number;
  maxScore?: number;
  attempts: number;
}

// Define the context interface
interface SessionContextType {
  currentSession: Session | null;
  recentSessions: Session[];
  isLoading: boolean;
  startSession: (moduleId: number, moduleName: string) => void;
  completeSession: (score: number, maxScore: number) => void;
  abandonSession: () => void;
}

// Create the context
const SessionContext = createContext<SessionContextType | undefined>(undefined);

// Mock recent sessions data
const MOCK_SESSIONS: Session[] = [
  {
    id: '1',
    userId: '1',
    moduleId: 3,
    moduleName: 'Atrial Fibrillation',
    startTime: new Date('2025-02-27T10:00:00'),
    endTime: new Date('2025-02-27T10:25:00'),
    duration: 1500, // 25 minutes
    completed: true,
    score: 85,
    maxScore: 100,
    attempts: 1,
  },
  {
    id: '2',
    userId: '1',
    moduleId: 1,
    moduleName: 'Basic Calibration',
    startTime: new Date('2025-02-26T14:30:00'),
    endTime: new Date('2025-02-26T15:15:00'),
    duration: 2700, // 45 minutes
    completed: true,
    score: 92,
    maxScore: 100,
    attempts: 1,
  },
  {
    id: '3',
    userId: '1',
    moduleId: 2,
    moduleName: 'Tachycardia',
    startTime: new Date('2025-02-24T09:15:00'),
    endTime: undefined,
    duration: 1800, // 30 minutes so far
    completed: false,
    attempts: 1,
  },
];

// Provider component
interface SessionProviderProps {
  children: ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [recentSessions, setRecentSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load sessions when the user changes
  useEffect(() => {
    const loadSessions = async () => {
      setIsLoading(true);
      try {
        if (user) {
          // In a real app, we would fetch from an API
          // For now, use mock data
          const userSessions = MOCK_SESSIONS.filter(session => session.userId === user.id);
          setRecentSessions(userSessions);
          
          // Check for any incomplete sessions
          const incompleteSession = userSessions.find(session => !session.completed);
          if (incompleteSession) {
            setCurrentSession(incompleteSession);
          } else {
            setCurrentSession(null);
          }
        } else {
          setRecentSessions([]);
          setCurrentSession(null);
        }
      } catch (error) {
        console.error("Error loading sessions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSessions();
  }, [user]);

  // Start a new session
  const startSession = (moduleId: number, moduleName: string) => {
    if (!user) return;

    // Create a new session
    const newSession: Session = {
      id: `session_${Date.now()}`,
      userId: user.id,
      moduleId,
      moduleName,
      startTime: new Date(),
      completed: false,
      attempts: 1,
    };

    // Update current session
    setCurrentSession(newSession);
    
    // Add to recent sessions
    setRecentSessions(prev => [newSession, ...prev]);

    // In a real app, we would send this to the backend
    console.log("Session started:", newSession);
  };

  // Complete a session
  const completeSession = (score: number, maxScore: number) => {
    if (!currentSession || !user) return;

    const now = new Date();
    const duration = Math.floor((now.getTime() - currentSession.startTime.getTime()) / 1000);

    // Update the current session
    const completedSession: Session = {
      ...currentSession,
      endTime: now,
      duration,
      completed: true,
      score,
      maxScore,
    };

    // Update state
    setCurrentSession(null);
    setRecentSessions(prev => 
      prev.map(session => 
        session.id === completedSession.id ? completedSession : session
      )
    );

    // In a real app, we would send this to the backend
    console.log("Session completed:", completedSession);
    
    return completedSession;
  };

  // Abandon a session
  const abandonSession = () => {
    if (!currentSession || !user) return;

    const now = new Date();
    const duration = Math.floor((now.getTime() - currentSession.startTime.getTime()) / 1000);

    // Update the abandoned session
    const abandonedSession: Session = {
      ...currentSession,
      endTime: now,
      duration,
    };

    // Update state
    setCurrentSession(null);
    setRecentSessions(prev => 
      prev.map(session => 
        session.id === abandonedSession.id ? abandonedSession : session
      )
    );

    // In a real app, we would send this to the backend
    console.log("Session abandoned:", abandonedSession);
  };

  // Context value
  const value = {
    currentSession,
    recentSessions,
    isLoading,
    startSession,
    completeSession,
    abandonSession,
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

// Hook for using the session context
export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};