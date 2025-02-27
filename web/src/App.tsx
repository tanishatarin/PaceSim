// src/App.tsx
import React from "react";
import { Layout } from "./components/Layout";
import { LandingPage } from "./components/LandingPage";
import { SettingsPage } from "./components/SettingsPage";
import { ProfilePage } from "./components/ProfilePage";
import { ModulePage } from "./components/ModulePage";
import AuthWrapper from "./components/backend/AuthWrapper";
import { AuthProvider } from "./contexts/AuthContext";
import { SessionProvider } from "./contexts/SessionContext";

type Page = "landing" | "settings" | "profile" | "module";

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = React.useState<Page>("landing");
  const [selectedModuleId, setSelectedModuleId] = React.useState<number>(1);

  const handleModuleSelect = (moduleId: number) => {
    setSelectedModuleId(moduleId);
    setCurrentPage("module");
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "landing":
        return <LandingPage onModuleSelect={handleModuleSelect} />;
      case "settings":
        return <SettingsPage onBack={() => setCurrentPage("landing")} />;
      case "profile":
        return <ProfilePage onBack={() => setCurrentPage("landing")} />;
      case "module":
        return (
          <ModulePage
            moduleId={selectedModuleId}
            onBack={() => setCurrentPage("landing")}
          />
        );
    }
  };

  return (
    <AuthProvider>
      <SessionProvider>
        <AuthWrapper>
          <div className="min-h-screen bg-[#E5EDF8] p-6">
            <Layout onNavigate={setCurrentPage}>{renderCurrentPage()}</Layout>
          </div>
        </AuthWrapper>
      </SessionProvider>
    </AuthProvider>
  );
};

export default App;