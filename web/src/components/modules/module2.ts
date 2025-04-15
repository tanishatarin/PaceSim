import { ModuleStep } from "@/types/module";

export const module2Steps: ModuleStep[] = [
  {
    objective: "The patient has a heart rate of 40 BPM, set the pacemaker heart rate appropriately",
    allowedControls: ["rate"],
    targetValues: { rate: 30 },
  },
  {
    objective: "Decrease ventricular output to minimize unwanted pacing",
    allowedControls: ["v_output"],
    targetValues: { v_output: 0.1 },
  },
  // {
  //   objective: "Select the correct mode with the up & down arrows on the pacemaker",
  //   allowedControls: [],
  //   // targetValues: { selectedParam: "ventricular" },
  // },
  //"Slowly decrease sensitivity to 1.5 mV until the sensing light stops flashing"
  {
    objective: "Slowly decrease sensitivity until the sensing light stops flashing",
    allowedControls: ["vSensitivity"],
    targetValues: { vSensitivity: 1.5 },
  },
  //"Further decrease sensitivity to 0.75 mV"
  {
    objective: "Set sensitivity based on sensing light threshold",
    allowedControls: ["vSensitivity"],
    targetValues: { vSensitivity: 0.8 },
  }
];
