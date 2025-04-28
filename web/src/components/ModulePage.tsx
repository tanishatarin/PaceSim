import React, { useState, useEffect } from "react";
import { ArrowLeft, Lightbulb, CheckCircle, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ECGVisualizer from "@/components/ECGVisualizer";
import { useAuth } from "@/contexts/AuthContext";
import { useSession } from "@/contexts/SessionContext";
import MultipleChoiceQuiz from "./multipleChoiceQuiz";
import { usePacemakerData } from "@/hooks/usePacemakerData";
import { module1Steps } from "./modules/module1";
import { ModuleStep } from "@/types/module";
import { PacemakerState } from "@/utils/PacemakerWebSocketClient";


interface ModulePageProps {
  moduleId: number;
  onBack: () => void;
}

export const ModulePage: React.FC<ModulePageProps> = ({ moduleId, onBack }) => {
  const { state: pacemakerState, isConnected, sendControlUpdate } = usePacemakerData();

  const [sensorStates, setSensorStates] = useState({ left: true, right: true });
  const [rate, setRateValue] = useState(40);
  const [aOutputSim, setAOutputSim] = useState(5);
  const [vOutputSim, setVOutputSim] = useState(5);
  const [sensitivitySim, setSensitivitySim] = useState(2);
  const [showCompletion, setShowCompletion] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [steps, setSteps] = useState<ModuleStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = steps[currentStepIndex] ?? null;
  const [flashingSensor, setFlashingSensor] = useState<"left" | "right" | null>(null);


  useEffect(() => {
    if (steps.length > 0) {
      console.log("✅ Steps updated:");
      console.log(steps);
      console.log("✅ Current Step Index:", currentStepIndex);
      console.log("✅ Current Step Objective:", steps[currentStepIndex]?.objective);
    }
  }, [steps, currentStepIndex]);



  const { startSession, endSession } = useSession();

  const moduleInfo = {
    id: moduleId.toString(),
    title: getModuleTitle(moduleId),
    objective: getModuleObjective(moduleId),
    step: "Set the Sensing Threshold",
  };

  type ECGMode = "sensitivity" | "oversensing" | "undersensing" | "capture_module" | "failure_to_capture";
  const moduleModes: Record<number, ECGMode> = {
    1: "sensitivity",
    2: "oversensing",
    3: "undersensing",
    4: "capture_module",
    5: "failure_to_capture",
  };
  const [mode, setMode] = useState<ECGMode>(moduleModes[moduleId]);

  const isModule1 = moduleInfo?.id === "1"; // adjust as needed
  const rateValue = isModule1 && isConnected
    ? pacemakerState?.rate ?? 60
    : rate;
  const aOutput = isConnected ? pacemakerState?.a_output ?? 5 : aOutputSim;
  const vOutput = isConnected ? pacemakerState?.v_output ?? 5 : vOutputSim;
  const sensitivity = isConnected ? pacemakerState?.aSensitivity ?? 2 : sensitivitySim;

  useEffect(() => {
    startSession(moduleInfo.id, moduleInfo.title);
    return () => endSession(false);
  }, []);

  useEffect(() => {
    if (pacemakerState) {
      const leftOn = pacemakerState.a_output > 0 && pacemakerState.aSensitivity > 0;
      const rightOn = pacemakerState.v_output > 0 && pacemakerState.vSensitivity > 0;
      setSensorStates({ left: leftOn, right: rightOn });
    }
  }, [pacemakerState]);

  const handleComplete = (success: boolean) => {
    setIsSuccess(success);
    setShowCompletion(true);
    endSession(success);
  };

  const handleBack = () => {
    if (!showCompletion) endSession(false);
    onBack();
  };

  useEffect(() => {
    if (!currentStep || !pacemakerState || !isConnected) return;

    if (currentStep.targetValues) {
      const matchedAllTargets = Object.entries(currentStep.targetValues).every(
        ([key, expected]) => {
          const actual = pacemakerState[key as keyof PacemakerState];
          return typeof expected === "number" && typeof actual === "number"
            ? Math.abs(expected - actual) < 0.01
            : expected === actual;
        }
      );

      if (matchedAllTargets) {
        if (currentStepIndex < steps.length - 1) {
          console.log("✅ Step completed, moving to next step!");
          setCurrentStepIndex((prev) => prev + 1);
        } else {
          console.log("🎉 All steps completed!");
          setShowCompletion(true);
          setIsSuccess(true);
        }
      }
    }

  }, [pacemakerState, isConnected, currentStep]);

  useEffect(() => {
    if (currentStep?.flashingSensor !== undefined) {
      setFlashingSensor(currentStep.flashingSensor ?? null);
      console.log("✅ Flashing sensor updated to:", currentStep.flashingSensor);
    }
  }, [currentStep]);


  const bpValue = "120/80";

  {showCompletion && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-lg text-center relative">
        <div className="flex flex-col items-center justify-center py-6">
          {isSuccess ? (
            <>
              <CheckCircle aria-label="Success Icon" className="w-24 h-24 mb-6 text-green-500" />
              <h2 className="mb-4 text-3xl font-bold">Module Completed!</h2>
              <p className="mb-8 text-lg">Great job! You've successfully completed this module.</p>
            </>
          ) : (
            <>
              <XCircle aria-label="Failure Icon" className="w-24 h-24 mb-6 text-red-500" />
              <h2 className="mb-4 text-3xl font-bold">Module Incomplete</h2>
              <p className="mb-8 text-lg">Don't worry! You can try this module again.</p>
            </>
          )}
          <div className="flex space-x-4 mt-8">
            <Button type="button" variant="outline" className="px-6" onClick={handleBack}>
              Return to Menu
            </Button>
            <Button
              type="button"
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
      </div>
    </div>
  )}
  
  return (
    <Card className="w-full p-8 bg-white shadow-lg rounded-3xl">
      <div className="flex items-start justify-between mb-8">
        <h2 className="text-2xl font-bold">Module {moduleId}: {moduleInfo.title}</h2>
        <Button variant="ghost" className="bg-blue-100 w-14 h-14 rounded-xl" onClick={() => alert("Hint: Try adjusting the pacemaker settings.")}>
          <Lightbulb className="w-8 h-8 text-blue-600" />
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-4">
          <div className="bg-[#F0F6FE] rounded-xl p-4">
            <h3 className="mb-2 font-bold">Objective:</h3>
            <p className="whitespace-pre-line">
              {steps.length > 0 && currentStep
                ? currentStep.objective
                : moduleInfo.objective}
            </p>
          </div>

          <div className={`p-2 rounded-xl text-sm ${isConnected ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {isConnected ? 'Connected to Pacemaker Hardware' : 'Simulated Mode Active'}
          </div>

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
            onPassQuiz={(passed) => {
              console.log("Quiz complete. Passed?", passed);
              setSteps(module1Steps);
              setCurrentStepIndex(0);
            }}
          />

        </div>

        <div className="space-y-6">
          <div className="bg-[#F0F6FE] rounded-xl p-4">
            <h3 className="mb-4 font-bold">Sensing Lights:</h3>
            <div className="flex justify-around">
              <div className="flex flex-col items-center">
                <div className={`w-16 h-16 rounded-full transition-colors duration-300
      ${sensorStates.left ? "bg-green-400" : "bg-gray-300"}
      ${flashingSensor === "left" ? "animate-pulse-slow" : ""}
    `} />
                <span className="mt-2 text-sm text-gray-600">Left</span>
              </div>
              <div className="flex flex-col items-center">
                <div className={`w-16 h-16 rounded-full transition-colors duration-300
      ${sensorStates.right ? "bg-blue-400" : "bg-gray-300"}
      ${flashingSensor === "right" ? "animate-pulse-slow" : ""}
    `} />
                <span className="mt-2 text-sm text-gray-600">Right</span>
              </div>
            </div>

          </div>

          <div className="bg-[#F0F6FE] rounded-xl p-4 h-32">
            <h3 className="mb-2 font-bold">Patient HR</h3>
            <div className="flex justify-center">
              <span className="text-5xl text-gray-600 font">{rate}</span>
            </div>
          </div>

          <div className="bg-[#F0F6FE] rounded-xl p-4 h-32">
            <h3 className="mb-2 font-bold">Patient Blood Pressure</h3>
            <div className="flex justify-center">
              <span className="text-5xl text-gray-600 font">{bpValue}</span>
            </div>
          </div>

          <div className="bg-[#F0F6FE] rounded-xl p-4 h-32">
            <h3 className="mb-2 font-bold">Pacemaker HR</h3>
            <div className="flex justify-center">
              <span className="text-5xl text-gray-600 font">{rateValue}</span>
            </div>
          </div>

          <div className="flex mt-6 space-x-3">
            <Button variant="outline" className="w-1/2 text-red-500 border-red-500 hover:bg-red-50" onClick={() => handleComplete(false)}>Fail Module</Button>
            <Button className="w-1/2 bg-green-500 hover:bg-green-600" onClick={() => handleComplete(true)}>Complete</Button>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Button variant="ghost" className="px-0 text-gray-600 hover:text-gray-800" onClick={handleBack}>
          <ArrowLeft className="w-5 h-5 mr-2" /> Exit Module
        </Button>
      </div>
    </Card>
  );
};

function getModuleTitle(moduleId: number): string {
  const titles: Record<number, string> = {
    1: "Scenario 1",
    2: "Scenario 2",
    3: "Scenario 3",
    4: "Capture Module",
    5: "Failure to Capture",
  };
  return titles[moduleId] || "Unknown Module";
}

function getModuleObjective(moduleId: number): string {
  const objectives: Record<number, string> = {
    1: "Diagnose and correct a failure to sense condition. Answer the multiple choice at the bottom and then adjust the pacemaker. \nScenario: You come back into a patient's room the next day and see this pattern on their ECG. Their heart rate has dropped to 40 and attached to the patient, you have A leads.",
    2: "Diagnose and correct scenario\nfor notes: failure to capture, oversensing module",
    3: "Diagnose and correct scenario\nfor notes: failure to sense, undersensing module",
    4: "Learn to correctly capture",
    5: "Correct a failure to capture",
  };
  return objectives[moduleId] || "Complete the module tasks";
}

export default ModulePage;
