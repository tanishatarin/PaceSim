// import React, { useState } from "react";
// import { Settings, User, LogOut, Home } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useAuth } from "@/contexts/AuthContext";

// type Page = "landing" | "settings" | "profile" | "module";

// interface LayoutProps {
//   children: React.ReactNode;
//   onNavigate: (page: Page) => void;
// }

// export const Layout: React.FC<LayoutProps> = ({ children, onNavigate }) => {
//   const { userData, logout } = useAuth();
//   const [showUserMenu, setShowUserMenu] = useState(false);

//   const handleLogout = () => {
//     logout();
//     setShowUserMenu(false);
//   };
  
//   return (
//     <div className="min-h-screen bg-[#E5EDF8] p-6">
//       <div className="max-w-4xl mx-auto">
//         <div className="flex items-center justify-between mb-6">
//           {/* Left side - logo/home */}
//           <button 
//             onClick={() => onNavigate("landing")}
//             className="flex items-center text-blue-700 hover:text-blue-900"
//           >
//             <Home className="w-6 h-6 mr-2" />
//             <span className="text-xl font-bold">PaceSim</span>
//           </button>
          
//           {/* Right side - user menu */}
//           <div className="flex items-center gap-4">
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => onNavigate("settings")}
//               title="Settings"
//             >
//               <Settings className="w-5 h-5" />
//             </Button>
            
//             {/* User profile button with dropdown */}
//             <div className="relative">
//               <Button
//                 variant="ghost"
//                 className="flex items-center gap-2"
//                 onClick={() => setShowUserMenu(!showUserMenu)}
//               >
//                 <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
//                   <User className="w-4 h-4 text-blue-700" />
//                 </div>
//                 <span className="hidden text-sm font-medium md:inline-block">  {userData?.name?.split(' ')[0] ?? ""}
//                 </span>
//               </Button>
              
//               {/* Dropdown menu */}
//               {showUserMenu && (
//                 <div className="absolute right-0 z-10 w-48 mt-2 bg-white rounded-md shadow-lg">
//                   <div className="py-1">
//                     <button
//                       onClick={() => {
//                         onNavigate("profile");
//                         setShowUserMenu(false);
//                       }}
//                       className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
//                     >
//                       <User className="inline-block w-4 h-4 mr-2" />
//                       View Profile
//                     </button>
//                     <button
//                       onClick={handleLogout}
//                       className="block w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100"
//                     >
//                       <LogOut className="inline-block w-4 h-4 mr-2" />
//                       Logout
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//         {children}
//       </div>
//     </div>
//   );
// };


// export default Layout;






// src/components/Layout.tsx - Fixed to handle router correctly
import React, { useState } from "react";
import { Settings, User, LogOut, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from '@nanostores/react'
import { $router, goHome, goToSettings, goToProfile } from '@/stores/router'
import { $userData, logoutUser } from '@/stores/auth'

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const userData = useStore($userData)
  const page = useStore($router)
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logoutUser()
    setShowUserMenu(false);
  };

  const navigateProfile = () => {
    goToProfile()
    setShowUserMenu(false)
  }

  // Get current route info
  const currentRoute = page?.route || 'home'
  const params: { id?: string } = page?.params || {}
  
  return (
    <div className="min-h-screen bg-[#E5EDF8] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          {/* Left side - logo/home */}
          <button 
            onClick={goHome}
            className="flex items-center text-blue-700 hover:text-blue-900"
          >
            <Home className="w-6 h-6 mr-2" />
            <span className="text-xl font-bold">PaceSim</span>
          </button>

          {/* Breadcrumb navigation */}
          <div className="flex items-center text-sm text-gray-600">
            <button 
              onClick={goHome}
              className="hover:text-blue-600"
            >
              Home
            </button>
            {currentRoute === 'module' && (
              <>
                <span className="mx-2">/</span>
                <span>Module {params.id}</span>
              </>
            )}
            {currentRoute === 'settings' && (
              <>
                <span className="mx-2">/</span>
                <span>Settings</span>
              </>
            )}
            {currentRoute === 'profile' && (
              <>
                <span className="mx-2">/</span>
                <span>Profile</span>
              </>
            )}
          </div>
          
          {/* Right side - user menu */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={goToSettings}
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </Button>
            
            {/* User profile button with dropdown */}
            <div className="relative">
              <Button
                variant="ghost"
                className="flex items-center gap-2"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                  <User className="w-4 h-4 text-blue-700" />
                </div>
                <span className="hidden text-sm font-medium md:inline-block">
                  {userData?.name?.split(' ')[0] ?? ""}
                </span>
              </Button>
              
              {/* Dropdown menu */}
              {showUserMenu && (
                <div className="absolute right-0 z-10 w-48 mt-2 bg-white rounded-md shadow-lg">
                  <div className="py-1">
                    <button
                      onClick={navigateProfile}
                      className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                    >
                      <User className="inline-block w-4 h-4 mr-2" />
                      View Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100"
                    >
                      <LogOut className="inline-block w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};