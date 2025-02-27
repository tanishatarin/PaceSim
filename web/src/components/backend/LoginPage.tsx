// src/components/LoginPage.tsx
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface LoginPageProps {
  onSwitch: () => void; // Switch to registration
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSwitch }) => {
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Basic validation
    if (!email || !password) {
      setFormError("Please fill in all fields");
      return;
    }

    try {
      await login(email, password);
    } catch (err: any) {
      // Error is handled by the auth context
    }
  };

  return (
    <Card className="w-full max-w-md p-8 mx-auto bg-white shadow-xl rounded-2xl">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Sign In to PaceSim</h1>
        <p className="mt-2 text-gray-600">
          External Pacemaker Simulation Platform
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {(error || formError) && (
          <div className="p-3 text-sm text-red-600 rounded-lg bg-red-50">
            {error || formError}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your email"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your password"
            disabled={isLoading}
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md shadow hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={onSwitch}
            className="font-medium text-blue-600 hover:text-blue-800"
            disabled={isLoading}
          >
            Register
          </button>
        </p>
      </div>

      {/* Demo account info */}
      <div className="p-3 mt-8 rounded-lg bg-gray-50">
        <p className="text-xs text-center text-gray-600">
          <strong>Demo Account:</strong> sarah@example.com / password123
        </p>
      </div>
    </Card>
  );
};

export default LoginPage;