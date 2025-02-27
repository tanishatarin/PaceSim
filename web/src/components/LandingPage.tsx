// src/components/LandingPage.tsx
import React from "react";
import { Card } from "@/components/ui/card";
import { Module } from "../types";
import { useAuth } from "@/contexts/AuthContext";
import { useSession } from "@/contexts/SessionContext";
import { Award, Clock, CheckCircle2 } from "lucide-react";

interface LandingPageProps {
  onModuleSelect: (moduleId: number) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onModuleSelect }) => {
  const { user, stats } = useAuth();
  const { recentSessions } = useSession();

  const modules: Module[] = [
    { id: 1, title: "Pacemaker Calibration" },
    { id: 2, title: "3rd Degree Block" },
    { id: 3, title: "Atrial Fibrillation" },
    { id: 4, title: "Slow 2nd degree block" },
    { id: 5, title: "Slow Junctional Rhythm" },
    { id: 6, title: "Failure to sense" },
    { id: 7, title: "Bariatric capture" },
    { id: 8, title: "Asystole" },
  ];

  // Check if a module is completed
  const isModuleCompleted = (moduleId: number) => {
    return recentSessions.some(
      (session) => session.moduleId === moduleId && session.completed
    );
  };

  // Count completed modules
  const completedModulesCount = modules.filter(module => 
    isModuleCompleted(module.id)
  ).length;

  // Format time in hours
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}${mins > 0 ? `.${mins}` : ''} hrs`;
  };

  return (
    <Card className="w-full p-8 bg-white shadow-lg rounded-3xl">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-black">
          Welcome back, {user?.name.split(' ')[0]}!
        </h1>
        <p className="text-xl text-gray-900">
          External Pacemaker Simulation Platform
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-3">
        <div className="flex items-center p-4 space-x-4 bg-blue-50 rounded-xl">
          <div className="p-3 bg-blue-100 rounded-full">
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-blue-600">Training Time</p>
            <p className="text-xl font-bold text-blue-800">
              {stats ? formatTime(stats.totalTime) : '0 hrs'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center p-4 space-x-4 bg-green-50 rounded-xl">
          <div className="p-3 bg-green-100 rounded-full">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-green-600">Modules Completed</p>
            <p className="text-xl font-bold text-green-800">
              {completedModulesCount}/{modules.length}
            </p>
          </div>
        </div>
        
        <div className="flex items-center p-4 space-x-4 bg-purple-50 rounded-xl">
          <div className="p-3 bg-purple-100 rounded-full">
            <Award className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-purple-600">Success Rate</p>
            <p className="text-xl font-bold text-purple-800">
              {stats ? `${stats.successRate}%` : '0%'}
            </p>
          </div>
        </div>
      </div>

      {/* Continue Session (if there's an incomplete session) */}
      {recentSessions.some(session => !session.completed) && (
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold">Continue Your Progress</h2>
          {recentSessions
            .filter(session => !session.completed)
            .slice(0, 1)
            .map(session => (
              <div 
                key={session.id}
                className="p-4 transition-colors duration-200 border border-yellow-200 rounded-lg cursor-pointer bg-yellow-50 hover:bg-yellow-100"
                onClick={() => onModuleSelect(session.moduleId)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{session.moduleName}</p>
                    <p className="text-sm text-gray-600">In progress</p>
                  </div>
                  <span className="font-medium text-yellow-600">Continue →</span>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Modules Section */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Modules:</h2>
        <div className="space-y-3">
          {/* Tutorial Module */}
          <div
            className="p-4 bg-[#F0F6FE] hover:bg-blue-100 transition-colors duration-200 rounded-lg cursor-pointer flex justify-between items-center"
            onClick={() => onModuleSelect(0)}
          >
            <div>
              <p className="font-medium text-gray-900">
                Tutorial: Get to know how to play!
              </p>
              <p className="text-sm text-gray-600">Recommended for beginners</p>
            </div>
            {isModuleCompleted(0) && (
              <div className="p-1 bg-green-100 rounded-full">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
            )}
          </div>

          {/* Training Modules */}
          {modules.map((module) => (
            <div
              key={module.id}
              className="p-4 bg-[#F0F6FE] hover:bg-blue-100 transition-colors duration-200 rounded-lg cursor-pointer flex justify-between items-center"
              onClick={() => onModuleSelect(module.id)}
            >
              <div>
                <p className="font-medium text-gray-900">
                  Module {module.id}: {module.title}
                </p>
              </div>
              {isModuleCompleted(module.id) && (
                <div className="p-1 bg-green-100 rounded-full">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default LandingPage;