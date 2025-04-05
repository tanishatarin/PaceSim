import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Module } from "../types";
import { useSession } from "@/contexts/SessionContext";
import { useAuth } from "@/contexts/AuthContext";

interface LandingPageProps {
  onModuleSelect: (moduleId: number) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onModuleSelect }) => {
  const { sessionHistory } = useSession();
  const { userData } = useAuth();
  const [recentModule, setRecentModule] = useState<{
    id: number;
    title: string;
  } | null>(null);

  {
    /*  generateNormalPacingPoints,
  generateFailureToCapturePoints,
  generateFailureToSensePoints,
  generateBariatricCapturePoints,
  generateThirdDegreeBlockPoints,
  generateAfibPoints,
  generateSecondDegreeBlockPoints,
  generateSlowJunctionalPoints,
  generateAsystolePoints, */
  }

  {/* OLD MODULE TRACKING

  type ECGMode =
  | "normal"
  | "failure_to_capture"
  | "failure_to_sense"
  | "bariatric_capture"
  | "third_degree_block"
  | "atrial_fibrilation"
  | "second_degree_block"
  | "slow_junctional"
  | "asystole";

   const moduleModes: Record<number, ECGMode> = {
    0: "normal", // Tutorial
    1: "normal", // Calibration
    2: "failure_to_capture",
    3: "failure_to_sense",
    4: "bariatric_capture",
    5: "third_degree_block",
    6: "atrial_fibrilation",
    7: "second_degree_block",
    8: "slow_junctional",
    9: "asystole",
  };*/}

  useEffect(() => {
    // Find the most recent session
    if (sessionHistory.length > 0) {
      const sortedSessions = [...sessionHistory].sort(
        (a, b) =>
          new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
      );

      const recent = sortedSessions[0];
      if (recent?.moduleId) {
        setRecentModule({
          id: parseInt(recent.moduleId),
          title: recent.moduleName,
        });
      }
    }
  }, [sessionHistory]);

  const modules: Module[] = [
    { id: 1, title: "Pacemaker Calibration" },
    { id: 2, title: "Failure to Capture" },
    { id: 3, title: "Failure To Sense" },
    { id: 4, title: "Batriatic Capture" },
    { id: 5, title: "Third Degree Block" },
    { id: 6, title: "Atrial Fibrilation" },
    { id: 7, title: "Second Degree Block" },
    { id: 8, title: "Slow Junctional Rythm" },
    { id: 9, title: "Asystole" },
  ];

  // Get completed/in-progress modules from user data
  const completedModuleIds =
    userData?.stats?.completedModules?.map((id: string) => parseInt(id)) || [];
  const inProgressModuleIds =
    userData?.stats?.inProgressModules?.map((id: string) => parseInt(id)) || [];

  return (
    <Card className="w-full p-8 bg-white shadow-lg rounded-3xl">
      {/* Header Section */}
      <div className="mb-12">
        <h1 className="mb-2 text-3xl font-bold text-black">
          Welcome to the Pacemaker Simulator!
        </h1>
        <p className="text-xl text-gray-900">
          External Pacemaker Simulation Platform
        </p>
      </div>

      {/* Recent Module Section (if available) */}
      {recentModule && (
        <div className="mb-8">
          <h2 className="mb-3 text-xl font-semibold">Continue Learning:</h2>
          <div
            className="p-4 transition-colors duration-200 bg-blue-100 rounded-lg cursor-pointer hover:bg-blue-200"
            onClick={() => onModuleSelect(recentModule.id)}
          >
            <p className="font-medium text-blue-800">{recentModule.title}</p>
            <p className="mt-1 text-sm text-blue-600">
              Continue where you left off
            </p>
          </div>
        </div>
      )}

      {/* Modules Section */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Modules:</h2>
        <div className="space-y-3">
          {/* Tutorial Module */}
          <div
            className="p-4 bg-[#F0F6FE] hover:bg-blue-100 transition-colors duration-200 rounded-lg cursor-pointer"
            onClick={() => onModuleSelect(0)}
          >
            <p className="font-medium text-gray-900">
              Tutorial: Get to know how to play!
            </p>
          </div>

          {/* Training Modules */}
          {modules.map((module) => (
            <div
              key={module.id}
              className={`p-4 transition-colors duration-200 rounded-lg cursor-pointer ${
                completedModuleIds.includes(module.id)
                  ? "bg-green-100 hover:bg-green-200"
                  : inProgressModuleIds.includes(module.id)
                    ? "bg-yellow-100 hover:bg-yellow-200"
                    : "bg-[#F0F6FE] hover:bg-blue-100"
              }`}
              onClick={() => onModuleSelect(module.id)}
            >
              <div className="flex justify-between">
                <p className="font-medium text-gray-900">
                  Module {module.id}: {module.title}
                </p>
                {completedModuleIds.includes(module.id) && (
                  <span className="text-sm font-medium text-green-600">
                    ✓ Completed
                  </span>
                )}
                {inProgressModuleIds.includes(module.id) && (
                  <span className="text-sm font-medium text-yellow-600">
                    In Progress
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default LandingPage;
