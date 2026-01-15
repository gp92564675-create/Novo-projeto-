
export interface Trade {
  id: string;
  asset: string;
  direction: 'CALL' | 'PUT';
  entryTime: number; // Timestamp
  entryPrice: number;
  closePrice?: number;
  result: 'WIN' | 'LOSS' | 'DRAW' | 'PENDING';
  amount: number;
}
