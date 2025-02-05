type PriceUpdate = {
  productId: number;
  storeId: number;
  price: number;
};

type WebSocketMessage = {
  type: 'PRICE_UPDATE';
  data: PriceUpdate;
};

class WebSocketService {
  private socket: WebSocket | null = null;
  private messageHandlers = new Set<(message: WebSocketMessage) => void>();

  connect() {
    if (this.socket?.readyState === WebSocket.OPEN) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    this.socket = new WebSocket(wsUrl);

    this.socket.addEventListener('message', (event) => {
      try {
        const message = JSON.parse(event.data) as WebSocketMessage;
        this.messageHandlers.forEach(handler => handler(message));
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    });

    this.socket.addEventListener('close', () => {
      // Attempt to reconnect after 5 seconds
      setTimeout(() => this.connect(), 5000);
    });
  }

  onMessage(handler: (message: WebSocketMessage) => void) {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  disconnect() {
    this.socket?.close();
    this.socket = null;
    this.messageHandlers.clear();
  }
}

export const webSocketService = new WebSocketService();
