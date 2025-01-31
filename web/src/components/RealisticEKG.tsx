import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";

const RealisticEKG = ({ rate, aOutput, vOutput }) => {
  const [data, setData] = useState([]);
  const [timeCounter, setTimeCounter] = useState(0);

  // Calculate intervals based on rate
  const calculateIntervals = () => {
    const beatInterval = 60000 / rate; // Convert BPM to ms between beats
    const pDuration = 120; // P wave duration in ms
    const prInterval = 160; // PR interval in ms
    const qrsDuration = 100; // QRS duration in ms
    const qtInterval = 400; // QT interval in ms
    return { beatInterval, pDuration, prInterval, qrsDuration, qtInterval };
  };

  // Generate single heartbeat waveform
  const generateBeat = (time) => {
    const { pDuration, prInterval, qrsDuration } = calculateIntervals();

    // Scale amplitudes based on outputs
    const pAmplitude = (aOutput / 20) * 0.25; // P wave amplitude
    const qrsAmplitude = (vOutput / 25) * 1.5; // QRS amplitude

    // Generate waveform points
    const points = [];
    const samplingRate = 10; // Points per ms

    for (let t = 0; t < 800; t += samplingRate) {
      let value = 0;

      // P Wave (if atrial output > 0)
      if (aOutput > 0 && t < pDuration) {
        value += pAmplitude * Math.sin((Math.PI * t) / pDuration);
      }

      // QRS Complex (if ventricular output > 0)
      if (vOutput > 0 && t >= prInterval && t < prInterval + qrsDuration) {
        const qrsT = t - prInterval;
        if (qrsT < qrsDuration / 4) {
          value -= qrsAmplitude * 0.2; // Q wave
        } else if (qrsT < qrsDuration / 2) {
          value += qrsAmplitude; // R wave
        } else {
          value -= qrsAmplitude * 0.3; // S wave
        }
      }

      // T Wave
      if (
        t >= prInterval + qrsDuration + 50 &&
        t < prInterval + qrsDuration + 160
      ) {
        const tAmplitude = qrsAmplitude * 0.3;
        value +=
          tAmplitude *
          Math.sin((Math.PI * (t - (prInterval + qrsDuration + 50))) / 110);
      }

      points.push({
        time: time + t,
        value: value,
      });
    }

    return points;
  };

  useEffect(() => {
    const intervals = calculateIntervals();
    const updateInterval = 50; // Update every 50ms

    const timer = setInterval(() => {
      setTimeCounter((prev) => {
        const newTime = prev + updateInterval;

        // Generate new beat if it's time
        if (newTime % intervals.beatInterval < updateInterval) {
          const newBeat = generateBeat(newTime);
          setData((prevData) => {
            const filtered = prevData.filter(
              (point) => point.time > newTime - 2000,
            );
            return [...filtered, ...newBeat];
          });
        }

        return newTime;
      });
    }, updateInterval);

    return () => clearInterval(timer);
  }, [rate, aOutput, vOutput]);

  return (
    <div className="w-full h-96 bg-white rounded-xl p-4">
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis
            dataKey="time"
            domain={["dataMin", "dataMax"]}
            type="number"
            hide
          />
          <YAxis domain={[-2, 2]} hide />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#2563eb"
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RealisticEKG;
