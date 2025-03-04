import React, { useState, useEffect } from 'react';
import { ArrowLeft, Lightbulb, CheckCircle, XCircle } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ECGVisualizer from "@/components/ECGVisualizer";
import { useAuth } from "@/contexts/AuthContext";
import { useSession } from "@/contexts/SessionContext";

interface ModulePageProps {
  moduleId: number;
  onBack: () => void;
}

export const ModulePage: React.FC<ModulePageProps> = ({ moduleId, onBack }) => {
  const [sensorStates] = useState({ 
    left: true, 
    right: true 
  });
  
  const [showCompletion, setShowCompletion] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { userData } = useAuth();
  const { startSession, endSession } = useSession();

  // Get module info
  const moduleInfo = {
    id: moduleId.toString(),
    title: getModuleTitle(moduleId),
    objective: getModuleObjective(moduleId),
    step: "Set the Sensing Threshold"
  };

  // Start tracking time when the module is loaded
  useEffect(() => {
    // Start tracking in Session context
    startSession(moduleInfo.id, moduleInfo.title);
    
    // Clean up function to end session if user navigates away without completing
    return () => {
      if (!showCompletion) {
        endSession(false);
      }
    };
  }, []);

  const handleComplete = (success: boolean) => {
    setIsSuccess(success);
    setShowCompletion(true);
    
    // End training session
    endSession(success);
  };

  const handleBack = () => {
    if (!showCompletion) {
      // If user exits without completing, mark as not successful
      endSession(false);
    }
    onBack();
  };

  // Don't show the completion popup if we're not at the end
  if (showCompletion) {
    return (
      <Card className="w-full p-8 bg-white shadow-lg rounded-3xl">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          {isSuccess ? (
            <>
              <CheckCircle className="w-24 h-24 mb-6 text-green-500" />
              <h2 className="mb-4 text-3xl font-bold">Module Completed!</h2>
              <p className="mb-8 text-lg">
                Great job! You've successfully completed this module.
              </p>
            </>
          ) : (
            <>
              <XCircle className="w-24 h-24 mb-6 text-red-500" />
              <h2 className="mb-4 text-3xl font-bold">Module Incomplete</h2>
              <p className="mb-8 text-lg">
                Don't worry! You can try this module again.
              </p>
            </>
          )}
          
          <div className="flex space-x-4">
            <Button 
              variant="outline" 
              className="px-6" 
              onClick={handleBack}
            >
              Return to Menu
            </Button>
            
            <Button 
              className="px-6" 
              onClick={() => {
                setShowCompletion(false);
                startSession(moduleInfo.id, moduleInfo.title);
              }}
            >
              Try Again
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full p-8 bg-white shadow-lg rounded-3xl">
      {/* Header with Hint Button */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center">
          <h2 className="text-2xl font-bold">
            Module {moduleId}: {moduleInfo.title}
          </h2>
        </div>
        <Button
          variant="ghost"
          size="lg"
          className="flex items-center justify-center p-4 bg-blue-100 rounded-xl w-14 h-14"
          onClick={() => alert("Hint: Try adjusting the Sensing Threshold.")}
        >
          <Lightbulb className="w-8 h-8 text-blue-600" />
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Left Section (2 columns) */}
        <div className="col-span-2 space-y-4">
          {/* Objective Section */}
          <div className="bg-[#F0F6FE] rounded-xl p-4">
            <h3 className="mb-2 font-bold">Objective:</h3>
            <p>{moduleInfo.objective}</p>
          </div>

          {/* Step Section */}
          <div className="p-2 bg-red-100 rounded-xl">
            <h3 className="font-bold text-red-900">
              Step 1: {moduleInfo.step}
            </h3>
          </div>

          {/* EKG Visualization Area */}
            <div className="mt-6">
              <ECGVisualizer 
                rate={140} 
                aOutput={20} 
                vOutput={25} 
              />
           </div>
        </div>

        {/* Right Section (1 column) */}
        <div className="space-y-6">
          {/* Sensing Lights */}
          <div className="bg-[#F0F6FE] rounded-xl p-4">
            <h3 className="mb-4 font-bold">Sensing Lights:</h3>
            <div className="flex justify-around">
              <div
                className={`w-16 h-16 rounded-full ${
                  sensorStates.left ? "bg-green-400" : "bg-gray-300"
                }`}
              />
              <div
                className={`w-16 h-16 rounded-full ${
                  sensorStates.right ? "bg-blue-400" : "bg-gray-300"
                }`}
              />
            </div>
          </div>

          {/* HR Display */}
          <div className="bg-[#F0F6FE] rounded-xl p-4 h-32">
            <h3 className="mb-2 font-bold">HR</h3>
            <div className="flex justify-center">
              <span className="text-5xl text-gray-600 font">61</span>
            </div>
          </div>

          {/* BP Display */}
          <div className="bg-[#F0F6FE] rounded-xl p-4 h-32">
            <h3 className="mb-2 font-bold">BP</h3>
            <div className="flex justify-center">
              <span className="text-5xl text-gray-600 font">120/80</span>
            </div>
          </div>
          
          {/* Complete/Fail Buttons (for demo) */}
          <div className="flex mt-6 space-x-3">
            <Button
              variant="outline"
              className="w-1/2 text-red-500 border-red-500 hover:bg-red-50"
              onClick={() => handleComplete(false)}
            >
              Fail Module
            </Button>
            <Button
              className="w-1/2 bg-green-500 hover:bg-green-600"
              onClick={() => handleComplete(true)}
            >
              Complete
            </Button>
          </div>
        </div>
      </div>

      {/* Exit Button */}
      <div className="mt-8">
        <Button
          variant="ghost"
          className="px-0 text-gray-600 hover:text-gray-800"
          onClick={handleBack}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Exit Module
        </Button>
      </div>
    </Card>
  );
};

// Helper functions to get module information
function getModuleTitle(moduleId: number): string {
  const titles: Record<number, string> = {
    0: "Tutorial",
    1: "Pacemaker Calibration",
    2: "3rd Degree Block",
    3: "Atrial Fibrillation",
    4: "Slow 2nd degree block",
    5: "Slow Junctional Rhythm",
    6: "Failure to sense",
    7: "Bariatric capture",
    8: "Asystole",
  };
  
  return titles[moduleId] || "Unknown Module";
}

function getModuleObjective(moduleId: number): string {
  const objectives: Record<number, string> = {
    0: "Learn how to use the simulator and its controls",
    1: "Conduct a Routine Temporary External Pacemaker Calibration",
    2: "Identify and treat a 3rd Degree AV Block",
    3: "Manage a patient with Atrial Fibrillation",
    4: "Identify and treat a Slow 2nd Degree AV Block",
    5: "Manage a patient with Slow Junctional Rhythm",
    6: "Diagnose and correct a failure to sense condition",
    7: "Correct inadequate capture thresholds",
    8: "Intervene in a case of Asystole",
  };
  
  return objectives[moduleId] || "Complete the module tasks";
}

export default ModulePage;