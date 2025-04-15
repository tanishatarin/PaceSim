import { PacemakerState } from "@/utils/PacemakerWebSocketClient";

type ECGMode =
  | "initial"
  | "sensitivity"
  | "oversensing"
  | "undersensing"
  | "capture_module"
  | "failure_to_capture";


export interface SensorState {
  left: boolean;
  right: boolean;
}

export interface PacemakerInfoItem {
  label: string;
  value: string;
}

export interface ModuleStep {
  objective: string;
  allowedControls: string[];
  targetValues?: Partial<PacemakerState>;
  ecgMode?: ECGMode;
}