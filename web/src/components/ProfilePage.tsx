import React from 'react';
import { ArrowLeft, User, Clock, Award, History } from 'lucide-react';
import { Card } from "@/components/ui/card";

interface ProfilePageProps {
  onBack: () => void;
}

interface Session {
  scenario: string;
  date: string;
  status: 'Completed' | 'In Progress';
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onBack }) => {
  const sessions: Session[] = [
    { scenario: "Atrial Fibrillation", date: "Today", status: "Completed" },
    { scenario: "Basic Calibration", date: "Yesterday", status: "Completed" },
    { scenario: "Tachycardia", date: "3 days ago", status: "In Progress" }
  ];

  return (
    <Card className="w-full bg-white rounded-2xl shadow-xl p-8">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="mr-4">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
      </div>

      {/* Basic Info */}
      <div className="mb-8 flex items-center">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mr-6">
          <User className="w-10 h-10 text-blue-600" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Dr. Sarah Johnson</h3>
          <p className="text-gray-600">Cardiology Fellow</p>
          <p className="text-sm text-gray-500">Cleveland Clinic</p>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center text-gray-600 mb-1">
            <Clock className="w-4 h-4 mr-2" />
            <span className="text-sm">Training Time</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">12.5 hrs</div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center text-gray-600 mb-1">
            <Award className="w-4 h-4 mr-2" />
            <span className="text-sm">Success Rate</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">85%</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex items-center mb-4">
          <History className="w-5 h-5 text-gray-600 mr-2" />
          <h4 className="font-semibold text-gray-700">Last 3 Sessions</h4>
        </div>
        <div className="space-y-3">
          {sessions.map((session, i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
              <div>
                <div className="font-medium text-gray-800">{session.scenario}</div>
                <div className="text-sm text-gray-500">{session.date}</div>
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
    </Card>
  );
};
