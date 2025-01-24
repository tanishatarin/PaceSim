// import React from 'react';
// import { Card, CardContent } from "@/components/ui/card";
// import { Module } from '../types';

// interface LandingPageProps {
//   onModuleSelect: (moduleId: number) => void;
// }

// export const LandingPage: React.FC<LandingPageProps> = ({ onModuleSelect }) => {
//   const modules: Module[] = [
//     { id: 1, title: 'Pacemaker Calibration' },
//     { id: 2, title: 'Atrial Fibrillation' },
//     { id: 3, title: 'Tachycardia' },
//     { id: 4, title: "Why isn't the Pacemaker Working?" }
//   ];

//   return (
//     <Card className="w-full bg-white rounded-2xl shadow-xl p-8">
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold mb-2">Welcome to the Pacemaker Simulator!</h1>
//         <p className="text-gray-600">External Pacemaker Simulation Platform</p>
//       </div>
//       <CardContent className="space-y-4 p-0">
//         <div className="p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
//           <p className="font-medium">Tutorial: Get to know how to play!</p>
//         </div>
//         {modules.map((module) => (
//           <div
//             key={module.id}
//             className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
//             onClick={() => onModuleSelect(module.id)}
//           >
//             <p className="font-medium">Module {module.id}: {module.title}</p>
//           </div>
//         ))}
//       </CardContent>
//     </Card>
//   );
// };
// src/components/LandingPage.tsx
import React from 'react';
import { Card } from "@/components/ui/card";
import { Module } from '../types';

interface LandingPageProps {
  onModuleSelect: (moduleId: number) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onModuleSelect }) => {
  const modules: Module[] = [
    { id: 1, title: 'Pacemaker Calibration' },
    { id: 2, title: 'Atrial Fibrillation' },
    { id: 3, title: 'Tachycardia' },
    { id: 4, title: "Why isn't the Pacemaker Working?" }
  ];

  return (
    <Card className="w-full bg-white rounded-3xl shadow-lg p-8">
      {/* Header Section */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-black mb-2">
          Welcome to the Pacemaker Simulator!
        </h1>
        <p className="text-xl text-gray-900">
          External Pacemaker Simulation Platform
        </p>
      </div>

      {/* Modules Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Modules:</h2>
        <div className="space-y-3">
          {/* Tutorial Module */}
          <div 
            className="p-4 bg-[#F0F6FE] hover:bg-blue-100 transition-colors duration-200 rounded-lg cursor-pointer"
            onClick={() => onModuleSelect(0)}
          >
            <p className="text-gray-900 font-medium">
              Tutorial: Get to know how to play!
            </p>
          </div>

          {/* Training Modules */}
          {modules.map((module) => (
            <div
              key={module.id}
              className="p-4 bg-[#F0F6FE] hover:bg-blue-100 transition-colors duration-200 rounded-lg cursor-pointer"
              onClick={() => onModuleSelect(module.id)}
            >
              <p className="text-gray-900 font-medium">
                Module {module.id}: {module.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};