import React from "react";
import { Card } from "@/components/ui/card";
import { Module } from "../types";

interface LandingPageProps {
  onModuleSelect: (moduleId: number) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onModuleSelect }) => {
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
