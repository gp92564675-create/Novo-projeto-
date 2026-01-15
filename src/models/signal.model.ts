
export interface Signal {
  id: string;
  asset: string; // e.g., 'EUR/USD'
  direction: 'CALL' | 'PUT';
  timeframe: 'M1' | 'M5';
  expiration: number; // Timestamp
  probability: number; // e.g., 95
  strategy: string; // e.g., 'Confluence of Trend'
  confirmations: string[];
  status: 'active' | 'expired';
}
