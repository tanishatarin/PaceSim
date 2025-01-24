import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Settings, Info, ChevronLeft } from 'lucide-react';

interface SettingsPageProps {
  onBack: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onBack }) => {
  return (
    <Card className="w-full max-w-2xl bg-white rounded-lg shadow-lg">
      <CardHeader className="flex flex-row items-center">
        <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={onBack} />
        <CardTitle className="ml-2">Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium mb-4">Device Settings</h3>
          <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              <span>Connected Device</span>
            </div>
            <Button variant="ghost" size="sm">Change</Button>
          </div>
        </div>
        <div>
          <h3 className="font-medium mb-4">Application Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                <span>Sound Alerts</span>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5" />
                <span>Notifications</span>
              </div>
              <Switch />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
