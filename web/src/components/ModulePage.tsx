// src/components/ModulePage.tsx
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Lightbulb, Clock } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ECGVisualizer from "@/components/ECGVisualizer";
import SessionSummary from "@/components/backend/SessionSummary";
import { useSession } from "@/contexts/SessionContext";

interface ModulePageProps {
  moduleId: number;
  onBack: () => void;
}

// Module data (in a real app, this would come from an API)
const MODULE_DATA = [
  { id: 0, title: "Tutorial: Introduction to Pacemakers", description: "Learn the basics of pacemakers." },
  { id: 1, title: "Pacemaker Calibration", description: "Conduct a Routine Temporary External Pacemaker Calibration" },
  { id: 2, title: "3rd Degree Block", description: "Diagnose and treat complete heart block." },
  { id: 3, title: "Atrial Fibrillation", description: "Manage a patient with atrial fibrillation." },
  { id: 4, title: "Slow 2nd degree block", description: "Identify and respond to 2nd degree heart block." },
  { id: 5, title: "Slow Junctional Rhythm", description: "Diagnose and manage junctional rhythm." },
  { id: 6, title: "Failure to sense", description: "Troubleshoot sensing issues with pacemakers." },
  { id: 7, title: "Bariatric capture", description: "Manage capture thresholds in bariatric patients." },
  { id: 8, title: "Asystole", description: "Emergency management of asystole with temporary pacing." },
];

export const ModulePage: React.FC<ModulePageProps> = ({ moduleId, onBack }) => {
  const { startSession, completeSession, abandonSession, currentSession } = useSession();
  const [sensorStates, setSensorStates] = useState({ left: true, right: true });
  const [sessionTime, setSessionTime] = useState(0); // in seconds
  const [showHint, setShowHint] = useState(false);
  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  // Current module data
  const module = MODULE_DATA.find(m => m.id === moduleId) || {
    id: moduleId,
    title: `Module ${moduleId}`,
    description: "No description available"
  };

  // Initialize or continue session
  useEffect(() => {
    // Only start a new session if there's no current one for this module
    if (!currentSession || currentSession.moduleId !== moduleId) {
      startSession(moduleId, module.title);
    }

    // Set up timer to track session duration
    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [moduleId, module.title, currentSession, startSession]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle module completion
  const handleComplete = () => {
    // Calculate a score based on time and steps
    const calculatedScore = Math.max(0, 100 - (sessionTime > 300 ? 20 : 0) - (step > 3 ? 15 : 0));
    setScore(calculatedScore);
    setCompleted(true);
    completeSession(calculatedScore, 100);
    setShowSummary(true);
  };

  // Handle exit
  const handleExit = () => {
    if (!completed) {
      abandonSession();
    }
    onBack();
  };

  // Toggle hint
  const toggleHint = () => {
    setShowHint(!showHint);
  };

  // Handle next step
  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  // If showing summary, render the session summary component
  if (showSummary) {
    return (
      <SessionSummary
        score={score}
        maxScore={100}
        time={sessionTime}
        moduleId={moduleId}
        moduleName={module.title}
        onClose={onBack}
      />
    );
  }
  
  return (
    <Card className="w-full p-8 bg-white shadow-lg rounded-3xl">
      {/* Header with Hint Button and Timer */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center">
          <h2 className="text-2xl font-bold">
            Module {moduleId}: {module.title}
          </h2>
        </div>
        <div className="flex space-x-4">
          <div className="flex items-center px-4 py-2 text-gray-600 bg-gray-100 rounded-lg">
            <Clock className="w-5 h-5 mr-2" />
            <span className="font-mono">{formatTime(sessionTime)}</span>
          </div>
          <Button
            variant="ghost"
            size="lg"
            className="flex items-center justify-center p-4 bg-blue-100 rounded-xl w-14 h-14"
            onClick={toggleHint}
          >
            <Lightbulb className="w-8 h-8 text-blue-600" />
          </Button>
        </div>
      </div>

      {/* Hint Panel (conditionally shown) */}
      {showHint && (
        <div className="relative p-4 mb-6 bg-blue-50 rounded-xl">
          <button
            onClick={() => setShowHint(false)}
            className="absolute text-gray-500 right-2 top-2 hover:text-gray-700"
          >
            ×
          </button>
          <h3 className="mb-2 font-bold text-blue-800">Hint</h3>
          <p className="text-blue-700">
            {step === 1 && "Try adjusting the sensing threshold to detect P-waves properly."}
            {step === 2 && "Look for consistent QRS complexes after P-waves."}
            {step === 3 && "Check the rate settings and ensure proper capture."}
          </p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-8">
        {/* Left Section (2 columns) */}
        <div className="col-span-2 space-y-4">
          {/* Objective Section */}
          <div className="bg-[#F0F6FE] rounded-xl p-4">
            <h3 className="mb-2 font-bold">Objective:</h3>
            <p>{module.description}</p>
          </div>

          {/* Step Section */}
          <div className="p-4 bg-red-100 rounded-xl">
            <h3 className="font-bold text-red-900">
              Step {step}: {step === 1 ? "Set the Sensing Threshold" : 
                           step === 2 ? "Adjust Output Parameters" : 
                           step === 3 ? "Confirm Proper Pacing" : 
                           "Complete"}
            </h3>
            <p className="mt-2 text-sm text-red-800">
              {step === 1 && "Adjust the sensing threshold to detect appropriate cardiac activity."}
              {step === 2 && "Set the appropriate output parameters to ensure proper capture."}
              {step === 3 && "Verify stable cardiac rhythm with proper pacing."}
            </p>
          </div>

          {/* EKG Visualization Area */}
          <div className="mt-6">
            <ECGVisualizer 
              rate={140} 
              aOutput={20} 
              vOutput={25} 
            />
          </div>

          {/* Next Step Button */}
          <div className="mt-4">
            {completed ? (
              <div className="p-4 bg-green-100 rounded-xl">
                <h3 className="mb-2 font-bold text-green-800">Module Completed!</h3>
                <p className="text-green-700">Your score: {score}/100</p>
                <Button 
                  className="mt-4 bg-green-600 hover:bg-green-700"
                  onClick={handleExit}
                >
                  Return to Modules
                </Button>
              </div>
            ) : (
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleNextStep}
              >
                {step < 3 ? "Next Step" : "Complete Module"}
              </Button>
            )}
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
        </div>
      </div>

      {/* Exit Button */}
      <div className="mt-8">
        <Button
          variant="ghost"
          className="px-0 text-gray-600 hover:text-gray-800"
          onClick={handleExit}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Exit Module
        </Button>
      </div>
    </Card>
  );
};

export default ModulePage;