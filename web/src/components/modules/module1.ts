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
  {
    objective: "Select the correct pacing mode given that you have both A and V leads",
    allowedControls: ["mode"], // comment in future when control is added
    targetValues: { mode: 6 },
  },
  {
    objective: "Set aSensitivity to 0.4 and vSensitivity to 0.8 to start checking sensitivity",
    allowedControls: ["aSensitivity", "vSensitivity"],
    targetValues: { aSensitivity: 0.4 , vSensitivity: 0.8},
  },
  {
    objective: "Slowly increase aSensitivity mV to 1.6 mV until the sensing light stops flashing. When the sensing light stops flashing, you have hit the sensing threshold",
    allowedControls: ["aSensitivity"],
    targetValues: { aSensitivity: 1.6 },
  },
  {
    objective: "Set aSensitivity mV to half of the sensitivity threshold",
    allowedControls: ["aSensitivity"],
    targetValues: { aSensitivity: 0.8 },
  },
  //for v
  {
    objective: "Slowly increase vSensitivity mV to 1.6 mV until the sensing light stops flashing. When the sensing light stops flashing, you have hit the sensing threshold",
    allowedControls: ["vSensitivity"],
    targetValues: { vSensitivity: 1.6 },
  },
  {
    objective: "Set vSensitivity mV to half of the sensitivity threshold",
    allowedControls: ["vSensitivity"],
    targetValues: { vSensitivity: 0.8 },
  },
  //second part
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
    objective: "Slowly increase output vOutput to match aOutput",
    allowedControls: ["vOutput"],
    targetValues: { v_output: 4 },
  },
  {
    objective: "vOutput threshold is 4, set vOutput accordingly",
    allowedControls: ["vOutput"],
    targetValues: { v_output: 8 },
  },
  {
    objective: "Restore rate as ordered to physician's request of 80 BPM",
    allowedControls: ["rate"],
    targetValues: { rate: 80 },
  },
];
