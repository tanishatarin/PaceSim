import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const ECGVisualizer = () => {
  const [data, setData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sample ECG data points (using a subset of your data for demonstration)
  // Points representing a single ECG complex
  const baseComplex = [
    { x: 0, y: 0 }, // Baseline
    { x: 1, y: 0 }, // P wave start
    { x: 2, y: 10 }, // P wave peak
    { x: 3, y: 0 }, // P wave end
    { x: 4, y: 0 }, // PR segment
    { x: 5, y: -5 }, // Q wave
    { x: 6, y: 100 }, // R wave peak
    { x: 7, y: -10 }, // S wave
    { x: 8, y: 0 }, // ST segment
    { x: 9, y: 15 }, // T wave peak
    { x: 10, y: 0 }, // T wave end
    { x: 11, y: 0 }, // Baseline
    { x: 12, y: 0 }, // Baseline
    { x: 13, y: 0 }, // Baseline
    { x: 14, y: 0 }, // Baseline
    { x: 15, y: 0 }, // Baseline
  ];

  // Generate multiple complexes
  const points = [];
  const numberOfComplexes = 10;

  for (let i = 0; i < numberOfComplexes; i++) {
    baseComplex.forEach((point) => {
      points.push({
        x: point.x + i * baseComplex.length,
        y: point.y,
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
            label={{ value: "Time (ms)", position: "bottom" }}
          />
          <YAxis
            domain={[-100, 100]}
            label={{ value: "mV", angle: -90, position: "left" }}
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
