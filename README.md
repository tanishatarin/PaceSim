## Run locally

```bash
cd web
pnpm install
pnpm dev
```

Open the browser and navigate to <http://localhost:5173/>. 

# PaceSim with Pacemaker Control Panel Integration

## Run locally

```bash
cd web
pnpm install
pnpm dev
```

Open the browser and navigate to <http://localhost:5173/>. 

---

## Pacemaker Data Integration

This application integrates with the Pacemaker Control Panel to receive real-time data about pacemaker status and controls.

### Installation

1. Install dependencies + Start development server:
   ```bash
   pnpm install
   pnpm dev
   ```

### Using the Pacemaker Integration

To integrate pacemaker data in your components (using react hook):

```tsx
import { usePacemakerData } from '../hooks/usePacemakerData';

const YourComponent = () => {
  const { state, isConnected, errorMessage } = usePacemakerData(
    'ws://raspberrypi.local:5001',  // Server address (change if needed)
    'secondary_app_token_456'       // Authentication token
  );
  
  // Use the pacemaker data in your component
  return (
    <div>
      {state && (
        <div>
          <p>Rate: {state.rate} ppm</p>
          {/* More data here */}
        </div>
      )}
    </div>
  );
};
```

## Available Pacemaker Data

The following real-time data is available from the pacemaker:

| Property | Type | Description |
|----------|------|-------------|
| `rate` | number | Pacing rate in ppm |
| `a_output` | number | Atrial output in mA |
| `v_output` | number | Ventricular output in mA |
| `aSensitivity` | number | Atrial sensitivity in mV |
| `vSensitivity` | number | Ventricular sensitivity in mV |
| `mode` | number | Current mode index (0=VOO, 1=VVI, etc.) |
| `isLocked` | boolean | Whether controls are locked |
| `isPaused` | boolean | Whether pacing is paused |
| `pauseTimeLeft` | number | Seconds left in pause state |
| `batteryLevel` | number | Battery percentage (0-100) |
| `lastUpdate` | number | Timestamp of last update (Unix time) |

## Pacing Modes Reference

| Mode Index | Mode Name | Description |
|------------|-----------|-------------|
| 0 | VOO | Ventricular pacing only, no sensing |
| 1 | VVI | Ventricular pacing with inhibition |
| 2 | VVT | Ventricular pacing with triggering |
| 3 | AOO | Atrial pacing only, no sensing |
| 4 | AAI | Atrial pacing with inhibition |
| 5 | DOO | Dual chamber pacing, no sensing (emergency mode) |
| 6 | DDD | Dual chamber pacing and sensing |
| 7 | DDI | Dual chamber pacing with inhibition |

* VVI has V sensitivity control
* DDD has A and V sensitivity control

## Troubleshooting

- If connection fails, ensure the Raspberry Pi is accessible at `raspberrypi.local`
- You may need to use the IP address directly instead of the hostname
- Check that port 5001 is open and accessible on your network