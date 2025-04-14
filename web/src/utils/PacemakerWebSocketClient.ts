// PacemakerWebSocketClient.ts
// This code should be added to your secondary application

export interface PacemakerState {
    rate: number;
    a_output: number;
    v_output: number;
    aSensitivity: number;
    vSensitivity: number;
    mode: number;
    isLocked: boolean;
    isPaused: boolean;
    pauseTimeLeft: number;
    batteryLevel: number;
    lastUpdate: number;
  }
  
  type StateChangeCallback = (state: PacemakerState) => void;
  type ConnectionStatusCallback = (connected: boolean) => void;
  
  export class PacemakerWebSocketClient {
    private ws: WebSocket | null = null;
    private url: string;
    private token: string;
    private onStateChangeCallbacks: StateChangeCallback[] = [];
    private onConnectionStatusCallbacks: ConnectionStatusCallback[] = [];
    private reconnectTimeout: number = 1000; // Start with 1s, will increase on failures
    private reconnectTimer: number | null = null;
    private currentState: PacemakerState | null = null;
  
    constructor(url: string, token: string) {
      this.url = url;
      this.token = token;
    }
  
    /**
     * Connect to the pacemaker WebSocket server
     */
    public connect(): void {
      if (this.ws) {
        this.ws.close();
      }
  
      this.ws = new WebSocket(this.url);
  
      this.ws.onopen = () => {
        console.log('Connected to pacemaker server');
        // Send authentication token
        if (this.ws) {
          this.ws.send(JSON.stringify({ token: this.token }));
        }
        this.notifyConnectionStatus(true);
        this.resetReconnectTimeout();
      };
  
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Check if it's an error message
          if (data.type === 'error') {
            console.error('Pacemaker server error:', data.message);
            return;
          }
          
          // Otherwise, it's a state update
          this.currentState = data as PacemakerState;
          this.notifyStateChange(this.currentState);
        } catch (e) {
          console.error('Error parsing message:', e);
        }
      };
  
      this.ws.onclose = () => {
        console.log('Disconnected from pacemaker server');
        this.notifyConnectionStatus(false);
        this.scheduleReconnect();
      };
  
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.notifyConnectionStatus(false);
      };
    }
  
    /**
     * Send control updates to the server (admin role required)
     */
    public sendControlUpdate(updates: Partial<PacemakerState>): void {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        console.error('WebSocket not connected');
        return;
      }
  
      this.ws.send(JSON.stringify({
        type: 'control_update',
        updates
      }));
    }
  
    /**
     * Register a callback to be called when the state changes
     */
    public onStateChange(callback: StateChangeCallback): () => void {
      this.onStateChangeCallbacks.push(callback);
      
      // If we already have state data, send it immediately
      if (this.currentState) {
        callback(this.currentState);
      }
      
      // Return a function to unregister the callback
      return () => {
        const index = this.onStateChangeCallbacks.indexOf(callback);
        if (index !== -1) {
          this.onStateChangeCallbacks.splice(index, 1);
        }
      };
    }
  
    /**
     * Register a callback to be called when connection status changes
     */
    public onConnectionStatus(callback: ConnectionStatusCallback): () => void {
      this.onConnectionStatusCallbacks.push(callback);
      
      // Return a function to unregister the callback
      return () => {
        const index = this.onConnectionStatusCallbacks.indexOf(callback);
        if (index !== -1) {
          this.onConnectionStatusCallbacks.splice(index, 1);
        }
      };
    }
  
    /**
     * Disconnect from the server
     */
    public disconnect(): void {
      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }
      
      if (this.reconnectTimer !== null) {
        window.clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }
    }
  
    /**
     * Get the current state
     */
    public getState(): PacemakerState | null {
      return this.currentState;
    }
  
    /**
     * Check if connected to the server
     */
    public isConnected(): boolean {
      return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
    }
  
    // Private helper methods
    private notifyStateChange(state: PacemakerState): void {
      this.onStateChangeCallbacks.forEach(callback => {
        try {
          callback(state);
        } catch (e) {
          console.error('Error in state change callback:', e);
        }
      });
    }
  
    private notifyConnectionStatus(connected: boolean): void {
      this.onConnectionStatusCallbacks.forEach(callback => {
        try {
          callback(connected);
        } catch (e) {
          console.error('Error in connection status callback:', e);
        }
      });
    }
  
    private scheduleReconnect(): void {
      if (this.reconnectTimer !== null) {
        window.clearTimeout(this.reconnectTimer);
      }
  
      this.reconnectTimer = window.setTimeout(() => {
        console.log(`Attempting to reconnect in ${this.reconnectTimeout / 1000}s...`);
        this.connect();
        // Increase reconnect timeout for next attempt (max 30s)
        this.reconnectTimeout = Math.min(30000, this.reconnectTimeout * 1.5);
      }, this.reconnectTimeout);
    }
  
    private resetReconnectTimeout(): void {
      this.reconnectTimeout = 1000;
    }
  }
  
  // EXAMPLE USAGE:
  
  // Initialize client (in your secondary app)
  // const pacemakerClient = new PacemakerWebSocketClient('ws://raspberrypi.local:5001', 'secondary_app_token_456');
  
  // Connect to server
  // pacemakerClient.connect();
  
  // Listen for state changes
  // pacemakerClient.onStateChange((state) => {
  //   console.log('Pacemaker state updated:', state);
  //   // Update your UI with the new state
  //   updateUIWithPacemakerData(state);
  // });
  
  // Listen for connection status changes
  // pacemakerClient.onConnectionStatus((connected) => {
  //   console.log('Connection status:', connected ? 'Connected' : 'Disconnected');
  //   // Update connection status in UI
  //   updateConnectionStatusUI(connected);
  // });
  
  // Clean up on component unmount
  // useEffect(() => {
  //   return () => {
  //     pacemakerClient.disconnect();
  //   };
  // }, []);