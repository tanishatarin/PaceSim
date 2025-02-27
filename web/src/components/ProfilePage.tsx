// src/components/ProfilePage.tsx
import React from "react";
import { ArrowLeft, User, Clock, Award, History, LogOut } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useSession } from "@/contexts/SessionContext";

interface ProfilePageProps {
  onBack: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onBack }) => {
  const { user, stats, logout } = useAuth();
  const { recentSessions } = useSession();

  // Format the time in hours and minutes
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}${mins > 0 ? `.${mins}` : ''} hrs`;
  };

  // Format date for display
  const formatDate = (date: Date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const sessionDate = new Date(date);
    const sessionDay = new Date(
      sessionDate.getFullYear(),
      sessionDate.getMonth(),
      sessionDate.getDate()
    );
    
    if (sessionDay.getTime() === today.getTime()) {
      return "Today";
    } else if (sessionDay.getTime() === yesterday.getTime()) {
      return "Yesterday";
    } else {
      // Calculate days difference
      const diffTime = Math.abs(today.getTime() - sessionDay.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 7) {
        return `${diffDays} days ago`;
      } else {
        return sessionDate.toLocaleDateString();
      }
    }
  };

  // Get the 3 most recent sessions
  const latestSessions = recentSessions.slice(0, 3);

  // Handle logout
  const handleLogout = () => {
    logout();
  };

  return (
    <Card className="w-full p-8 bg-white shadow-xl rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button onClick={onBack} className="mr-4">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-gray-600 hover:text-red-600"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      {/* Basic Info */}
      <div className="flex items-center mb-8">
        <div className="flex items-center justify-center w-20 h-20 mr-6 bg-blue-100 rounded-full">
          <User className="w-10 h-10 text-blue-600" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            {user?.name}
          </h3>
          <p className="text-gray-600">{user?.role}</p>
          {user?.institution && (
            <p className="text-sm text-gray-500">{user.institution}</p>
          )}
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center mb-1 text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            <span className="text-sm">Training Time</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {stats ? formatTime(stats.totalTime) : '0 hrs'}
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center mb-1 text-gray-600">
            <Award className="w-4 h-4 mr-2" />
            <span className="text-sm">Success Rate</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {stats ? `${stats.successRate}%` : '0%'}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center mb-4">
          <History className="w-5 h-5 mr-2 text-gray-600" />
          <h4 className="font-semibold text-gray-700">Last {latestSessions.length} Sessions</h4>
        </div>
        <div className="space-y-3">
          {latestSessions.length > 0 ? (
            latestSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0"
              >
                <div>
                  <div className="font-medium text-gray-800">
                    {session.moduleName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(session.startTime)}
                  </div>
                </div>
                <span
                  className={`text-sm ${
                    session.completed
                      ? "text-green-600"
                      : "text-blue-600"
                  }`}
                >
                  {session.completed ? "Completed" : "In Progress"}
                </span>
              </div>
            ))
          ) : (
            <div className="py-4 text-center text-gray-500">
              No sessions yet
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProfilePage;