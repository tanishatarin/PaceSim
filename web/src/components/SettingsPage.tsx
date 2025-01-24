// import React from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Switch } from "@/components/ui/switch";
// import { Settings, Info, ChevronLeft } from 'lucide-react';

// interface SettingsPageProps {
//   onBack: () => void;
// }

// export const SettingsPage: React.FC<SettingsPageProps> = ({ onBack }) => {
//   return (
//     <Card className="w-full max-w-2xl bg-white rounded-lg shadow-lg">
//       <CardHeader className="flex flex-row items-center">
//         <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={onBack} />
//         <CardTitle className="ml-2">Settings</CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-6">
//         <div>
//           <h3 className="font-medium mb-4">Device Settings</h3>
//           <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
//             <div className="flex items-center gap-2">
//               <Settings className="w-5 h-5" />
//               <span>Connected Device</span>
//             </div>
//             <Button variant="ghost" size="sm">Change</Button>
//           </div>
//         </div>
//         <div>
//           <h3 className="font-medium mb-4">Application Settings</h3>
//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <Settings className="w-5 h-5" />
//                 <span>Sound Alerts</span>
//               </div>
//               <Switch />
//             </div>
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <Info className="w-5 h-5" />
//                 <span>Notifications</span>
//               </div>
//               <Switch />
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };
// src/components/SettingsPage.tsx
import React, { useState } from 'react';
import { ArrowLeft, Bluetooth, Volume2, Bell, HelpCircle, Shield, Monitor } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface SettingsPageProps {
  onBack: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onBack }) => {
  const [bluetoothStatus] = useState('Connected to PM-2023X');
  
  return (
    <Card className="w-full bg-white rounded-2xl shadow-xl p-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button onClick={onBack} className="mr-4">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
      </div>

      {/* Device Settings */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Device Settings</h3>
        <div className="space-y-4">
          {/* Connected Device */}
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bluetooth className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium">Connected Device</div>
                  <div className="text-sm text-gray-600">{bluetoothStatus}</div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
              >
                Change
              </Button>
            </div>
          </div>

          {/* Display Mode */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <Monitor className="w-5 h-5 text-gray-600" />
              <span className="font-medium">Display Mode</span>
            </div>
            <Select defaultValue="standard">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select display mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="high-contrast">High Contrast</SelectItem>
                <SelectItem value="night">Night Mode</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Application Settings */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Application Settings</h3>
        <div className="space-y-4">
          {/* Sound Alerts */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <Volume2 className="w-5 h-5 text-gray-600" />
              <span className="font-medium">Sound Alerts</span>
            </div>
            <Switch />
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="font-medium">Notifications</span>
            </div>
            <Switch />
          </div>
        </div>
      </div>

      {/* Help & Support */}
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-4">Help & Support</h3>
        <div className="space-y-4">
          {/* View Tutorial */}
          <div className="flex items-center space-x-3 p-4 hover:bg-gray-50 rounded-lg cursor-pointer">
            <HelpCircle className="w-5 h-5 text-gray-600" />
            <span className="font-medium">View Tutorial</span>
          </div>

          {/* About PaceSim */}
          <div className="flex items-center space-x-3 p-4 hover:bg-gray-50 rounded-lg cursor-pointer">
            <Shield className="w-5 h-5 text-gray-600" />
            <span className="font-medium">About PaceSim</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SettingsPage;