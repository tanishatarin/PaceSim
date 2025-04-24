// src/modules/module-steps/module1.ts
import { ModuleStep } from "@/types/module";

export const module1Steps: ModuleStep[] = [
  {
    objective: "Decrease heart rate to 30 BPM",
    allowedControls: ["rate"],
    targetValues: { rate: 30 },
  },
  {
    objective: "Set ventricular output to 0.1 mA",
    allowedControls: ["vOutput"],
    targetValues: { v_output: 0.1 },
  },
  // {
  //   objective: "Select the ventricular parameter (coming soon)",
  //   allowedControls: [], // comment in future when control is added
  //   // targetValues: { selectedParam: "ventricular" },
  // },
  {
    objective: "Slowly decrease sensitivity to 1.5 mV until the sensing light stops flashing",
    allowedControls: ["aSensitivity"],
    targetValues: { aSensitivity: 1.6 },
  },
  {
    objective: "Further decrease sensitivity to 0.75 mV",
    allowedControls: ["aSensitivity"],
    targetValues: { aSensitivity: 0.8 },
  },
  //seecond part
  {
    objective: "Set rate 10 bpm above patient intrinsic HR",
    allowedControls: ["rate"],
    targetValues: { rate: 50 },
  },
  {
    objective: "Slowly increase output until consistent capture",
    allowedControls: ["aOutput"],
    targetValues: { a_output: 4 },
  },
  {
    objective: "aOutput threshold is 4, set aOutput accordingly",
    allowedControls: ["aOutput"],
    targetValues: { a_output: 8 },
  },
  {
    objective: "Restore rate as ordered to physician's request of 80 BPM",
    allowedControls: ["aOutput"],
    targetValues: { a_output: 8 },
  },
];
