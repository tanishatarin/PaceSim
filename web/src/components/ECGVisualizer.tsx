import { useEffect, useState, useMemo} from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  generateNormalPacingPoints,
  generateBradycardiaPoints,
  generateOversensingPoints,
  generateUndersensingPoints,
  generateCaptureModulePoints,
  generateFailureToCapturePoints,
} from "@/components/ecgModes";
import { ModuleStep } from "@/types/module";


interface ECGVisualizerProps {
  rate?: number;
  aOutput?: number;
  vOutput?: number;
  sensitivity?: number;
  mode?:
  | "sensitivity"
  | "oversensing"
  | "undersensing"
  | "capture_module"
  | "failure_to_capture";
}

const speedMultipliers: Record<string, number> = {
  initial: 1,
  sensitivity: 1,
  oversensing: 1,
  undersensing: 1,
  capture_module: 2.5,
  failure_to_capture: 2,
};

const ECGVisualizer = ({
  rate = 150,
  aOutput = 5,
  vOutput = 5,
  sensitivity = 1,
  mode = "sensitivity",
}: ECGVisualizerProps) => {
  type Point = { x: number; y: number };

  const [data, setData] = useState<Point[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Define the base complex with physiologically accurate wave morphology
  const baseComplex = [
    { x: 0, y: 0 }, // Baseline
    { x: 1, y: 0.1 }, // P wave start
    { x: 2, y: 0.25 }, // P wave peak
    { x: 3, y: 0.1 }, // P wave end
    { x: 4, y: 0 }, // PR segment
    { x: 5, y: -0.2 }, // Q wave
    { x: 6, y: 1.5 }, // R wave peak (normal amplitude around 1.5mV)
    { x: 7, y: -0.4 }, // S wave
    { x: 8, y: -0.1 }, // J point
    { x: 9, y: 0 }, // ST segment
    { x: 10, y: 0.1 }, // T wave start
    { x: 11, y: 0.4 }, // T wave peak
    { x: 12, y: 0.1 }, // T wave end
    { x: 13, y: 0 }, // Baseline
    { x: 14, y: 0 }, // Baseline
    { x: 15, y: 0 }, // Baseline
  ];


  // Generate multiple complexes with amplitude adjustments
  const generatePoints = (): Point[] => {
    switch (mode) {
      case "sensitivity":
        return generateBradycardiaPoints({
          rate,
          aOutput,
          vOutput,
          sensitivity,
        });

      case "oversensing":
        return generateOversensingPoints();

      case "undersensing":
        return generateUndersensingPoints();
        
      case "capture_module":
        return generateCaptureModulePoints({
          rate,
          aOutput,
          vOutput,
          sensitivity,
          
        });

      case "failure_to_capture":
        return generateFailureToCapturePoints({
          rate,
          aOutput,
          vOutput,
          sensitivity,
        });
        {
          /**      case "failure_to_sense":
        return generateFailureToSensePoints({
          rate,
          aOutput,
          vOutput,
          sensitivity,
        });
      case "bariatric_capture":
        return generateBariatricCapturePoints({
          rate,
          aOutput,
          vOutput,
          sensitivity,
        });
      case "third_degree_block":
        return generateThirdDegreeBlockPoints({
          rate,
          aOutput,
          vOutput,
          sensitivity,
        });
      case "atrial_fibrilation":
        return generateAfibPoints({ rate, aOutput, vOutput, sensitivity });
      case "second_degree_block":
        return generateSecondDegreeBlockPoints({
          rate,
          aOutput,
          vOutput,
          sensitivity,
        });
      case "slow_junctional":
        return generateSlowJunctionalPoints({
          rate,
          aOutput,
          vOutput,
          sensitivity,
        });
      case "asystole":
        return generateAsystolePoints({ rate, aOutput, vOutput, sensitivity });
      default:
        return generateNormalPacingPoints({
          rate,
          aOutput,
          vOutput,
          sensitivity,
        }); */
        }
    }
  };
  const points = useMemo(() => 
    generatePoints(), 
    [rate, aOutput, vOutput, sensitivity, mode]
  );
  useEffect(() => {
    setData(points.slice(0, 100));
    const speedMultiplier = speedMultipliers[mode] || 1; // fallback = normal speed
  
    const updateInterval = (60000 / rate / baseComplex.length) * speedMultiplier;
  
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % points.length;
        setData((prevData) => {
          const newData = [...prevData.slice(1), points[newIndex]];
          return newData;
        });
        return newIndex;
      });
    }, updateInterval);
  
    return () => clearInterval(interval);
  }, [points, rate, mode]);

  return (
    <div className="w-full h-64 overflow-hidden bg-black relative rounded-lg">
      <div className="absolute inset-0 z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* Small 1mm grid */}
            <pattern id="smallGrid" width="4" height="4" patternUnits="userSpaceOnUse">
              <path d="M 4 0 L 0 0 0 4" fill="none" stroke="red" strokeWidth="0.2" opacity="0.3" />
            </pattern>

            {/* Big 5mm grid */}
            <pattern id="bigGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="url(#smallGrid)" />
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="red" strokeWidth="0.8" opacity="0.5" />
            </pattern>
          </defs>

          {/* Fill background */}
          <rect width="100%" height="100%" fill="url(#bigGrid)" />
        </svg>
      </div>


      <div className="absolute inset-0 z-10">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            key={`${rate}-${aOutput}-${vOutput}-${sensitivity}-${mode}`}
            data={data}
            margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
          >
            <XAxis
              dataKey="x"
              tick={false}
              axisLine={false}
              stroke="transparent"
              allowDataOverflow={true}
              interval={0}
              padding={{ left: 0, right: 0 }}
            />
            <YAxis
              domain={[-2, 5]}
              tick={false}
              axisLine={false}
              stroke="transparent"
              allowDataOverflow={true}
              padding={{ top: 0, bottom: 0 }}
            />
            <Line
              type="linear"
              dataKey="y"
              stroke="#00ff00"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>

  );
};

export default ECGVisualizer;
