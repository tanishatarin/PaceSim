import React, { useState } from "react";
import { Layout } from "./components/Layout";
import { LandingPage } from "./components/LandingPage";
import { SettingsPage } from "./components/SettingsPage";
import { ProfilePage } from "./components/ProfilePage";
import { ModulePage } from "./components/ModulePage";
import AuthPage from "./components/AuthPage";
import { useAuth } from "./contexts/AuthContext";

type Page = "landing" | "settings" | "profile" | "module";

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>("landing");
  const [selectedModuleId, setSelectedModuleId] = useState<number>(1);
  const { isAuthenticated, userData, logout } = useAuth();

  const handleModuleSelect = (moduleId: number) => {
    setSelectedModuleId(moduleId);
    setCurrentPage("module");
  };

  const handleAuthSuccess = (userData: any) => {
    // This is now handled by the AuthContext
    setCurrentPage("landing");
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "landing":
        return <LandingPage onModuleSelect={handleModuleSelect} />;
      case "settings":
        return <SettingsPage onBack={() => setCurrentPage("landing")} onLogout={logout} />;
      case "profile":
        return <ProfilePage onBack={() => setCurrentPage("landing")} userData={userData} />;
      case "module":
        return (
          <ModulePage
            moduleId={selectedModuleId}
            onBack={() => setCurrentPage("landing")}
          />
        );
    }
  };

  if (!isAuthenticated) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#E5EDF8] p-6">
      <Layout onNavigate={setCurrentPage}>{renderCurrentPage()}</Layout>
    </div>
  );
};

export default App;