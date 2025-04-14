import React, { useState, useEffect } from "react";
import { ArrowLeft, Lightbulb, CheckCircle, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ECGVisualizer from "@/components/ECGVisualizer";
import { useAuth } from "@/contexts/AuthContext";
import { useSession } from "@/contexts/SessionContext";
import MultipleChoiceQuiz from "./multipleChoiceQuiz";
import { usePacemakerData } from "@/hooks/usePacemakerData";

interface ModulePageProps {
moduleId: number;
onBack: () => void;
}

export const ModulePage: React.FC<ModulePageProps> = ({ moduleId, onBack }) => {
// Connect to pacemaker data
const { state: pacemakerState, isConnected, sendControlUpdate } = usePacemakerData(
  'ws://raspberrypi.local:5001',  // Update this to your actual server URL if needed
  'secondary_app_token_456'       // Authentication token
);

// Update sensor states based on pacemaker data
useEffect(() => {
  if (pacemakerState) {
    // Here we're interpreting certain pacemaker states to update the sensing lights
    // This is a simple example - adjust the logic based on your actual requirements
    
    // Example: Left light (atrial sensing) is on when a_output > 0 and aSensitivity > 0
    const leftOn = (pacemakerState.a_output > 0) && (pacemakerState.aSensitivity > 0);
    
    // Example: Right light (ventricular sensing) is on when v_output > 0 and vSensitivity > 0
    const rightOn = (pacemakerState.v_output > 0) && (pacemakerState.vSensitivity > 0);
    
    setSensorStates({
      left: leftOn,
      right: rightOn
    });
  }
}, [pacemakerState]);

const [sensorStates, setSensorStates] = useState({
  left: true,
  right: true,
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
  step: "Set the Sensing Threshold",
};

type ECGMode =
  | "initial"
  | "sensitivity"
  | "oversensing"
  | "undersensing"
  | "capture_module"
  | "failure_to_capture";

const moduleModes: Record<number, ECGMode> = {
  1: "initial",
  2: "sensitivity",
  3: "oversensing",
  4: "undersensing",
  5: "capture_module",
  6: "failure_to_capture",
};

const [mode, setMode] = useState<ECGMode>(moduleModes[moduleId]);

// For slider control, we'll use a completely local state approach
const [sliderValue, setSliderValue] = useState(2); // Start with default value of 2

// Use actual hardware data when available, fall back to defaults when not connected
const rate = pacemakerState?.rate ?? 60;
const aOutput = pacemakerState?.a_output ?? 5;
const vOutput = pacemakerState?.v_output ?? 5;

// Connection status indicator
const connectionStatus = isConnected ? "Connected to Pacemaker" : "Connecting to Pacemaker...";

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

// Sync with pacemaker data when it's available
useEffect(() => {
  if (pacemakerState?.vSensitivity !== undefined) {
    setSliderValue(pacemakerState.vSensitivity);
  }
}, [pacemakerState?.vSensitivity]);

// We'll use the slider value for ECG visualization
const sensitivity = sliderValue;

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

// Handle sensitivity slider change - simplified approach
const handleSensitivityChange = (newValue: number) => {
  console.log("🌀 Sensitivity changed to:", newValue);
  
  // Always update local state first for immediate UI feedback
  setSliderValue(newValue);
  
  // Then send to pacemaker if connected
  if (isConnected) {
    // Based on module, send to appropriate sensitivity
    if (moduleId === 4) { // AAI mode
      sendControlUpdate({ aSensitivity: newValue });
    } else {
      sendControlUpdate({ vSensitivity: newValue });
    }
  }
};

// Only use the real hardware data for HR
const hrValue = pacemakerState?.rate;
// BP would typically come from a separate monitoring system in real hardware
// For now we'll keep this as a constant, but ideally it would come from hardware too
const bpValue = "120/80";

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
          <Button variant="outline" className="px-6" onClick={handleBack}>
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

        {/* Connection Status */}
        <div className={`p-2 rounded-xl text-sm ${isConnected ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
          {isConnected ? 'Connected to Pacemaker Hardware' : 'Connecting to Pacemaker...'}
        </div>

        {/* Step Section 
        <div className="p-2 bg-red-100 rounded-xl">
          <h3 className="font-bold text-red-900">
            Step 1: {moduleInfo.step}
          </h3>
        </div>
        */}

        {/* EKG Visualization Area */}
        <div className="mt-6">
          <ECGVisualizer
            rate={rate}
            aOutput={aOutput}
            vOutput={vOutput}
            sensitivity={sensitivity}
            mode={mode}
          />
          {!isConnected && (
            <div className="py-1 mt-2 text-xs text-center text-yellow-700 rounded-lg bg-yellow-50">
              Simulated ECG - Connect hardware for real data
            </div>
          )}
        </div>
        <MultipleChoiceQuiz 
          moduleId={moduleId} 
          onComplete={(passed) => {
            console.log("Quiz complete. Passed?", passed);
            if (passed) handleComplete(true); // or unlock the next step
          }}
        />
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
            <span className="text-5xl text-gray-600 font">
              {isConnected && pacemakerState ? hrValue : 61}
            </span>
          </div>
        </div>
        {/* BP Display */}
        <div className="bg-[#F0F6FE] rounded-xl p-4 h-32">
          <h3 className="mb-2 font-bold">BP</h3>
          <div className="flex justify-center">
            <span className="text-5xl text-gray-600 font">{bpValue}</span>
          </div>
        </div>
        
        {/* Sensitivity Control */}
        <div className="bg-[#F0F6FE] rounded-xl p-4">
          <h3 className="mb-2 font-bold">Sensitivity (simulated)</h3>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={12}
              step={1}
              value={sliderValue}
              onChange={(e) => handleSensitivityChange(Number(e.target.value))}
              className="flex-1"
            />
          </div>
          <div className="mt-1 text-sm text-center">
            Current value: {sliderValue} mV{!isConnected ? ' (simulated)' : ''}
          </div>
        </div>
        
        {/* Complete/Fail Buttons */}
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
  1: "Initial Pacemaker",
  2: "Scenario 1",
  3: "Scenario 2",
  4: "Scenario 3",
  5: "Capture Module",
  6: "Failure to Capture",
};

return titles[moduleId] || "Unknown Module";
}

function getModuleObjective(moduleId: number): string {
const objectives: Record<number, string> = {
  1: "Initial external pacemaker calibration: intrinsic ECG",
  2: "Diagnose and correct a failure to sense condition",
  3: "Diagnose and correct scenario",
  4: "Diagnose and correct scenario",
  5: "Learn to correctly capture",
  6: "Correct a failure to capture",
};

return objectives[moduleId] || "Complete the module tasks";
}

export default ModulePage;