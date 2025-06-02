// src/components/SimulationControls.tsx - New component for hardware simulation
import React from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SimulationControlsProps {
  rate: number;
  aOutput: number;
  vOutput: number;
  aSensitivity: number;
  vSensitivity: number;
  mode: number;
  onRateChange: (value: number) => void;
  onAOutputChange: (value: number) => void;
  onVOutputChange: (value: number) => void;
  onASensitivityChange: (value: number) => void;
  onVSensitivityChange: (value: number) => void;
  onModeChange: (value: number) => void;
  isConnected: boolean;
}

const pacingModes = [
  { value: 0, label: "VOO - Ventricular Pacing Only" },
  { value: 1, label: "VVI - Ventricular Demand" },
  { value: 2, label: "VVT - Ventricular Triggered" },
  { value: 3, label: "AOO - Atrial Pacing Only" },
  { value: 4, label: "AAI - Atrial Demand" },
  { value: 5, label: "DOO - Dual Chamber Async" },
  { value: 6, label: "DDD - Dual Chamber" },
  { value: 7, label: "DDI - Dual Chamber Inhibited" },
];

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  rate,
  aOutput,
  vOutput,
  aSensitivity,
  vSensitivity,
  mode,
  onRateChange,
  onAOutputChange,
  onVOutputChange,
  onASensitivityChange,
  onVSensitivityChange,
  onModeChange,
  isConnected,
}) => {
  if (isConnected) {
    return (
      <Card className="p-4 bg-green-50 border-green-200">
        <h3 className="mb-2 font-bold text-green-800">Hardware Connected</h3>
        <p className="text-sm text-green-700">
          Using real pacemaker data. Controls are managed by hardware.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-6 bg-white border-yellow-200">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800">Simulation Controls</h3>
        <div className="px-2 py-1 text-xs text-yellow-800 bg-yellow-100 rounded">
          SIMULATION MODE
        </div>
      </div>

      {/* Pacing Rate */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Pacing Rate: {rate} BPM
        </label>
        <Slider
          value={[rate]}
          onValueChange={(values) => onRateChange(values[0])}
          min={30}
          max={180}
          step={5}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>30 BPM</span>
          <span>180 BPM</span>
        </div>
      </div>

      {/* Pacing Mode */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Pacing Mode</label>
        <Select value={String(mode)} onValueChange={(value) => onModeChange(parseInt(value))}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select pacing mode" />
          </SelectTrigger>
          <SelectContent>
            {pacingModes.map((modeOption) => (
              <SelectItem key={modeOption.value} value={String(modeOption.value)}>
                {modeOption.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Atrial Output */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Atrial Output: {aOutput.toFixed(1)} mA
        </label>
        <Slider
          value={[aOutput]}
          onValueChange={(values) => onAOutputChange(values[0])}
          min={0}
          max={20}
          step={0.1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>0.0 mA</span>
          <span>20.0 mA</span>
        </div>
      </div>

      {/* Ventricular Output */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Ventricular Output: {vOutput.toFixed(1)} mA
        </label>
        <Slider
          value={[vOutput]}
          onValueChange={(values) => onVOutputChange(values[0])}
          min={0}
          max={25}
          step={0.1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>0.0 mA</span>
          <span>25.0 mA</span>
        </div>
      </div>

      {/* Atrial Sensitivity */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Atrial Sensitivity: {aSensitivity.toFixed(1)} mV
        </label>
        <Slider
          value={[aSensitivity]}
          onValueChange={(values) => onASensitivityChange(values[0])}
          min={0.1}
          max={20}
          step={0.1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>0.1 mV</span>
          <span>20.0 mV</span>
        </div>
      </div>

      {/* Ventricular Sensitivity */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Ventricular Sensitivity: {vSensitivity.toFixed(1)} mV
        </label>
        <Slider
          value={[vSensitivity]}
          onValueChange={(values) => onVSensitivityChange(values[0])}
          min={0.1}
          max={20}
          step={0.1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>0.1 mV</span>
          <span>20.0 mV</span>
        </div>
      </div>
    </Card>
  );
};



