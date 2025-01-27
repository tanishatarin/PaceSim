// // import React, { useEffect, useRef } from 'react';
// // import { 
// //   lightningChart,
// //   AxisScrollStrategies,
// //   ChartXY,
// //   LineSeries
// // } from '@arction/lcjs';

// // interface ECGPoint {
// //   x: number;
// //   y: number;
// // }

// // interface ECGVisualizerProps {
// //   width?: string;
// //   height?: string;
// //   className?: string;
// // }

// // const ECGVisualizer: React.FC<ECGVisualizerProps> = ({
// //   width = '100%',
// //   height = '400px',
// //   className = ''
// // }) => {
// //   const chartRef = useRef<HTMLDivElement>(null);
// //   const chartInstance = useRef<ChartXY | null>(null);
// //   const seriesInstance = useRef<LineSeries | null>(null);

// //   // Sample ECG data points
// //   const points: ECGPoint[] = [
// //     { x: 2, y: 81 },
// //     { x: 3, y: 83 },
// //     // ... rest of your points array
// //   ];

// //   useEffect(() => {
// //     if (!chartRef.current) return;

// //     // Initialize the chart
// //     chartInstance.current = lightningChart().ChartXY({
// //       container: chartRef.current,
// //     })
// //     .setTitle('ECG');

// //     // Create line series
// //     seriesInstance.current = chartInstance.current.addLineSeries({
// //       dataPattern: {
// //         pattern: 'ProgressiveX',
// //         regularProgressiveStep: true,
// //       },
// //     })
// //     .setName('ECG Data')
// //     .setDataCleaning({ minDataPointCount: 10000 });

// //     // Setup Y axis
// //     chartInstance.current
// //       .getDefaultAxisY()
// //       .setTitle('mV')
// //       .setInterval({ start: -1600, end: 1000, stopAxisAfter: false })
// //       .setScrollStrategy(AxisScrollStrategies.expansion);

// //     // Setup X axis
// //     chartInstance.current
// //       .getDefaultAxisX()
// //       .setTitle('milliseconds')
// //       .setDefaultInterval((state) => ({ 
// //         end: state.dataMax, 
// //         start: (state.dataMax ?? 0) - 2500, 
// //         stopAxisAfter: false 
// //       }))
// //       .setScrollStrategy(AxisScrollStrategies.progressive);

// //     // Stream data simulation
// //     let currentIndex = 0;
// //     const streamInterval = setInterval(() => {
// //       if (!seriesInstance.current) return;
      
// //       // Add next batch of points
// //       const batchSize = 48;
// //       const newPoints = [];
// //       for (let i = 0; i < batchSize && currentIndex < points.length; i++) {
// //         newPoints.push({
// //           x: points[currentIndex].x,
// //           y: points[currentIndex].y
// //         });
// //         currentIndex = (currentIndex + 1) % points.length;
// //       }
// //       seriesInstance.current.add(newPoints);
// //     }, 50);

// //     // Cleanup
// //     return () => {
// //       clearInterval(streamInterval);
// //       if (chartInstance.current) {
// //         chartInstance.current.dispose();
// //         chartInstance.current = null;
// //       }
// //     };
// //   }, []);

// //   return (
// //     <div 
// //       ref={chartRef} 
// //       style={{ width, height }} 
// //       className={className}
// //     />
// //   );
// // };

// // export default ECGVisualizer;

// import React, { useEffect, useState } from 'react';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   ResponsiveContainer
// } from 'recharts';

// const ECGVisualizer = () => {
//   const [data, setData] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   // Sample ECG data points (using a subset of your data for demonstration)
//   const points = [
//     { x: 2, y: 81 }, { x: 3, y: 83 }, { x: 4, y: 88 }, { x: 5, y: 98 },
//     { x: 6, y: 92 }, { x: 7, y: 85 }, { x: 8, y: 73 }, { x: 9, y: 71 },
//     { x: 10, y: 70 }, { x: 11, y: 83 }, { x: 12, y: 73 }, { x: 13, y: 79 },
//     { x: 14, y: 84 }, { x: 15, y: 78 }, { x: 16, y: 67 }, { x: 17, y: 71 },
//     { x: 18, y: 76 }, { x: 19, y: 77 }, { x: 20, y: 64 }, { x: 21, y: 53 },
//     { x: 22, y: 0 }, { x: 23, y: 41 }, { x: 24, y: 51 }, { x: 25, y: 3 },
//     // Add more points as needed
//   ];

//   useEffect(() => {
//     // Initialize with first set of points
//     setData(points.slice(0, 100));

//     // Set up data streaming
//     const interval = setInterval(() => {
//       setCurrentIndex((prevIndex) => {
//         const newIndex = (prevIndex + 1) % points.length;
//         setData((prevData) => {
//           const newData = [...prevData.slice(1), points[newIndex]];
//           return newData;
//         });
//         return newIndex;
//       });
//     }, 50);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="w-full h-96 bg-white p-4 rounded-lg shadow">
//       <ResponsiveContainer width="100%" height="100%">
//         <LineChart
//           data={data}
//           margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//         >
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis 
//             dataKey="x" 
//             label={{ value: 'Time (ms)', position: 'bottom' }} 
//           />
//           <YAxis 
//             domain={[-100, 100]} 
//             label={{ value: 'mV', angle: -90, position: 'left' }} 
//           />
//           <Line
//             type="monotone"
//             dataKey="y"
//             stroke="#8884d8"
//             dot={false}
//             isAnimationActive={false}
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default ECGVisualizer;

import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';

const ECGVisualizer = () => {
  const [data, setData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sample ECG data points (using a subset of your data for demonstration)
  // Points representing a single ECG complex
  const baseComplex = [
    { x: 0, y: 0 },    // Baseline
    { x: 1, y: 0 },    // P wave start
    { x: 2, y: 10 },   // P wave peak
    { x: 3, y: 0 },    // P wave end
    { x: 4, y: 0 },    // PR segment
    { x: 5, y: -5 },   // Q wave
    { x: 6, y: 100 },  // R wave peak
    { x: 7, y: -10 },  // S wave
    { x: 8, y: 0 },    // ST segment
    { x: 9, y: 15 },   // T wave peak
    { x: 10, y: 0 },   // T wave end
    { x: 11, y: 0 },   // Baseline
    { x: 12, y: 0 },   // Baseline
    { x: 13, y: 0 },   // Baseline
    { x: 14, y: 0 },   // Baseline
    { x: 15, y: 0 },   // Baseline
  ];

  // Generate multiple complexes
  const points = [];
  const numberOfComplexes = 10;
  
  for (let i = 0; i < numberOfComplexes; i++) {
    baseComplex.forEach(point => {
      points.push({
        x: point.x + (i * baseComplex.length),
        y: point.y
      });
    });
  }

  useEffect(() => {
    // Initialize with first set of points
    setData(points.slice(0, 100));

    // Set up data streaming
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % points.length;
        setData((prevData) => {
          const newData = [...prevData.slice(1), points[newIndex]];
          return newData;
        });
        return newIndex;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-96 bg-white p-4 rounded-lg shadow">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="x" 
            label={{ value: 'Time (ms)', position: 'bottom' }} 
          />
          <YAxis 
            domain={[-100, 100]} 
            label={{ value: 'mV', angle: -90, position: 'left' }} 
          />
          <Line
            type="monotone"
            dataKey="y"
            stroke="#8884d8"
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ECGVisualizer;