// import { useEffect, useState } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   ResponsiveContainer,
// } from "recharts";

// const ECGVisualizer = ({ rate = 60, aOutput = 5, vOutput = 5 }) => {
//   const [data, setData] = useState<{ x: number; y: number }[]>([]);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   // Define the base complex with physiologically accurate wave morphology
//   const baseComplex = [
//     { x: 0, y: 0 }, // Baseline
//     { x: 1, y: 0.1 }, // P wave start
//     { x: 2, y: 0.25 }, // P wave peak
//     { x: 3, y: 0.1 }, // P wave end
//     { x: 4, y: 0 }, // PR segment
//     { x: 5, y: -0.2 }, // Q wave
//     { x: 6, y: 1.5 }, // R wave peak (normal amplitude around 1.5mV)
//     { x: 7, y: -0.4 }, // S wave
//     { x: 8, y: -0.1 }, // J point
//     { x: 9, y: 0 }, // ST segment
//     { x: 10, y: 0.1 }, // T wave start
//     { x: 11, y: 0.4 }, // T wave peak
//     { x: 12, y: 0.1 }, // T wave end
//     { x: 13, y: 0 }, // Baseline
//     { x: 14, y: 0 }, // Baseline
//     { x: 15, y: 0 }, // Baseline
//   ];

//   // Non-linear scaling function to simulate physiological response
//   const calculateNonLinearScale = (output: number, maxResponse = 5) => {
//     // Logarithmic scaling function that plateaus as current increases
//     return Math.min(maxResponse, Math.log(output + 1) / Math.log(6));
//   };

//   // Generate multiple complexes with amplitude adjustments
//   const generatePoints = () => {
//     const points: { x: number; y: number }[] = [];
//     const numberOfComplexes = 10;
    
//     // Calculate non-linear scaling factors
//     const aScale = calculateNonLinearScale(aOutput, 1); // Max 1mV for atrial
//     const vScale = calculateNonLinearScale(vOutput, 5); // Max 5mV for ventricle

//     for (let i = 0; i < numberOfComplexes; i++) {
//       baseComplex.forEach((point) => {
//         let scaledY = point.y;
        
//         // Scale P wave based on aOutput (atrial component)
//         if (point.x % baseComplex.length >= 1 && point.x % baseComplex.length <= 3) {
//           scaledY = point.y * aScale;
//         }
        
//         // Scale QRS complex based on vOutput (ventricular component)
//         if (point.x % baseComplex.length >= 5 && point.x % baseComplex.length <= 7) {
//           scaledY = point.y * vScale;
//         }

//         // Scale T wave proportionally to QRS
//         if (point.x % baseComplex.length >= 10 && point.x % baseComplex.length <= 12) {
//           scaledY = point.y * (vScale * 0.3); // T wave typically ~30% of QRS
//         }

//         points.push({
//           x: point.x + i * baseComplex.length,
//           y: scaledY,
//         });
//       });
//     }
//     return points;
//   };

//   useEffect(() => {
//     const points = generatePoints();
//     setData(points.slice(0, 100));

//     // Calculate update interval based on heart rate
//     const updateInterval = (60000 / rate) / baseComplex.length;

//     const interval = setInterval(() => {
//       setCurrentIndex((prevIndex) => {
//         const newIndex = (prevIndex + 1) % points.length;
//         setData((prevData) => {
//           const newData = [...prevData.slice(1), points[newIndex]];
//           return newData;
//         });
//         return newIndex;
//       });
//     }, updateInterval);

//     return () => clearInterval(interval);
//   }, [rate, aOutput, vOutput]);

//   return (
//     <div className="w-full p-4 bg-black rounded-lg h-96">
//       <ResponsiveContainer width="100%" height="100%">
//         <LineChart
//           data={data}
//           margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
//         >
//           <CartesianGrid 
//             strokeDasharray="3 3" 
//             stroke="#333333"
//           />
//           <XAxis
//             dataKey="x"
//             stroke="#666666"
//             tick={{ fill: '#666666' }}
//             label={{ 
//               value: "Time (milliseconds)", 
//               position: "bottom", 
//               fill: "#666666",
//               dy: 20
//             }}
//           />
//           <YAxis
//             domain={[-2, 5]} // Adjusted to physiological range
//             stroke="#666666"
//             tick={{ fill: '#666666' }}
//             label={{ 
//               value: "Amplitude (mV)", 
//               angle: -90, 
//               position: "left",
//               fill: "#666666",
//               dx: -30
//             }}
//             allowDataOverflow={false}
//           />
//           <Line
//             type="monotone"
//             dataKey="y"
//             stroke="#00ff00"
//             strokeWidth={2}
//             dot={false}
//             isAnimationActive={false}
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default ECGVisualizer;

// import { useEffect, useState } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   ResponsiveContainer,
// } from "recharts";

// const ECGVisualizer = ({ rate = 150, aOutput = 5, vOutput = 5 }) => {
//   const [data, setData] = useState<{ x: number; y: number }[]>([]);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   // Define the base complex with physiologically accurate wave morphology
//   const baseComplex = [
//     { x: 0, y: 0 }, // Baseline
//     { x: 1, y: 0.1 }, // P wave start
//     { x: 2, y: 0.25 }, // P wave peak
//     { x: 3, y: 0.1 }, // P wave end
//     { x: 4, y: 0 }, // PR segment
//     { x: 5, y: -0.2 }, // Q wave
//     { x: 6, y: 1.5 }, // R wave peak (normal amplitude around 1.5mV)
//     { x: 7, y: -0.4 }, // S wave
//     { x: 8, y: -0.1 }, // J point
//     { x: 9, y: 0 }, // ST segment
//     { x: 10, y: 0.1 }, // T wave start
//     { x: 11, y: 0.4 }, // T wave peak
//     { x: 12, y: 0.1 }, // T wave end
//     { x: 13, y: 0 }, // Baseline
//     { x: 14, y: 0 }, // Baseline
//     { x: 15, y: 0 }, // Baseline
//   ];

//   // Non-linear scaling function to simulate physiological response
//   const calculateNonLinearScale = (output: number, maxResponse = 5) => {
//     // Logarithmic scaling function that plateaus as current increases
//     return Math.min(maxResponse, Math.log(output + 1) / Math.log(6));
//   };

//   // Generate multiple complexes with amplitude adjustments
//   const generatePoints = () => {
//     const points: { x: number; y: number }[] = [];
//     const numberOfComplexes = 10;
    
//     // Calculate non-linear scaling factors
//     const aScale = calculateNonLinearScale(aOutput, 1); // Max 1mV for atrial
//     const vScale = calculateNonLinearScale(vOutput, 5); // Max 5mV for ventricle

//     for (let i = 0; i < numberOfComplexes; i++) {
//       baseComplex.forEach((point) => {
//         let scaledY = point.y;
        
//         // Scale P wave based on aOutput (atrial component)
//         if (point.x % baseComplex.length >= 1 && point.x % baseComplex.length <= 3) {
//           scaledY = point.y * aScale;
//         }
        
//         // Scale QRS complex based on vOutput (ventricular component)
//         if (point.x % baseComplex.length >= 5 && point.x % baseComplex.length <= 7) {
//           scaledY = point.y * vScale;
//         }

//         // Scale T wave proportionally to QRS
//         if (point.x % baseComplex.length >= 10 && point.x % baseComplex.length <= 12) {
//           scaledY = point.y * (vScale * 0.3); // T wave typically ~30% of QRS
//         }

//         points.push({
//           x: point.x + i * baseComplex.length,
//           y: scaledY,
//         });
//       });
//     }
//     return points;
//   };

//   useEffect(() => {
//     const points = generatePoints();
//     setData(points.slice(0, 100));

//     // Calculate update interval based on heart rate
//     const updateInterval = (60000 / rate) / baseComplex.length;

//     const interval = setInterval(() => {
//       setCurrentIndex((prevIndex) => {
//         const newIndex = (prevIndex + 1) % points.length;
//         setData((prevData) => {
//           const newData = [...prevData.slice(1), points[newIndex]];
//           return newData;
//         });
//         return newIndex;
//       });
//     }, updateInterval);

//     return () => clearInterval(interval);
//   }, [rate, aOutput, vOutput]);

//   return (
//     <div className="w-full overflow-hidden bg-black rounded-lg h-96">
//       <ResponsiveContainer width="100%" height="100%">
//         <LineChart
//           data={data}
//           margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
//         >
//           <CartesianGrid 
//             strokeDasharray="0" // Remove grid lines
//             stroke="#333333"
//           />
//           <XAxis
//             dataKey="x"
//             stroke="#666666"
//             tick={false} // Hide x-axis values
//             axisLine={false} // Hide x-axis line
//           />
//           <YAxis
//             domain={[-2, 5]} // Adjusted to physiological range
//             stroke="#666666"
//             tick={false} // Hide y-axis values
//             axisLine={false} // Hide y-axis line
//           />
//           <Line
//             type="monotone"
//             dataKey="y"
//             stroke="#00ff00" // Green color for ECG line
//             strokeWidth={2}
//             dot={false}
//             isAnimationActive={false}
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default ECGVisualizer;

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  generateNormalPacingPoints,
  generateFailureToCapturePoints,
  generateFailureToSensePoints,
  generateBariatricCapturePoints,
  generateThirdDegreeBlockPoints,
  generateAfibPoints,
  generateSecondDegreeBlockPoints,
  generateSlowJunctionalPoints,
  generateAsystolePoints,
} from "@/components/ecgModes";

interface ECGVisualizerProps {
  rate?: number;
  aOutput?: number;
  vOutput?: number;
  sensitivity?: number;
  mode?: "normal" | "failure_to_capture" | "failure_to_sense" | "bariatric_capture" |
   "third_degree_block" | "afib" | "second_degree_block" | "slow_junctional" | "asystole"
}

const ECGVisualizer = ({
  rate = 150,
  aOutput = 5,
  vOutput = 5,
  sensitivity = 1,
  mode = "normal",
}: ECGVisualizerProps) => {  type Point = { x: number; y: number };

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

  // Non-linear scaling function to simulate physiological response
  {/*const calculateNonLinearScale = (output : number, maxResponse = 5) => {
    return Math.min(maxResponse, Math.log(output + 1) / Math.log(6));
  };*/}

  // Generate multiple complexes with amplitude adjustments
  const generatePoints = (): Point[] => {
    switch (mode) {
      case "failure_to_capture":
        return generateFailureToCapturePoints({ rate, aOutput, vOutput, sensitivity });
      case "failure_to_sense":
        return generateFailureToSensePoints({ rate, aOutput, vOutput, sensitivity });
      case "bariatric_capture":
        return generateBariatricCapturePoints({ rate, aOutput, vOutput, sensitivity });
      case "third_degree_block":
        return generateThirdDegreeBlockPoints({ rate, aOutput, vOutput, sensitivity });
      case "afib":
        return generateAfibPoints({ rate, aOutput, vOutput, sensitivity });
      case "second_degree_block":
        return generateSecondDegreeBlockPoints({ rate, aOutput, vOutput, sensitivity });
      case "slow_junctional":
        return generateSlowJunctionalPoints({ rate, aOutput, vOutput, sensitivity });
      case "asystole":
        return generateAsystolePoints({ rate, aOutput, vOutput, sensitivity });
      default:
        return generateNormalPacingPoints({ rate, aOutput, vOutput, sensitivity })
        ;
    }
  };
  

  useEffect(() => {
    const points = generatePoints();
    setData(points.slice(0, 100));

    const updateInterval = (60000 / rate) / baseComplex.length;

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
  }, [rate, aOutput, vOutput]);

  return (
    <div className="w-full h-64 overflow-hidden bg-black rounded-lg">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
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
            type="monotone"
            dataKey="y"
            stroke="#00ff00"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ECGVisualizer;