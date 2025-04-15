// src/pages/ModulePage.tsx
import React, { useEffect, useState } from "react";
import { ArrowLeft, Lightbulb, CheckCircle, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ECGVisualizer from "@/components/ECGVisualizer";
import { useAuth } from "@/contexts/AuthContext";
import { useSession } from "@/contexts/SessionContext";
import MultipleChoiceQuiz from "./multipleChoiceQuiz";
import { allModuleSteps } from "./modules";
import { PacemakerState } from "@/utils/PacemakerWebSocketClient";
import { ModuleStep } from "@/types/module";
import { usePacemakerData } from "@/hooks/usePacemakerData";


interface ModulePageProps {
  moduleId: number;
  onBack: () => void;
}

type ECGMode =
  | "initial"
  | "sensitivity"
  | "oversensing"
  | "undersensing"
  | "capture_module"
  | "failure_to_capture";

export const ModulePage: React.FC<ModulePageProps> = ({ moduleId, onBack }) => {

  const { state: pacemakerState, isConnected, sendControlUpdate } = usePacemakerData();

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


  const [quizFinished, setQuizFinished] = useState(false);
  const [steps, setSteps] = useState<ModuleStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = steps[currentStepIndex] ?? null;

  const [rateValue, setRateValue] = useState(40);
  const [aOutputSim, setAOutputSim] = useState(5);
  const [vOutputSim, setVOutputSim] = useState(5);
  const [sensitivitySim, setSensitivitySim] = useState(2);
  const [lastKnownState, setLastKnownState] = useState<PacemakerState | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [blockedSetting, setBlockedSetting] = useState<string | null>(null);

  const [showCompletion, setShowCompletion] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { userData } = useAuth();
  const { startSession, endSession } = useSession();

  const moduleInfo = {
    id: moduleId.toString(),
    title: getModuleTitle(moduleId),
    objective: currentStep?.objective ?? getModuleObjective(moduleId),
  };

  const moduleModes: Record<number, ECGMode> = {
    1: "initial",
    2: "sensitivity",
    3: "oversensing",
    4: "undersensing",
    5: "capture_module",
    6: "failure_to_capture",
  };

  const [mode, setMode] = useState<ECGMode>(moduleModes[moduleId]);

  useEffect(() => {
    startSession(moduleInfo.id, moduleInfo.title);
    return () => endSession(false);
  }, []);

  useEffect(() => {
    if (quizFinished) {
      const loaded = allModuleSteps[moduleId] ?? [];
      setSteps(loaded);
      setCurrentStepIndex(0);
    }
  }, [quizFinished, moduleId]);

  //simulated pacemaker state
  useEffect(() => {
    if (!currentStep) return;

    const simulatedState: PacemakerState = {
      rate: rateValue,
      a_output: aOutputSim,
      v_output: vOutputSim,
      aSensitivity: 2,
      vSensitivity: sensitivitySim,
      mode: 0,
      isLocked: false,
      isPaused: false,
      pauseTimeLeft: 0,
      batteryLevel: 100,
      lastUpdate: Date.now(),
    };

    if (!lastKnownState) {
      setLastKnownState(simulatedState);
      return;
    }

    const nonControlKeys: (keyof PacemakerState)[] = [
      "lastUpdate",
      "batteryLevel",
      "isLocked",
      "isPaused",
      "pauseTimeLeft",
      "mode"
    ];

    const disallowedKeys = Object.keys(simulatedState)
      .filter((key) =>
        !currentStep.allowedControls.includes(key) &&
        !nonControlKeys.includes(key as keyof PacemakerState)
      ) as (keyof PacemakerState)[];


    for (const key of disallowedKeys) {
      const prevVal = lastKnownState[key];
      const newVal = simulatedState[key];
      const hasChanged =
        typeof newVal === "number" && typeof prevVal === "number"
          ? Math.abs(newVal - prevVal) > 0.01
          : newVal !== prevVal;

      if (hasChanged) {
        setBlockedSetting(key);
        setShowWarning(true);
        break;
      }
    }
    if (currentStep.targetValues) {
      const matchedAllTargets = Object.entries(currentStep.targetValues).every(
        ([key, expected]) => {
          const actual = simulatedState[key as keyof PacemakerState];
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
          setIsSuccess(true);
          setShowCompletion(true);
          endSession(true);
          // Optional: ends session as successful        
        }
      }
    }


    setLastKnownState(simulatedState);
  }, [rateValue, aOutputSim, vOutputSim, sensitivitySim, currentStep]);

  const handleBack = () => {
    if (!showCompletion) {
      // If user exits without completing, mark as not successful
      endSession(false);
    }
    onBack();
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
      <div className="flex items-start justify-between mb-8">
        <h2 className="text-2xl font-bold">
          Module {moduleId}: {moduleInfo.title}
        </h2>
        <Button
          variant="ghost"
          className="bg-blue-100 w-14 h-14 rounded-xl"
          onClick={() => alert("Hint: Try adjusting the pacemaker settings.")}
        >
          <Lightbulb className="w-8 h-8 text-blue-600" />
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-4">
          <div className="bg-[#F0F6FE] rounded-xl p-4">
            <h3 className="mb-2 font-bold">Objective:</h3>
            <p>{moduleInfo.objective}</p>
          </div>

          <div className="mt-6">
            <ECGVisualizer
              rate={isConnected ? pacemakerState?.rate ?? 60 : rateValue}
              aOutput={isConnected ? pacemakerState?.a_output ?? 0 : aOutputSim}
              vOutput={isConnected ? pacemakerState?.v_output ?? 0 : vOutputSim}
              sensitivity={isConnected ? pacemakerState?.vSensitivity ?? 2 : sensitivitySim}
              mode={mode}
            />
          </div>

          <MultipleChoiceQuiz
            moduleId={moduleId}
            onQuizFinished={() => setQuizFinished(true)}
          />
        </div>
        {/* Right Section (1 column) */}
        <div className="space-y-6">
          {/* Lights */}
          <div className="bg-[#F0F6FE] rounded-xl p-4">
            <h3 className="mb-4 font-bold">Sensing Lights:</h3>
            <div className="flex justify-around">
              {/** pacing light */}
              <div
                className={`w-16 h-16 rounded-full transition-all duration-300 ${sensorStates.left ? "bg-green-400" : "bg-gray-300"
                  } ${quizFinished && currentStepIndex === 3
                    ? "animate-pulse ring-4 ring-green-300"
                    : ""
                  }`}
              />
              {/** sensing light */}
              <div
                className={`w-16 h-16 rounded-full transition-all duration-300 ${sensorStates.right ? "bg-blue-400" : "bg-gray-300"
                  } ${quizFinished && currentStepIndex < 3
                    ? "animate-pulse ring-4 ring-blue-300"
                    : ""
                  }`}
              />
            </div>
          </div>
          {/* HR Display */}
          <div className="bg-[#F0F6FE] rounded-xl p-4 h-32">
            <h3 className="mb-2 font-bold">HR</h3>
            <div className="flex justify-center">
              <span className="text-5xl text-gray-600 font">
                {isConnected && pacemakerState ? rateValue : 61}
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
          {isConnected && (
            <div className="bg-[#F0F6FE] rounded-xl p-4">
              <h3 className="mb-2 font-bold">Live Values</h3>
              <p>Rate: {pacemakerState?.rate ?? "–"} BPM</p>
              <p>A Output: {pacemakerState?.a_output ?? "–"} V</p>
              <p>V Output: {pacemakerState?.v_output ?? "–"} V</p>
              <p>Sensitivity: {pacemakerState?.vSensitivity ?? "–"} mV</p>
            </div>
          )}

          {!isConnected && (
            <>
              {/** heart rate */}
              <div className="space-y-6">
                <div className="bg-[#F0F6FE] rounded-xl p-4">
                  <h3 className="mb-2 font-bold">Heart Rate</h3>
                  <input
                    type="range"
                    min={20}
                    max={200}
                    step={1}
                    value={rateValue}
                    onChange={(e) => setRateValue(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-center mt-2">{rateValue} BPM</div>
                </div>
                {/** sensitivity slider */}
                <div className="bg-[#F0F6FE] rounded-xl p-4">
                  <h3 className="mb-2 font-bold">Sensitivity</h3>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    step={0.1}
                    value={sensitivitySim}
                    onChange={(e) => setSensitivitySim(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-center mt-2">{sensitivitySim.toFixed(1)} mV</div>
                </div>

                <div className="bg-[#F0F6FE] rounded-xl p-4">
                  <h3 className="mb-2 font-bold">Atrial Output</h3>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    step={0.1}
                    value={aOutputSim}
                    onChange={(e) => setAOutputSim(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-center mt-2">{aOutputSim.toFixed(1)} V</div>
                </div>
                {/** voutput */}
                <div className="bg-[#F0F6FE] rounded-xl p-4">
                  <h3 className="mb-2 font-bold">Ventricular Output</h3>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    step={0.1}
                    value={vOutputSim}
                    onChange={(e) => setVOutputSim(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-center mt-2">{vOutputSim.toFixed(1)} V</div>
                </div>
              </div>
            </>
          )}
        </div>

        {showWarning && currentStep && blockedSetting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md text-center">
              <h3 className="text-lg font-bold mb-2">Hold Up ⛔️</h3>
              <p className="text-sm mb-4">
                You're not supposed to change <strong>{blockedSetting}</strong> during this step.<br />
                Allowed controls: <strong>{currentStep.allowedControls.join(", ") || "none"}</strong>
              </p>
              <p className="text-xs mt-2">
                Value went from {lastKnownState?.[blockedSetting as keyof PacemakerState]} to {" "}
                {rateValue || aOutputSim || vOutputSim || sensitivitySim}
              </p>
              <Button onClick={() => setShowWarning(false)}>Got it</Button>
            </div>
          </div>
        )}

        <div className="mt-8">
          <Button variant="ghost" className="px-0 text-gray-600 hover:text-gray-800" onClick={onBack}>
            <ArrowLeft className="w-5 h-5 mr-2" /> Exit Module
          </Button>
        </div>
      </div>
    </Card>
  );
};

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
    2: "Diagnose and correct a failure to sense condition. First, answer the multiple choice at the bottom and then adjust pacemaker",
    3: "Diagnose and correct scenario",
    4: "Diagnose and correct scenario",
    5: "Learn to correctly capture",
    6: "Correct a failure to capture",
  };
  return objectives[moduleId] || "Complete the module tasks";
}

export default ModulePage;
