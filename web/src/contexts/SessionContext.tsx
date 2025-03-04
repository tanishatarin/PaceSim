import React, { createContext, useContext, useState, useEffect } from 'react';

interface Session {
  id: string;
  moduleId: string;
  moduleName: string;
  startTime: string;
  endTime?: string;
  isCompleted: boolean;
  isSuccess?: boolean;
}

interface SessionContextType {
  currentSession: Session | null;
  sessionHistory: Session[];
  startSession: (moduleId: string, moduleName: string) => void;
  endSession: (isSuccess: boolean) => void;
  getSessions: () => Session[];
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [sessionHistory, setSessionHistory] = useState<Session[]>([]);

  // Load session history from localStorage on initial render
  useEffect(() => {
    const savedSessions = localStorage.getItem('pacesim_sessions');
    if (savedSessions) {
      try {
        setSessionHistory(JSON.parse(savedSessions));
      } catch (error) {
        console.error('Error parsing session history:', error);
        localStorage.removeItem('pacesim_sessions');
      }
    }
  }, []);

  // Save session history to localStorage when it changes
  useEffect(() => {
    if (sessionHistory.length > 0) {
      localStorage.setItem('pacesim_sessions', JSON.stringify(sessionHistory));
    }
  }, [sessionHistory]);

  const startSession = (moduleId: string, moduleName: string) => {
    // Create a new session
    const newSession: Session = {
      id: `session_${Date.now()}`,
      moduleId,
      moduleName,
      startTime: new Date().toISOString(),
      isCompleted: false
    };
    
    setCurrentSession(newSession);
  };

  const endSession = (isSuccess: boolean) => {
    if (currentSession) {
      // Update the current session
      const completedSession: Session = {
        ...currentSession,
        endTime: new Date().toISOString(),
        isCompleted: true,
        isSuccess
      };
      
      // Add to history
      setSessionHistory(prevHistory => [...prevHistory, completedSession]);
      
      // Clear current session
      setCurrentSession(null);
    }
  };

  const getSessions = () => {
    return sessionHistory;
  };

  return (
    <SessionContext.Provider 
      value={{ 
        currentSession, 
        sessionHistory, 
        startSession, 
        endSession, 
        getSessions 
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};