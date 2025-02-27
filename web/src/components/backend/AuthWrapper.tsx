// src/components/AuthWrapper.tsx
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const [showLogin, setShowLogin] = useState(true);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#E5EDF8] flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#E5EDF8] flex items-center justify-center p-6">
        {showLogin ? (
          <LoginPage onSwitch={() => setShowLogin(false)} />
        ) : (
          <RegisterPage onSwitch={() => setShowLogin(true)} />
        )}
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthWrapper;