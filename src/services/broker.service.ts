
import { Injectable, signal, computed } from '@angular/core';
import { Trade } from '../models/trade.model';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BrokerService {
  // Connection State
  isConnected = signal<boolean>(false);
  selectedBroker = signal<string>('Quotex');

  // Account State
  accountType = signal<'DEMO' | 'REAL'>('DEMO');
  
  // Risk Management
  tradeAmount = signal<number>(25);

  // Balances
  private demoBalance = signal<number>(10000);
  private realBalance = signal<number>(1250.75);
  balance = computed(() => this.accountType() === 'DEMO' ? this.demoBalance() : this.realBalance());

  // Trade Histories
  private demoHistory = new BehaviorSubject<Trade[]>([
    { id: 'd1', asset: 'EUR/USD', direction: 'CALL', entryTime: Date.now() - 4600000, entryPrice: 1.0750, closePrice: 1.0755, result: 'WIN', amount: 50 },
    { id: 'd2', asset: 'USD/JPY', direction: 'PUT', entryTime: Date.now() - 8200000, entryPrice: 157.20, closePrice: 157.10, result: 'WIN', amount: 100 },
  ]);
  private realHistory = new BehaviorSubject<Trade[]>([
    { id: 'r1', asset: 'GBP/USD', direction: 'PUT', entryTime: Date.now() - 3600000, entryPrice: 1.2730, closePrice: 1.2738, result: 'LOSS', amount: 20 },
    { id: 'r2', asset: 'AUD/CAD', direction: 'CALL', entryTime: Date.now() - 10800000, entryPrice: 0.9015, closePrice: 0.9022, result: 'WIN', amount: 35 },
  ]);
  tradeHistory$ = new BehaviorSubject<Trade[]>(this.demoHistory.value);
  
  winRate$ = this.tradeHistory$.pipe(
    map(trades => {
        const wins = trades.filter(t => t.result === 'WIN').length;
        const losses = trades.filter(t => t.result === 'LOSS').length;
        const total = wins + losses;
        return total > 0 ? Math.round((wins / total) * 100) : 0;
    })
  );


  connect(broker: string, user: string, pass: string): Promise<boolean> {
    console.log(`Connecting to ${broker} with user ${user}...`);
    // Mock connection logic
    if (!user || !pass) return Promise.resolve(false);
    
    return new Promise(resolve => setTimeout(() => {
      this.isConnected.set(true);
      this.selectedBroker.set(broker);
      this.syncAccountData();
      resolve(true);
    }, 1500));
  }

  disconnect() {
    this.isConnected.set(false);
  }
  
  toggleAccountType() {
      this.accountType.update(current => (current === 'DEMO' ? 'REAL' : 'DEMO'));
      this.syncAccountData();
  }

  private syncAccountData() {
    if (this.accountType() === 'DEMO') {
      this.tradeHistory$.next(this.demoHistory.value);
    } else {
      this.tradeHistory$.next(this.realHistory.value);
    }
  }

  executeTrade(asset: string, direction: 'CALL' | 'PUT', amount: number): Promise<Trade> {
    if (!this.isConnected()) {
        return Promise.reject("Not connected to a broker.");
    }
    
    const newTrade: Trade = {
        id: `t${Date.now()}`,
        asset,
        direction,
        entryTime: Date.now(),
        entryPrice: 1.0850 + (Math.random() - 0.5) * 0.001,
        result: 'PENDING',
        amount,
    };
    
    // Update balance and history for the correct account
    const currentBalance = this.accountType() === 'DEMO' ? this.demoBalance : this.realBalance;
    const currentHistory = this.accountType() === 'DEMO' ? this.demoHistory : this.realHistory;

    currentBalance.update(b => b - amount);
    const newHistory = [newTrade, ...currentHistory.value];
    currentHistory.next(newHistory);
    this.tradeHistory$.next(newHistory);


    // Simulate trade result after a minute
    setTimeout(() => {
        const result: 'WIN' | 'LOSS' = Math.random() > 0.4 ? 'WIN' : 'LOSS';
        const closePrice = newTrade.entryPrice + (direction === 'CALL' ? (result === 'WIN' ? 0.0005 : -0.0005) : (result === 'WIN' ? -0.0005 : 0.0005));
        const updatedTrade = { ...newTrade, result, closePrice };
        
        if (result === 'WIN') {
            currentBalance.update(b => b + amount * 1.85); // 85% payout
        }

        const latestHistory = [...currentHistory.value];
        const index = latestHistory.findIndex(t => t.id === updatedTrade.id);
        if (index !== -1) {
            latestHistory[index] = updatedTrade;
            currentHistory.next(latestHistory);
            this.tradeHistory$.next(latestHistory);
        }
    }, 15000); // 15 seconds for simulation

    return Promise.resolve(newTrade);
  }
}
