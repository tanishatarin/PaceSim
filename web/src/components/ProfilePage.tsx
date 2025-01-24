import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, ChevronLeft } from 'lucide-react';
import { Session } from '../types';

interface ProfilePageProps {
  onBack: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onBack }) => {
  const recentSessions: Session[] = [
    { name: 'Atrial Fibrillation', date: 'Today', status: 'Completed' },
    { name: 'Basic Calibration', date: 'Yesterday', status: 'Completed' },
    { name: 'Tachycardia', date: '2 days ago', status: 'In Progress' }
  ];

  return (
    <Card className="w-full max-w-2xl bg-white rounded-lg shadow-lg">
      <CardHeader className="flex flex-row items-center">
        <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={onBack} />
        <CardTitle className="ml-2">Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium">Dr. Sarah Johnson</h3>
            <p className="text-sm text-gray-600">Cardiology Fellow</p>
            <p className="text-sm text-gray-600">Cleveland Clinic</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-600">Training Time</p>
            <p className="font-medium">12.5 hrs</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Success Rate</p>
            <p className="font-medium">85%</p>
          </div>
        </div>
        <div>
          <h4 className="font-medium mb-3">Recent Sessions</h4>
          <div className="space-y-2">
            {recentSessions.map((session, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">{session.name}</p>
                  <p className="text-sm text-gray-600">{session.date}</p>
                </div>
                <span className={`text-sm ${
                  session.status === 'Completed' ? 'text-green-600' : 'text-blue-600'
                }`}>
                  {session.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
