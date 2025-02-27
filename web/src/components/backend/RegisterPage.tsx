// src/components/RegisterPage.tsx
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface RegisterPageProps {
  onSwitch: () => void; // Switch to login
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onSwitch }) => {
  const { register, isLoading, error } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [institution, setInstitution] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Basic validation
    if (!name || !email || !password || !confirmPassword || !role) {
      setFormError("Please fill in all required fields");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setFormError("Password must be at least 8 characters");
      return;
    }

    try {
      await register(name, email, password, role, institution);
    } catch (err: any) {
      // Error is handled by the auth context
    }
  };

  // Available roles
  const roles = [
    "Medical Student",
    "Resident Physician",
    "Fellow",
    "Attending Physician",
    "Nurse",
    "Other Healthcare Professional",
  ];

  return (
    <Card className="w-full max-w-md p-8 mx-auto bg-white shadow-xl rounded-2xl">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
        <p className="mt-2 text-gray-600">
          Join PaceSim - External Pacemaker Simulation Platform
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {(error || formError) && (
          <div className="p-3 text-sm text-red-600 rounded-lg bg-red-50">
            {error || formError}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">
            Full Name*
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Dr. Jane Smith"
            disabled={isLoading}
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
            Email*
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="email@example.com"
            disabled={isLoading}
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
              Password*
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Min. 8 characters"
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block mb-1 text-sm font-medium text-gray-700">
              Confirm Password*
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Re-enter password"
              disabled={isLoading}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="role" className="block mb-1 text-sm font-medium text-gray-700">
            Professional Role*
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
            required
          >
            <option value="">Select your role</option>
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="institution" className="block mb-1 text-sm font-medium text-gray-700">
            Institution
          </label>
          <input
            type="text"
            id="institution"
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Hospital/University (optional)"
            disabled={isLoading}
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md shadow hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={onSwitch}
            className="font-medium text-blue-600 hover:text-blue-800"
            disabled={isLoading}
          >
            Sign In
          </button>
        </p>
      </div>
    </Card>
  );
};

export default RegisterPage;