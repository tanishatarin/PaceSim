// import React, { useState } from "react";
// import {
//   ArrowLeft,
//   Bluetooth,
//   Volume2,
//   Bell,
//   HelpCircle,
//   Shield,
//   Monitor,
//   LogOut,
// } from "lucide-react";
// import { Card } from "@/components/ui/card";
// import { Switch } from "@/components/ui/switch";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";

// interface SettingsPageProps {
//   onBack: () => void;
//   onLogout: () => void;
// }

// export const SettingsPage: React.FC<SettingsPageProps> = ({ onBack, onLogout }) => {
//   const [bluetoothStatus] = useState("Connected to PM-2023X");

//   return (
//     <Card className="w-full p-8 bg-white shadow-xl rounded-2xl">
//       {/* Header */}
//       <div className="flex items-center mb-8">
//         <button onClick={onBack} className="mr-4">
//           <ArrowLeft className="w-6 h-6 text-gray-600" />
//         </button>
//         <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
//       </div>

//       {/* Device Settings */}
//       <div className="mb-8">
//         <h3 className="mb-4 text-lg font-medium text-gray-700">
//           Device Settings
//         </h3>
//         <div className="space-y-4">
//           {/* Connected Device */}
//           <div className="p-4 bg-blue-50 rounded-xl">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-3">
//                 <Bluetooth className="w-5 h-5 text-blue-600" />
//                 <div>
//                   <div className="font-medium">Connected Device</div>
//                   <div className="text-sm text-gray-600">{bluetoothStatus}</div>
//                 </div>
//               </div>
//               <Button
//                 variant="ghost"
//                 className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
//               >
//                 Change
//               </Button>
//             </div>
//           </div>

//           {/* Display Mode */}
//           <div className="flex items-center justify-between p-4">
//             <div className="flex items-center space-x-3">
//               <Monitor className="w-5 h-5 text-gray-600" />
//               <span className="font-medium">Display Mode</span>
//             </div>
//             <Select defaultValue="standard">
//               <SelectTrigger className="w-40">
//                 <SelectValue placeholder="Select display mode" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="standard">Standard</SelectItem>
//                 <SelectItem value="high-contrast">High Contrast</SelectItem>
//                 <SelectItem value="night">Night Mode</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>
//       </div>

//       {/* Application Settings */}
//       <div className="mb-8">
//         <h3 className="mb-4 text-lg font-medium text-gray-700">
//           Application Settings
//         </h3>
//         <div className="space-y-4">
//           {/* Sound Alerts */}
//           <div className="flex items-center justify-between p-4">
//             <div className="flex items-center space-x-3">
//               <Volume2 className="w-5 h-5 text-gray-600" />
//               <span className="font-medium">Sound Alerts</span>
//             </div>
//             <Switch />
//           </div>

//           {/* Notifications */}
//           <div className="flex items-center justify-between p-4">
//             <div className="flex items-center space-x-3">
//               <Bell className="w-5 h-5 text-gray-600" />
//               <span className="font-medium">Notifications</span>
//             </div>
//             <Switch />
//           </div>
//         </div>
//       </div>

//       {/* Help & Support */}
//       <div className="mb-8">
//         <h3 className="mb-4 text-lg font-medium text-gray-700">
//           Help & Support
//         </h3>
//         <div className="space-y-4">
//           {/* View Tutorial */}
//           <div className="flex items-center p-4 space-x-3 rounded-lg cursor-pointer hover:bg-gray-50">
//             <HelpCircle className="w-5 h-5 text-gray-600" />
//             <span className="font-medium">View Tutorial</span>
//           </div>

//           {/* About PaceSim */}
//           <div className="flex items-center p-4 space-x-3 rounded-lg cursor-pointer hover:bg-gray-50">
//             <Shield className="w-5 h-5 text-gray-600" />
//             <span className="font-medium">About PaceSim</span>
//           </div>
//         </div>
//       </div>

//       {/* Account Section */}
//       <div>
//         <h3 className="mb-4 text-lg font-medium text-gray-700">
//           Account
//         </h3>
//         <div className="space-y-4">
//           {/* Logout Button */}
//           <div 
//             className="flex items-center p-4 space-x-3 text-red-600 rounded-lg cursor-pointer hover:bg-red-50"
//             onClick={onLogout}  
//           >
//             <LogOut className="w-5 h-5" />
//             <span className="font-medium">Logout</span>
//           </div>
//         </div>
//       </div>
//     </Card>
//   );
// };

// export default SettingsPage;







// src/components/SettingsPage.tsx - Fixed SettingsPage with router navigation
import React from "react";
import { ArrowLeft, HelpCircle, Shield, LogOut } from "lucide-react";
import { Card } from "@/components/ui/card";
import { goHome } from '@/stores/router';
import { logoutUser } from '@/stores/auth';

export const SettingsPage: React.FC = () => {
  const handleLogout = () => {
    logoutUser();
  };

  const appVersion = "1.0.0"; // You can import this from package.json

  return (
    <Card className="w-full p-8 bg-white shadow-xl rounded-2xl">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button onClick={goHome} className="mr-4">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
      </div>

      {/* Help & Support */}
      <div className="mb-8">
        <h3 className="mb-4 text-lg font-medium text-gray-700">
          Help & Support
        </h3>
        <div className="space-y-4">
          {/* About PaceSim */}
          <div 
            className="flex items-start p-4 space-x-3 rounded-lg cursor-pointer hover:bg-gray-50"
            onClick={() => {
              alert(`PaceSim v${appVersion}\n\nExternal Pacemaker Simulation Platform\nDeveloped for Johns Hopkins University\n\n© 2025 PaceSim Team`)
            }}
          >
            <Shield className="w-5 h-5 mt-1 text-gray-600" />
            <div>
              <span className="font-medium">About PaceSim</span>
              <p className="text-sm text-gray-600 mt-1">
                Version {appVersion} - External Pacemaker Simulation Platform
              </p>
            </div>
          </div>

          {/* Help Documentation */}
          <div 
            className="flex items-start p-4 space-x-3 rounded-lg cursor-pointer hover:bg-gray-50"
            onClick={() => {
              alert("Help documentation coming soon!")
            }}
          >
            <HelpCircle className="w-5 h-5 mt-1 text-gray-600" />
            <div>
              <span className="font-medium">Help Documentation</span>
              <p className="text-sm text-gray-600 mt-1">
                Learn how to use the pacemaker simulator
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="mb-8">
        <h3 className="mb-4 text-lg font-medium text-gray-700">
          System Information
        </h3>
        <div className="p-4 bg-gray-50 rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Application Version:</span>
            <span className="font-medium">{appVersion}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Platform:</span>
            <span className="font-medium">Web Application</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Institution:</span>
            <span className="font-medium">Johns Hopkins University</span>
          </div>
        </div>
      </div>

      {/* Account Section */}
      <div>
        <h3 className="mb-4 text-lg font-medium text-gray-700">
          Account
        </h3>
        <div className="space-y-4">
          {/* Logout Button */}
          <div 
            className="flex items-center p-4 space-x-3 text-red-600 rounded-lg cursor-pointer hover:bg-red-50"
            onClick={handleLogout}  
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </div>
        </div>
      </div>
    </Card>
  );
};