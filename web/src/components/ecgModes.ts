export type Point = { x: number; y: number };

type ECGParams = {
  rate: number; // pacing rate in bpm
  aOutput: number; // atrial output strength (mA)
  vOutput: number; // ventricular output strength (mA)
  sensitivity: number; // sensing threshold (mV)
};

const lerp = (start: Point, end: Point, steps: number): Point[] => {
  const pts: Point[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    pts.push({
      x: start.x + (end.x - start.x) * t,
      y: start.y + (end.y - start.y) * t,
    });
  }
  return pts;
};

export const generateNormalPacingPoints = ({
  rate,
  aOutput,
  vOutput,
  sensitivity,
}: ECGParams): Point[] => {
  const points: Point[] = [];
  const baseComplexLength = 16;
  const numberOfComplexes = 6; // Match image length
  const complexSpacing = 45; // Add gap between each beat to reach ~1.8 sec interval

  const baseComplex: Point[] = [
    { x: 0, y: 0 },
    ...lerp({ x: 1, y: 0.1 }, { x: 3, y: 0.25 }, 5),  // smoother P wave
    ...lerp({ x: 3, y: 0.25 }, { x: 4, y: 0 }, 3),    // PR segment
    ...lerp({ x: 4, y: 0 }, { x: 5, y: -0.2 }, 3),    // Q wave
    ...lerp({ x: 5, y: -0.2 }, { x: 6, y: 1.5 }, 3),  // R
    ...lerp({ x: 6, y: 1.5 }, { x: 7, y: -0.4 }, 3),  // S
    ...lerp({ x: 7, y: -0.4 }, { x: 9, y: 0 }, 6),    // ST
    ...lerp({ x: 9, y: 0 }, { x: 11, y: 0.4 }, 5),    // T
    ...lerp({ x: 11, y: 0.4 }, { x: 13, y: 0 }, 5),   // End of T wave
    { x: 14, y: 0 },
    { x: 15, y: 0 },
  ];
  

  // Output scaling
  const scaleOutput = (output: number, max = 5) =>
    Math.min(max, Math.log(output + 1) / Math.log(6));

  const aScale = scaleOutput(aOutput, 1);
  const vScale = scaleOutput(vOutput, 5);

  for (let i = 0; i < numberOfComplexes; i++) {
    const offset = i * complexSpacing;

    // Simulate appropriate sensing: pace only some beats
    const isPaced = i % 2 === 0; // Alternate: paced, intrinsic, paced, ...

    if (isPaced) {
      // Pacing spike before QRS
      points.push({ x: offset + 4, y: 4 }); // spike
      points.push({ x: offset + 4.1, y: 0 }); // return to baseline
    }

    for (const pt of baseComplex) {
      let scaledY = pt.y;

      if (pt.x >= 1 && pt.x <= 3) {
        scaledY *= aScale; // P wave
      } else if (pt.x >= 5 && pt.x <= 7) {
        scaledY *= vScale; // QRS
      } else if (pt.x >= 10 && pt.x <= 12) {
        scaledY *= vScale * 0.3; // T wave
      }

      points.push({
        x: offset + pt.x,
        y: scaledY,
      });
    }
  }

  return points;
};

export const generateSensitivtyPoints = ({
  rate,
  aOutput,
  vOutput,
  sensitivity,
}: ECGParams): Point[] => {
  const points: Point[] = [];
  const beatLength = 16;
  const numberOfBeats = 10;

  const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(val, max));

  // Gradual scoring: sensitivity of 5 = bad, 0 = perfect
  const sensitivityScore = clamp((2.5 - sensitivity) / 2.5, 0, 1); // 0–1
  const effectiveness = sensitivityScore;

  for (let i = 0; i < numberOfBeats; i++) {
    const offset = i * beatLength;

    // Simulated intrinsic QRS
    points.push({ x: offset + 6, y: -0.2 });
    points.push({ x: offset + 7, y: 1.2 });
    points.push({ x: offset + 8, y: -0.3 });

    // Gradual logic: more effective → less unnecessary pacing
    const shouldPace = Math.random() > effectiveness;

    if (shouldPace) {
      points.push({ x: offset + 9, y: 4 }); // pacing spike
    }

    // Flatline everywhere else
    for (let j = 0; j < beatLength; j++) {
      if (![6, 7, 8, 9].includes(j)) {
        points.push({ x: offset + j, y: 0 });
      }
    }
  }

  return points;
};

export const generateOversensingPoints = ({
  rate,
  aOutput,
  vOutput,
}: ECGParams): Point[] => {
  const points: Point[] = [];
  const beatLength = 16;
  const numberOfBeats = 10;
  const captureThreshold = 12; // needs >12 mA to trigger QRS

  for (let i = 0; i < numberOfBeats; i++) {
    const offset = i * beatLength;

    // Atrial pacing spike (optional)
    if (aOutput > 0) {
      points.push({ x: offset + 2, y: 4 });
    }

    // Ventricular pacing spike
    points.push({ x: offset + 5, y: 4 });

    if (vOutput > captureThreshold) {
      // Simulate captured QRS
      points.push({ x: offset + 6, y: -0.2 });
      points.push({ x: offset + 7, y: 1.3 });
      points.push({ x: offset + 8, y: -0.3 });
    }

    for (let j = 0; j < beatLength; j++) {
      if (![2, 5, 6, 7, 8].includes(j)) {
        points.push({ x: offset + j, y: 0 });
      }
    }
  }

  return points;
};

export const generateUndersensingPoints = ({
  aOutput,
  vOutput,
}: ECGParams): Point[] => {
  const points: Point[] = [];
  const totalLength = 160;

  const atrialInterval = 20; // P wave every 20 samples
  const ventricularInterval = 32; // QRS every 32 samples

  const pAmp = 0.3 * Math.min(1, aOutput / 5);
  const qrsAmp = 1.2 * Math.min(1, vOutput / 5);

  for (let i = 0; i < totalLength; i++) {
    let y = 0;

    // P wave: small, sharp bump
    if (i % atrialInterval === 0) {
      y = pAmp;
    }

    // QRS complex: tall and wide, 3-sample shape
    if (i % ventricularInterval === 0) {
      points.push({ x: i, y: -0.2 });
      points.push({ x: i + 1, y: qrsAmp });
      points.push({ x: i + 2, y: -0.3 });
      i += 2; // skip ahead to avoid overlap
      continue;
    }

    points.push({ x: i, y });
  }

  return points;
};

export const generateCaptureModulePoints = ({
  rate,
  aOutput,
  vOutput,
}: ECGParams): Point[] => {
  const points: Point[] = [];
  const totalLength = 160;

  let lastQRS = -30;
  const minInterval = 18;
  const maxInterval = 35;

  for (let i = 0; i < totalLength; i++) {
    let y = (Math.random() - 0.5) * 0.6; // chaotic baseline

    // Irregularly spaced QRS
    if (
      i - lastQRS >=
      Math.floor(Math.random() * (maxInterval - minInterval)) + minInterval
    ) {
      y += 1.2 * Math.min(1, vOutput / 5); // ventricular spike (irregular timing)
      lastQRS = i;
    }

    points.push({ x: i, y });
  }

  return points;
};

export const generateFailureToCapturePoints = ({
  rate,
  aOutput,
  vOutput,
  sensitivity,
}: ECGParams): Point[] => {
  const points: Point[] = [];
  const beatLength = 16;
  const numberOfBeats = 10;

  // Still show spikes at pacing interval, but no QRS
  for (let i = 0; i < numberOfBeats; i++) {
    const offset = i * beatLength;

    // Atrial spike (optional based on aOutput)
    if (aOutput > 0) {
      points.push({ x: offset + 2, y: 4 });
    }

    // Ventricular spike
    points.push({ x: offset + 5, y: 4 });

    // No capture: flatline despite spike
    for (let j = 0; j < beatLength; j++) {
      if (j !== 2 && j !== 5) {
        points.push({ x: offset + j, y: 0 });
      }
    }
  }

  return points;
};
{/**
export const generateSecondDegreeBlockPoints = ({
  rate,
  aOutput,
  vOutput,
}: ECGParams): Point[] => {
  const points: Point[] = [];
  const beatLength = 16;
  const numberOfBeats = 10;

  for (let i = 0; i < numberOfBeats; i++) {
    const offset = i * beatLength;

    // P wave every beat
    if (aOutput > 0) {
      points.push({ x: offset + 2, y: 0.3 * Math.min(1, aOutput / 5) });
    }

    // Drop every 3rd QRS (simulate conduction failure)
    const isDropped = i % 3 === 2;
    if (!isDropped && vOutput > 0) {
      points.push({ x: offset + 6, y: -0.2 });
      points.push({ x: offset + 7, y: 1.3 });
      points.push({ x: offset + 8, y: -0.3 });
    }

    // Flatline everywhere else
    for (let j = 0; j < beatLength; j++) {
      if (![2, 6, 7, 8].includes(j)) {
        points.push({ x: offset + j, y: 0 });
      }
    }
  }

  return points;
};

export const generateSlowJunctionalPoints = ({
  rate,
  aOutput,
  vOutput,
}: ECGParams): Point[] => {
  const points: Point[] = [];
  const beatLength = 24;
  const numberOfBeats = 8;

  for (let i = 0; i < numberOfBeats; i++) {
    const offset = i * beatLength;

    // Slow QRS only, no P wave
    if (vOutput > 0) {
      points.push({ x: offset + 6, y: -0.2 });
      points.push({ x: offset + 7, y: 1.1 });
      points.push({ x: offset + 8, y: -0.3 });
    }

    for (let j = 0; j < beatLength; j++) {
      if (![6, 7, 8].includes(j)) {
        points.push({ x: offset + j, y: 0 });
      }
    }
  }

  return points;
};

export const generateAsystolePoints = ({
  rate,
  vOutput,
}: ECGParams): Point[] => {
  const points: Point[] = [];
  const beatLength = 16;
  const numberOfBeats = 10;

  for (let i = 0; i < numberOfBeats; i++) {
    const offset = i * beatLength;

    // Optional pacing spike, no QRS
    if (vOutput > 0) {
      points.push({ x: offset + 5, y: 4 });
    }

    for (let j = 0; j < beatLength; j++) {
      if (j !== 5) {
        points.push({ x: offset + j, y: 0 });
      }
    }
  }

  return points;
};
*/}
