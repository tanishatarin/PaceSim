import React, { useState } from 'react';
import { Activity, ArrowLeft, Lightbulb } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ModulePageProps {
  moduleId: number;
  onBack: () => void;
}

interface SensorStates {
  left: boolean;
  right: boolean;
}

interface PacemakerInfo {
  label: string;
  value: string;
}

export const ModulePage: React.FC<ModulePageProps> = ({ moduleId, onBack }) => {
  const [sensorStates, setSensorStates] = useState<SensorStates>({ 
    left: false, 
    right: false 
  });

  const pacemakerInfo: PacemakerInfo[] = [
    { label: "Rate", value: "70 PPM" },
    { label: "A Output", value: "3.5 mA" },
    { label: "V Output", value: "3.5 mA" },
    { label: "V Sensitivity", value: "2.0 mA" },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-1">
            Module {moduleId}
          </h2>
          <h3 className="text-xl text-gray-600">Pacemaker Calibration</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="bg-blue-100 hover:bg-blue-200"
        >
          <Lightbulb className="w-6 h-6 text-blue-600" />
          <span className="sr-only">Hint</span>
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-8">
        {/* Left Column (Spans 2 columns) */}
        <div className="col-span-2">
          {/* Objective Section */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <h4 className="font-semibold text-gray-700 mb-2">Objective</h4>
            <p className="text-gray-600">
              Conduct a Routine Temporary External Pacemaker Calibration
            </p>
          </div>

          {/* Step Section */}
          <div className="bg-pink-50 rounded-xl p-4 mb-4">
            <h4 className="font-semibold text-gray-700 mb-2">
              Step 1: Set the Sensing Threshold
            </h4>
            <div className="bg-white rounded-lg p-4 mt-2">
              <Activity className="w-full h-32 text-red-500" />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Sensing Lights */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-700 mb-4">Sensing Lights</h4>
            <div className="flex justify-around">
              {[sensorStates.left, sensorStates.right].map((active, i) => (
                <div
                  key={i}
                  className={`w-12 h-12 rounded-full ${
                    active ? 'bg-green-500' : 'bg-gray-300'
                  } transition-colors duration-300`}
                />
              ))}
            </div>
          </div>

          {/* Pacemaker Info */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-700 mb-4">Pacemaker Info</h4>
            <div className="space-y-2 text-sm">
              {pacemakerInfo.map((info, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-gray-600">{info.label}:</span>
                  <span className="font-medium text-gray-800">{info.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Exit Button */}
      <Button
        variant="ghost"
        className="mt-6 text-gray-600 hover:text-gray-800"
        onClick={onBack}
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Exit Game
      </Button>
    </div>
  );
};