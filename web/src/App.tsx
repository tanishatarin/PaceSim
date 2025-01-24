// import React from 'react';
// import { Button } from "@/components/ui/button";
// import { Settings, User } from 'lucide-react';
// import { LandingPage } from './components/LandingPage';
// import { SettingsPage } from './components/SettingsPage';
// import { ProfilePage } from './components/ProfilePage';
// import { ModulePage } from './components/ModulePage';

// type Page = 'landing' | 'settings' | 'profile' | 'module';

// const App: React.FC = () => {
//   const [currentPage, setCurrentPage] = React.useState<Page>('landing');
//   const [selectedModuleId, setSelectedModuleId] = React.useState<number>(1);

//   const handleModuleSelect = (moduleId: number) => {
//     setSelectedModuleId(moduleId);
//     setCurrentPage('module');
//   };

//   const renderCurrentPage = () => {
//     switch (currentPage) {
//       case 'landing':
//         return <LandingPage onModuleSelect={handleModuleSelect} />;
//       case 'settings':
//         return <SettingsPage onBack={() => setCurrentPage('landing')} />;
//       case 'profile':
//         return <ProfilePage onBack={() => setCurrentPage('landing')} />;
//       case 'module':
//         return <ModulePage moduleId={selectedModuleId} onBack={() => setCurrentPage('landing')} />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
//       <div className="w-full max-w-2xl mb-6 flex justify-end gap-4">
//         <Button
//           variant="ghost"
//           size="icon"
//           onClick={() => setCurrentPage('settings')}
//         >
//           <Settings className="w-5 h-5" />
//         </Button>
//         <Button
//           variant="ghost"
//           size="icon"
//           onClick={() => setCurrentPage('profile')}
//         >
//           <User className="w-5 h-5" />
//         </Button>
//       </div>
//       {renderCurrentPage()}
//     </div>
//   );
// };

// export default App;
import React from 'react';
import { Layout } from './components/Layout';
import { LandingPage } from './components/LandingPage';
import { SettingsPage } from './components/SettingsPage';
import { ProfilePage } from './components/ProfilePage';
import { ModulePage } from './components/ModulePage';

type Page = 'landing' | 'settings' | 'profile' | 'module';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = React.useState<Page>('landing');
  const [selectedModuleId, setSelectedModuleId] = React.useState<number>(1);

  const handleModuleSelect = (moduleId: number) => {
    setSelectedModuleId(moduleId);
    setCurrentPage('module');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onModuleSelect={handleModuleSelect} />;
      case 'settings':
        return <SettingsPage onBack={() => setCurrentPage('landing')} />;
      case 'profile':
        return <ProfilePage onBack={() => setCurrentPage('landing')} />;
      case 'module':
        return <ModulePage moduleId={selectedModuleId} onBack={() => setCurrentPage('landing')} />;
    }
  };

  return (
    <Layout onNavigate={setCurrentPage}>
      {renderCurrentPage()}
    </Layout>
  );
};

export default App;