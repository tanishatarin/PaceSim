// import React, { useState } from "react";
// import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { useAuth } from "@/contexts/AuthContext";

// interface LoginFormProps {
//   onLoginSuccess: (userData: any) => void;
// }

// const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const { login } = useAuth();
  
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     // Validation
//     if (!username || !password) {
//       setError("Please fill in all fields");
//       return;
//     }

//     if (!isLogin && password !== confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const url = 'https://magicloops.dev/api/loop/3b49be7a-e75f-4e4c-a51e-5e9f2f151d8f/run';
      
//       const response = await fetch(url, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           username,
//           password,
//           action: isLogin ? "login" : "signup"
//         }),
//       });

//       const data = await response.json();
      
//       if (!response.ok) {
//         throw new Error(data.message || "Authentication failed");
//       }

//       // Handle successful login/signup
//       setIsLoading(false);
      
//       // Use AuthContext login function instead
//       login(data);
      
//       // Also call the parent component callback
//       onLoginSuccess(data);
//     } catch (err: any) {
//       setIsLoading(false);
//       setError(err.message || "Something went wrong");
//     }
//   };

//   const toggleMode = () => {
//     setIsLogin(!isLogin);
//     setError("");
//   };

//   return (
//     <Card className="w-full max-w-md mx-auto">
//       <CardHeader>
//         <CardTitle className="text-2xl text-center">
//           {isLogin ? "Sign In" : "Create Account"}
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="space-y-2">
//             <label htmlFor="username" className="text-sm font-medium">
//               Username
//             </label>
//             <input
//               id="username"
//               type="text"
//               className="w-full p-2 border rounded-md"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//             />
//           </div>
          
//           <div className="space-y-2">
//             <label htmlFor="password" className="text-sm font-medium">
//               Password
//             </label>
//             <input
//               id="password"
//               type="password"
//               className="w-full p-2 border rounded-md"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>
          
//           {!isLogin && (
//             <div className="space-y-2">
//               <label htmlFor="confirm-password" className="text-sm font-medium">
//                 Confirm Password
//               </label>
//               <input
//                 id="confirm-password"
//                 type="password"
//                 className="w-full p-2 border rounded-md"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//               />
//             </div>
//           )}
          
//           {error && (
//             <div className="text-sm text-red-500">{error}</div>
//           )}
          
//           <Button 
//             type="submit" 
//             className="w-full" 
//             disabled={isLoading}
//           >
//             {isLoading
//               ? "Loading..."
//               : isLogin
//                 ? "Sign In"
//                 : "Create Account"
//             }
//           </Button>
//         </form>
//       </CardContent>
//       <CardFooter className="flex justify-center">
//         <Button
//           variant="link"
//           onClick={toggleMode}
//           className="text-blue-600"
//         >
//           {isLogin
//             ? "Don't have an account? Sign up"
//             : "Already have an account? Sign in"
//           }
//         </Button>
//       </CardFooter>
//     </Card>
//   );
// };

// export default LoginForm;



// src/components/LoginForm.tsx
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { loginUser } from "@/stores/auth"; // Adjust the import path as needed

interface LoginFormProps {
  onLoginSuccess: (userData: any) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const url = 'https://magicloops.dev/api/loop/3b49be7a-e75f-4e4c-a51e-5e9f2f151d8f/run';
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          action: isLogin ? "login" : "signup"
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      // Handle successful login/signup
      setIsLoading(false);
      
      // Use auth store login function
      loginUser(data);
      
      // Also call the parent component callback
      onLoginSuccess(data);
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
              Username
            </label>
            <input
              id="username"
              type="text"
              className="w-full p-2 border rounded-md"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full p-2 border rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          {!isLogin && (
            <div className="space-y-2">
              <label htmlFor="confirm-password" className="text-sm font-medium">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                className="w-full p-2 border rounded-md"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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