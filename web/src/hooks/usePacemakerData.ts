// usePacemakerData.ts
// React hook to integrate with the pacemaker WebSocket client

import { useState, useEffect } from 'react';
import { PacemakerWebSocketClient, PacemakerState } from '../utils/PacemakerWebSocketClient';

interface PacemakerDataHook {
  state: PacemakerState | null;
  isConnected: boolean;
  errorMessage: string | null;
  sendControlUpdate: (updates: Partial<PacemakerState>) => void;
}

export const usePacemakerData = (
  serverUrl: string = 'ws://raspberrypi.local:5001',
  token: string = 'secondary_app_token_456'
): PacemakerDataHook => {
  const [client] = useState(() => new PacemakerWebSocketClient(serverUrl, token));
  const [state, setState] = useState<PacemakerState | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Connect to the server
    client.connect();

    // Set up event listeners
    const stateUnsubscribe = client.onStateChange((newState) => {
      setState(newState);
      setErrorMessage(null);
    });

    const connectionUnsubscribe = client.onConnectionStatus((connected) => {
      setIsConnected(connected);
      if (!connected) {
        setErrorMessage('Disconnected from pacemaker server. Attempting to reconnect...');
      } else {
        setErrorMessage(null);
      }
    });

    // Clean up on unmount
    return () => {
      stateUnsubscribe();
      connectionUnsubscribe();
      client.disconnect();
    };
  }, [client]);

  const sendControlUpdate = (updates: Partial<PacemakerState>) => {
    if (!isConnected) {
      setErrorMessage('Cannot send update - not connected to server');
      return;
    }

    try {
      client.sendControlUpdate(updates);
    } catch (error) {
      console.error('Error sending control update:', error);
      setErrorMessage(`Error sending update: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return {
    state,
    isConnected,
    errorMessage,
    sendControlUpdate
  };
};

// EXAMPLE USAGE IN A REACT COMPONENT:

/*
import React from 'react';
import { usePacemakerData } from './usePacemakerData';

const PacemakerMonitor: React.FC = () => {
  const { state, isConnected, errorMessage, sendControlUpdate } = usePacemakerData();

  if (errorMessage) {
    return <div className="error-message">{errorMessage}</div>;
  }

  if (!state) {
    return <div>Loading pacemaker data...</div>;
  }

  return (
    <div className="pacemaker-monitor">
      <div className="connection-status">
        Status: {isConnected ? 'Connected' : 'Disconnected'}
      </div>
      
      <div className="pacemaker-data">
        <h2>Pacemaker Status</h2>
        <div className="data-row">
          <span>Rate:</span> <strong>{state.rate} ppm</strong>
        </div>
        <div className="data-row">
          <span>A. Output:</span> <strong>{state.a_output.toFixed(1)} mA</strong>
        </div>
        <div className="data-row">
          <span>V. Output:</span> <strong>{state.v_output.toFixed(1)} mA</strong>
        </div>
        <div className="data-row">
          <span>Mode:</span> <strong>{['VOO', 'VVI', 'VVT', 'AOO', 'AAI', 'DOO', 'DDD', 'DDI'][state.mode]}</strong>
        </div>
        <div className="data-row">
          <span>A. Sensitivity:</span> <strong>{state.aSensitivity.toFixed(1)} mV</strong>
        </div>
        <div className="data-row">
          <span>V. Sensitivity:</span> <strong>{state.vSensitivity.toFixed(1)} mV</strong>
        </div>
        <div className="data-row">
          <span>Locked:</span> <strong>{state.isLocked ? 'Yes' : 'No'}</strong>
        </div>
        <div className="data-row">
          <span>Battery:</span> <strong>{state.batteryLevel}%</strong>
        </div>
        <div className="data-row">
          <span>Last Updated:</span> <strong>{new Date(state.lastUpdate * 1000).toLocaleTimeString()}</strong>
        </div>
      </div>
      
      // Only show control panel if you have admin permissions 
      {token === 'pacemaker_token_123' && (
        <div className="control-panel">
          <h2>Control Panel</h2>
          <button 
            onClick={() => sendControlUpdate({ isPaused: !state.isPaused })}
          >
            {state.isPaused ? 'Resume Pacing' : 'Pause Pacing'}
          </button>
          
          // Add more control buttons as needed 
        </div>
      )}
    </div>
  );
};

export default PacemakerMonitor;
*/