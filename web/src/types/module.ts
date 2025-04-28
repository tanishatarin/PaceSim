import { PacemakerState } from "@/utils/PacemakerWebSocketClient";

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
  sensorStates?: {
    left: boolean;
    right: boolean;
  };
  flashingSensor?: "left" | "right" | null;
}