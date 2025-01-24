import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="w-full max-w-2xl bg-white rounded-lg shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Welcome to the Pacemaker Simulator!</CardTitle>
        <p className="text-sm text-gray-600">External Pacemaker Simulation Platform</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-2 bg-gray-50 hover:bg-gray-100 cursor-pointer rounded">
          <p className="font-medium">Tutorial: Get to know how to play!</p>
        </div>
        {modules.map((module) => (
          <div
            key={module.id}
            className="p-2 bg-gray-50 hover:bg-gray-100 cursor-pointer rounded"
            onClick={() => onModuleSelect(module.id)}
          >
            <p className="font-medium">Module {module.id}: {module.title}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
