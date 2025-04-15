import { ModuleStep } from "@/types/module";

export const module2Steps: ModuleStep[] = [
  {
    objective: "Decrease heart rate to 30 BPM",
    allowedControls: ["rate"],
    targetValues: { rate: 30 },
  },
  {
    objective: "Set ventricular output to 0.1 mA",
    allowedControls: ["v_output"],
    targetValues: { v_output: 0.1 },
  },
  // {
  //   objective: "Select the ventricular parameter (coming soon)",
  //   allowedControls: [],
  //   // targetValues: { selectedParam: "ventricular" },
  // },
  {
    objective: "Slowly decrease sensitivity to 1.5 mV until the sensing light stops flashing",
    allowedControls: ["vSensitivity"],
    targetValues: { vSensitivity: 1.5 },
  },
  {
    objective: "Further decrease sensitivity to 0.75 mV",
    allowedControls: ["vSensitivity"],
    targetValues: { vSensitivity: 0.75 },
  }
];
