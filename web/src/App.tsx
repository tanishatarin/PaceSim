// import React, { useState } from "react";
// import { Layout } from "./components/Layout";
// import { LandingPage } from "./components/LandingPage";
// import { SettingsPage } from "./components/SettingsPage";
// import { ProfilePage } from "./components/ProfilePage";
// import { ModulePage } from "./components/ModulePage";
// import AuthPage from "./components/AuthPage";
// import { useAuth } from "./contexts/AuthContext";
// import TestModal from "./components/testmodal";


// type Page = "landing" | "settings" | "profile" | "module";

// const App: React.FC = () => {
//   const [currentPage, setCurrentPage] = useState<Page>("landing");
//   const [selectedModuleId, setSelectedModuleId] = useState<number>(1);
//   const { isAuthenticated, userData, logout } = useAuth();

//   const handleModuleSelect = (moduleId: number) => {
//     setSelectedModuleId(moduleId);
//     setCurrentPage("module");
//   };

//   const handleAuthSuccess = (userData: any) => {
//     // This is now handled by the AuthContext
//     setCurrentPage("landing");
//   };

//   const renderCurrentPage = () => {
//     switch (currentPage) {
//       case "landing":
//         return <LandingPage onModuleSelect={handleModuleSelect} />;
//       case "settings":
//         return <SettingsPage onBack={() => setCurrentPage("landing")} onLogout={logout} />;
//       case "profile":
//         return <ProfilePage onBack={() => setCurrentPage("landing")} userData={userData} />;
//       case "module":
//         return (
//           <ModulePage
//             moduleId={selectedModuleId}
//             onBack={() => setCurrentPage("landing")}
//           />
//         );
//     }
//   };

//   // if (!isAuthenticated) {
//   //   return <AuthPage onAuthSuccess={handleAuthSuccess} />;
//   // }

//   return (
//     <div className="min-h-screen bg-[#E5EDF8] p-6">
//       <Layout onNavigate={setCurrentPage}>{renderCurrentPage()}</Layout>
//     </div>
//   );
// };

// export default App;





// src/App.tsx - Fixed to handle router correctly
import React, { useEffect } from "react";
import { useStore } from '@nanostores/react'
import { $router, goHome } from './stores/router'
import { $isAuthenticated, $authLoading, initAuth } from './stores/auth'
import { Layout } from "./components/Layout";
import { LandingPage } from "./components/LandingPage";
import { SettingsPage } from "./components/SettingsPage";
import { ProfilePage } from "./components/ProfilePage";
import { ModulePage } from "./components/ModulePage";
import AuthPage from "./components/AuthPage";
import { SessionProvider } from "./contexts/SessionContext";

const App: React.FC = () => {
  const page = useStore($router)
  const isAuthenticated = useStore($isAuthenticated)
  const authLoading = useStore($authLoading)

  useEffect(() => {
    initAuth()
  }, [])

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#E5EDF8] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Handle auth pages
  const handleAuthSuccess = () => {
    goHome()
  }

  // Get current route info
  const currentRoute = page?.route || 'home'
  const params: { id?: string } = page?.params || {}

  // Redirect to login if not authenticated
  if (!isAuthenticated && currentRoute !== 'login') {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />
  }

  // Redirect to home if authenticated but on login page
  if (isAuthenticated && currentRoute === 'login') {
    goHome()
    return null
  }

  const renderPage = () => {
    switch (currentRoute) {
      case 'home':
        return <LandingPage />
      case 'module':
        const moduleId = parseInt(params.id || '1')
        return <ModulePage moduleId={moduleId} />
      case 'settings':
        return <SettingsPage />
      case 'profile':
        return <ProfilePage />
      default:
        return <LandingPage />
    }
  }

  return (
    <SessionProvider>
      <div className="min-h-screen bg-[#E5EDF8] p-6">
        <Layout>{renderPage()}</Layout>
      </div>
    </SessionProvider>
  );
};

export default App;