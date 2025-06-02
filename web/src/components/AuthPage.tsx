// import React, { useState } from "react";
// import LoginForm from "./LoginForm";

// interface AuthPageProps {
//   onAuthSuccess: (userData: any) => void;
// }

// const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
//   return (
//     <div className="min-h-screen bg-[#E5EDF8] flex items-center justify-center p-6">
//       <div className="w-full max-w-md">
//         <div className="mb-8 text-center">
//           <h1 className="mb-2 text-3xl font-bold text-gray-800">
//             PaceSim
//           </h1>
//           <p className="text-gray-600">
//             External Pacemaker Simulation Platform
//           </p>
//         </div>
        
//         <LoginForm onLoginSuccess={onAuthSuccess} />
        
//         <p className="mt-8 text-sm text-center text-gray-500">
//           © {new Date().getFullYear()} PaceSim. All rights reserved.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default AuthPage;


// src/components/AuthPage.tsx
import React, { useState } from "react";
import LoginForm from "./LoginForm";

interface AuthPageProps {
  onAuthSuccess: (userData: any) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  return (
    <div className="min-h-screen bg-[#E5EDF8] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-800">
            PaceSim
          </h1>
          <p className="text-gray-600">
            External Pacemaker Simulation Platform
          </p>
        </div>
        
        <LoginForm onLoginSuccess={onAuthSuccess} />
        
        <p className="mt-8 text-sm text-center text-gray-500">
          © {new Date().getFullYear()} PaceSim. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AuthPage;