// src/modules/module-steps/module1.ts
import { ModuleStep } from "@/types/module";

export const module1Steps: ModuleStep[] = [
  {
    objective: "Decrease heart rate to 30 BPM",
    allowedControls: ["rate"],
    targetValues: { rate: 30 },
    flashingSensor: "right",
  },
  {
    objective: "Set atrial output to 0.1 mA",
    allowedControls: ["aOutput"],
    targetValues: { a_output: 0.1 },
    flashingSensor: "right",
  },
  {
    objective: "Select the correct pacing mode",
    allowedControls: ["mode"], // comment in future when control is added
    targetValues: { mode: 4 },
    flashingSensor: "right",
  },
  {
    objective: "Now, adjust aSensitivity to 0.4 to start checking sensitivity",
    allowedControls: ["aSensitivity"],
    targetValues: { aSensitivity: 0.4},
    flashingSensor: "right",
  },
  {
    objective: "Slowly increase aSensitivity mV to 1.6 mV until the sensing light stops flashing. When the sensing light stops flashing, you have hit the sensing threshold",
    allowedControls: ["aSensitivity"],
    targetValues: { aSensitivity: 1.6 },
    flashingSensor: "right",
  },
  {
    objective: "Set aSensitivity mV to half of the sensitivity threshold",
    allowedControls: ["aSensitivity"],
    targetValues: { aSensitivity: 0.8 },
    flashingSensor: "left",
  },
  // //for v
  // {
  //   objective: "Slowly increase vSensitivity mV to 2.0 mV until the sensing light stops flashing. When the sensing light stops flashing, you have hit the sensing threshold",
  //   allowedControls: ["vSensitivity"],
  //   targetValues: { vSensitivity: 2.0 },
  // },
  // {
  //   objective: "Set vSensitivity mV to half of the sensitivity threshold",
  //   allowedControls: ["vSensitivity"],
  //   targetValues: { vSensitivity: 1.0 },
  // },
  //second part
  {
    objective: "Set rate 10 bpm above patient intrinsic HR",
    allowedControls: ["rate"],
    targetValues: { rate: 50 },
    flashingSensor: "left",

  },
  {
    objective: "Slowly increase aOutput until consistent capture",
    allowedControls: ["aOutput"],
    targetValues: { a_output: 4 },
    flashingSensor: "left",

  },
  {
    objective: "aOutput threshold is 4, set aOutput accordingly to double the threshold",
    allowedControls: ["aOutput"],
    targetValues: { a_output: 8 },
    flashingSensor: "left",

  },
  // {
  //   objective: "Do the same with vOutput, increasing it to 4",
  //   allowedControls: ["vOutput"],
  //   targetValues: { v_output: 4 },
  // },
  // {
  //   objective: "vOutput threshold is 4, set vOutput accordingly",
  //   allowedControls: ["vOutput"],
  //   targetValues: { v_output: 8 },
  // },
  {
    objective: "Restore rate as ordered to physician's request of 80 BPM",
    allowedControls: ["rate"],
    targetValues: { rate: 80 },
    flashingSensor: "left",

  },
];
