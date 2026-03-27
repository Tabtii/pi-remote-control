import { GatewayConfig, Message, GatewayStatus } from '../types';

type StatusCallback = (status: GatewayStatus) => void;
type MessageCallback = (message: Message) => void;

class OpenClawService {
  private ws: WebSocket | null = null;
  private config: GatewayConfig | null = null;
  private statusCallback: StatusCallback | null = null;
  private messageCallback: MessageCallback | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  connect(config: GatewayConfig) {
    this.config = config;
    this.createConnection();
  }

  private createConnection() {
    if (!this.config) return;

    const wsUrl = config.url.replace('http', 'ws') + '/ws';
    
    try {
      this.ws = new WebSocket(`ws://${this.config.url}/ws`, {
        headers: {
          'Authorization': `Bearer ${this.config.token}`,
        },
      });

      this.ws.onopen = () => {
        this.notifyStatus({
          connected: true,
          url: this.config!.url,
          lastPing: new Date(),
          error: null,
        });
      };

      this.ws.onclose = () => {
        this.notifyStatus({
          connected: false,
          url: this.config!.url,
          lastPing: null,
          error: 'Connection closed',
        });
        this.scheduleReconnect();
      };

      this.ws.onerror = (error) => {
        this.notifyStatus({
          connected: false,
          url: this.config!.url,
          lastPing: null,
          error: 'Connection failed',
        });
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'message' || data.method === 'chat.completion') {
            const message: Message = {
              id: data.id || Date.now().toString(),
              role: 'agent',
              content: data.content || data.message?.content || '',
              timestamp: new Date(),
            };
            this.messageCallback?.(message);
          }
        } catch (e) {
          // Ignore non-JSON messages
        }
      };
    } catch (error) {
      this.notifyStatus({
        connected: false,
        url: this.config.url,
        lastPing: null,
        error: 'Failed to create connection',
      });
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    this.reconnectTimeout = setTimeout(() => {
      this.createConnection();
    }, 5000);
  }

  private notifyStatus(status: GatewayStatus) {
    this.statusCallback?.(status);
  }

  onStatusChange(callback: StatusCallback) {
    this.statusCallback = callback;
  }

  onMessage(callback: MessageCallback) {
    this.messageCallback = callback;
  }

  sendMessage(content: string): Promise<Message> {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        reject(new Error('Not connected'));
        return;
      }

      const message: Message = {
        id: Date.now().toString(),
        role: 'user',
        content,
        timestamp: new Date(),
      };

      this.ws.send(JSON.stringify({
        type: 'chat.message',
        content,
      }));

      resolve(message);
    });
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    this.ws?.close();
    this.ws = null;
    this.config = null;
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

export const openClawService = new OpenClawService();
