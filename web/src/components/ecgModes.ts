export type Point = { x: number; y: number };

type ECGParams = {
  rate: number;         // pacing rate in bpm
  aOutput: number;      // atrial output strength (mA)
  vOutput: number;      // ventricular output strength (mA)
  sensitivity: number;  // sensing threshold (mV)
};

export const generateNormalPacingPoints = ({
  rate,
  aOutput,
  vOutput,
  sensitivity
}: ECGParams): Point[] => {
  const points: Point[] = [];
  const baseComplexLength = 16;
  const numberOfComplexes = 10;

  const baseComplex: Point[] = [
    { x: 0, y: 0 },
    { x: 1, y: 0.1 },  // P wave start
    { x: 2, y: 0.25 },
    { x: 3, y: 0.1 },
    { x: 4, y: 0 },    // PR segment
    { x: 5, y: -0.2 }, // Q wave
    { x: 6, y: 1.5 },  // R wave
    { x: 7, y: -0.4 }, // S wave
    { x: 8, y: -0.1 }, // ST segment
    { x: 9, y: 0 },
    { x: 10, y: 0.1 }, // T wave start
    { x: 11, y: 0.4 },
    { x: 12, y: 0.1 },
    { x: 13, y: 0 },
    { x: 14, y: 0 },
    { x: 15, y: 0 },
  ];

  // Output scaling
  const scaleOutput = (output: number, max = 5) =>
    Math.min(max, Math.log(output + 1) / Math.log(6));

  const aScale = scaleOutput(aOutput, 1);
  const vScale = scaleOutput(vOutput, 5);

  for (let i = 0; i < numberOfComplexes; i++) {
    const offset = i * baseComplexLength;

    // Add pacing spike before QRS
    points.push({ x: offset + 4, y: 4 });

    baseComplex.forEach((pt) => {
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
    });
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

export const generateFailureToSensePoints = ({
  rate,
  aOutput,
  vOutput,
  sensitivity,
}: ECGParams): Point[] => {
  const points: Point[] = [];
  const beatLength = 16;
  const numberOfBeats = 10;

  const intrinsicThreshold = 2; // mV needed to detect intrinsic beat

  for (let i = 0; i < numberOfBeats; i++) {
    const offset = i * beatLength;

    // Simulated intrinsic QRS
    points.push({ x: offset + 6, y: -0.2 });
    points.push({ x: offset + 7, y: 1.2 });
    points.push({ x: offset + 8, y: -0.3 });

    const failedToSense = sensitivity > intrinsicThreshold;

    // Pacemaker fails to sense the intrinsic beat, so it fires too
    if (failedToSense) {
      points.push({ x: offset + 9, y: 4 }); // pacing spike AFTER QRS
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

export const generateBariatricCapturePoints = ({
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

export const generateThirdDegreeBlockPoints = ({
  rate,
  aOutput,
  vOutput,
}: ECGParams): Point[] => {
  const points: Point[] = [];
  const totalLength = 160;

  const atrialInterval = 20;       // every 20 samples
  const ventricularInterval = 32;  // every 32 samples

  const aSpikeThreshold = 3;
  const vSpikeThreshold = 3;

  for (let i = 0; i < totalLength; i++) {
    let y = 0;

    // Atrial P wave (small positive bump)
    if (i % atrialInterval === 0) {
      y = 0.3 * Math.min(1, aOutput / aSpikeThreshold);
    }

    // Ventricular QRS complex
    if (i % ventricularInterval === 0) {
      y = 1.2 * Math.min(1, vOutput / vSpikeThreshold);
    }

    points.push({ x: i, y });
  }

  return points;
};

export const generateAfibPoints = ({
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
    if (i - lastQRS >= Math.floor(Math.random() * (maxInterval - minInterval)) + minInterval) {
      y += 1.2 * Math.min(1, vOutput / 5); // ventricular spike (irregular timing)
      lastQRS = i;
    }

    points.push({ x: i, y });
  }

  return points;
};

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

