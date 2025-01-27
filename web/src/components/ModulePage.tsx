import React, { useState } from 'react';
import { ArrowLeft, Lightbulb, Activity } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ECGVisualizer from "@/components/ECGVisualizer";

interface ModulePageProps {
  moduleId: number;
  onBack: () => void;
}

export const ModulePage: React.FC<ModulePageProps> = ({ moduleId, onBack }) => {
  const [sensorStates] = useState({ 
    left: true, 
    right: true 
  });

  return (
    <Card className="w-full bg-white rounded-3xl shadow-lg p-8">
      {/* Header with Hint Button */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center">
          <h2 className="text-2xl font-bold">
            Module {moduleId}: Pacemaker Calibration
          </h2>
        </div>
        <Button
          variant="ghost"
          size="lg"
          className="bg-blue-100 rounded-xl p-4 w-14 h-14 flex items-center justify-center"
        >
          <Lightbulb className="w-8 h-8 text-blue-600" />
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Left Section (2 columns) */}
        <div className="col-span-2 space-y-4">
          {/* Objective Section */}
          <div className="bg-[#F0F6FE] rounded-xl p-4">
            <h3 className="font-bold mb-2">Objective:</h3>
            <p>Conduct a Routine Temporary External Pacemaker Calibration</p>
          </div>

          {/* Step Section */}
          <div className="bg-red-100 rounded-xl p-4">
            <h3 className="font-bold text-red-900">
              Step 1: Set the Sensing Threshold
            </h3>
          </div>

          {/* EKG Visualization Area */}
          <div className="bg-white rounded-xl border-2 border-gray-100 p-4 h-64 flex items-center justify-center">
            <ECGVisualizer />  {/* this is the new code, can comment it out bc sizing is wrong */}
            {/* <Activity className="w-full h-32 text-gray-400" /> */}
          </div>
        </div>

        {/* Right Section (1 column) */}
        <div className="space-y-6">
          {/* Sensing Lights */}
          <div className="bg-[#F0F6FE] rounded-xl p-4">
            <h3 className="font-bold mb-4">Sensing Lights:</h3>
            <div className="flex justify-around">
              <div className={`w-16 h-16 rounded-full ${
                sensorStates.left ? 'bg-green-400' : 'bg-gray-300'
              }`} />
              <div className={`w-16 h-16 rounded-full ${
                sensorStates.right ? 'bg-blue-400' : 'bg-gray-300'
              }`} />
            </div>
          </div>

          {/* Pacemaker Info */}
          <div className="bg-[#F0F6FE] rounded-xl p-4">
            <h3 className="font-bold mb-4">Pacemaker Info:</h3>
            <div className="space-y-3">
              {[
                { label: "Rate", value: "70 PPM" },
                { label: "A Output", value: "3.5 mA" },
                { label: "V Output", value: "3.5 mA" },
                { label: "V Sensitivity", value: "2.0 mA" },
              ].map((info, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span>{info.label}:</span>
                  <span className="font-medium">{info.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Exit Button */}
      <div className="mt-8">
        <Button
          variant="ghost"
          className="text-gray-600 hover:text-gray-800 px-0"
          onClick={onBack}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Exit Module
        </Button>
      </div>
    </Card>
  );
};

export default ModulePage;