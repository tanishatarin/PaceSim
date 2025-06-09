// src/components/modules/allModuleSteps.ts - Complete module definitions
import { ModuleStep } from "@/types/module";

// Module 1: Failure to Sense (Bradycardia scenario)
export const module1Steps: ModuleStep[] = [
  {
    objective: "Decrease heart rate to 30 BPM to evaluate intrinsic rhythm",
    allowedControls: ["rate"],
    targetValues: { rate: 30 },
    flashingSensor: "right",
  },
  {
    objective: "Set atrial output to 0.1 mA to minimize interference",
    allowedControls: ["aOutput"],
    targetValues: { a_output: 0.1 },
    flashingSensor: "right",
  },
  {
    objective: "Select AAI pacing mode for atrial leads",
    allowedControls: ["mode"],
    targetValues: { mode: 4 },
    flashingSensor: "right",
  },
  {
    objective: "Set aSensitivity to 0.4 mV to start sensitivity testing",
    allowedControls: ["aSensitivity"],
    targetValues: { aSensitivity: 0.4},
    flashingSensor: "right",
  },
  {
    objective: "Slowly increase aSensitivity to 1.6 mV until sensing light stops flashing (sensitivity threshold)",
    allowedControls: ["aSensitivity"],
    targetValues: { aSensitivity: 1.6 },
    flashingSensor: "right",
  },
  {
    objective: "Set aSensitivity to half of threshold (0.8 mV) for safety margin",
    allowedControls: ["aSensitivity"],
    targetValues: { aSensitivity: 0.8 },
    flashingSensor: "left",
  },
  {
    objective: "Set rate 10 BPM above patient intrinsic heart rate",
    allowedControls: ["rate"],
    targetValues: { rate: 50 },
    flashingSensor: "left",
  },
  {
    objective: "Slowly increase aOutput until consistent capture achieved",
    allowedControls: ["aOutput"],
    targetValues: { a_output: 4 },
    flashingSensor: "left",
  },
  {
    objective: "Set aOutput to double the capture threshold for safety",
    allowedControls: ["aOutput"],
    targetValues: { a_output: 8 },
    flashingSensor: "left",
  },
  {
    objective: "Restore rate to physician's order of 80 BPM",
    allowedControls: ["rate"],
    targetValues: { rate: 80 },
    flashingSensor: "left",
  },
];

// Module 2: Oversensing (Electromagnetic interference)
export const module2Steps: ModuleStep[] = [
  {
    objective: "Identify oversensing by observing irregular pacing inhibition",
    allowedControls: [],
    flashingSensor: "right",
  },
  {
    objective: "Decrease atrial sensitivity to 2.0 mV to reduce oversensing",
    allowedControls: ["aSensitivity"],
    targetValues: { aSensitivity: 2.0 },
    flashingSensor: "right",
  },
  {
    objective: "Decrease ventricular sensitivity to 3.0 mV",
    allowedControls: ["vSensitivity"],
    targetValues: { vSensitivity: 3.0 },
    flashingSensor: "left",
  },
  {
    objective: "Switch to asynchronous mode (DOO) if oversensing persists",
    allowedControls: ["mode"],
    targetValues: { mode: 5 },
    flashingSensor: "left",
  },
  {
    objective: "Monitor for return to normal pacing pattern",
    allowedControls: [],
    flashingSensor: null,
  },
];

// Module 3: Undersensing (Failure to detect intrinsic beats)
export const module3Steps: ModuleStep[] = [
  {
    objective: "Identify undersensing by observing pacing spikes on intrinsic beats",
    allowedControls: [],
    flashingSensor: "right",
  },
  {
    objective: "Increase atrial sensitivity to 0.5 mV to improve sensing",
    allowedControls: ["aSensitivity"],
    targetValues: { aSensitivity: 0.5 },
    flashingSensor: "right",
  },
  {
    objective: "Increase ventricular sensitivity to 1.0 mV",
    allowedControls: ["vSensitivity"],
    targetValues: { vSensitivity: 1.0 },
    flashingSensor: "left",
  },
  {
    objective: "Check lead connections if sensing doesn't improve",
    allowedControls: [],
    flashingSensor: "left",
  },
  {
    objective: "Verify proper sensing by observing inhibition of pacing",
    allowedControls: [],
    flashingSensor: null,
  },
];

// Module 4: Capture Calibration
export const module4Steps: ModuleStep[] = [
  {
    objective: "Start with minimum output settings to find capture threshold",
    allowedControls: ["aOutput", "vOutput"],
    targetValues: { a_output: 0.5, v_output: 0.5 },
    flashingSensor: "right",
  },
  {
    objective: "Gradually increase atrial output until P-waves appear",
    allowedControls: ["aOutput"],
    targetValues: { a_output: 2.0 },
    flashingSensor: "right",
  },
  {
    objective: "Gradually increase ventricular output until QRS complexes appear",
    allowedControls: ["vOutput"],
    targetValues: { v_output: 3.0 },
    flashingSensor: "left",
  },
  {
    objective: "Set final output to 2x threshold for safety margin",
    allowedControls: ["aOutput", "vOutput"],
    targetValues: { a_output: 4.0, v_output: 6.0 },
    flashingSensor: "left",
  },
  {
    objective: "Verify consistent 1:1 capture at final settings",
    allowedControls: [],
    flashingSensor: null,
  },
];

// Module 5: Failure to Capture
export const module5Steps: ModuleStep[] = [
  {
    objective: "Identify failure to capture - pacing spikes without QRS response",
    allowedControls: [],
    flashingSensor: "right",
  },
  {
    objective: "Check and secure all lead connections",
    allowedControls: [],
    flashingSensor: "right",
  },
  {
    objective: "Increase ventricular output to maximum (25 mA)",
    allowedControls: ["vOutput"],
    targetValues: { v_output: 25.0 },
    flashingSensor: "left",
  },
  {
    objective: "Switch to different pacing mode if capture fails",
    allowedControls: ["mode"],
    targetValues: { mode: 1 }, // VVI mode
    flashingSensor: "left",
  },
  {
    objective: "Consider lead repositioning if high output fails to capture",
    allowedControls: [],
    flashingSensor: null,
  },
];

// Module step selector
export const getModuleSteps = (moduleId: number): ModuleStep[] => {
  switch (moduleId) {
    case 1:
      return module1Steps;
    case 2:
      return module2Steps;
    case 3:
      return module3Steps;
    case 4:
      return module4Steps;
    case 5:
      return module5Steps;
    default:
      return [];
  }
};