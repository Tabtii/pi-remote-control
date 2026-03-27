export interface GatewayConfig {
  url: string;
  token: string;
}

export interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
}

export interface GatewayStatus {
  connected: boolean;
  url: string;
  lastPing: Date | null;
  error: string | null;
}
