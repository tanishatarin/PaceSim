// utils/pacemakerClientInstance.ts
import { PacemakerWebSocketClient } from './PacemakerWebSocketClient';

const sharedClient = new PacemakerWebSocketClient(
  'ws://raspberrypi.local:5001', // ✅ Your backend websocket server
  'secondary_app_token_456'      // ✅ Your auth token
);

export default sharedClient;
