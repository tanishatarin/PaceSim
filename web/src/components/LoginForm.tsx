import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface LoginFormProps {
  onLoginSuccess: (userData: any) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [institution, setInstitution] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!username || !password) {
      setError("Please fill in all required fields");
      return;
    }

    if (!isLogin) {
      // Additional validation for signup
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      
      if (!name) {
        setError("Please enter your name");
        return;
      }
    }

    setIsLoading(true);

    try {
      const url = 'https://magicloops.dev/api/loop/3b49be7a-e75f-4e4c-a51e-5e9f2f151d8f/run';
      
      // Create user data object with all relevant fields
      const userData = {
        username,
        password,
        name,
        role,
        institution,
        action: isLogin ? "login" : "signup",
        // Initialize training stats for new users
        trainingTime: "0 hrs",
        successRate: "0%"
      };
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      // Merge the form data with the response data to ensure we have complete profile info
      const completeUserData = {
        ...userData,
        ...data,
        // Remove sensitive info
        password: undefined,
        confirmPassword: undefined
      };
      
      // Handle successful login/signup
      setIsLoading(false);
      
      // Use AuthContext login function
      login(completeUserData);
      
      // Also call the parent component callback
      onLoginSuccess(completeUserData);
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || "Something went wrong");
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          {isLogin ? "Sign In" : "Create Account"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              id="username"
              type="text"
              className="w-full p-2 border rounded-md"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          {!isLogin && (
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                className="w-full p-2 border rounded-md"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
              />
            </div>
          )}
          
          {!isLogin && (
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">
                Role/Title
              </label>
              <input
                id="role"
                type="text"
                className="w-full p-2 border rounded-md"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g., Cardiology Fellow"
              />
            </div>
          )}
          
          {!isLogin && (
            <div className="space-y-2">
              <label htmlFor="institution" className="text-sm font-medium">
                Institution
              </label>
              <input
                id="institution"
                type="text"
                className="w-full p-2 border rounded-md"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="e.g., Cleveland Clinic"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              type="password"
              className="w-full p-2 border rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          {!isLogin && (
            <div className="space-y-2">
              <label htmlFor="confirm-password" className="text-sm font-medium">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                id="confirm-password"
                type="password"
                className="w-full p-2 border rounded-md"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required={!isLogin}
              />
            </div>
          )}
          
          {error && (
            <div className="text-sm text-red-500">{error}</div>
          )}
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading
              ? "Loading..."
              : isLogin
                ? "Sign In"
                : "Create Account"
            }
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          variant="link"
          onClick={toggleMode}
          className="text-blue-600"
        >
          {isLogin
            ? "Don't have an account? Sign up"
            : "Already have an account? Sign in"
          }
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;