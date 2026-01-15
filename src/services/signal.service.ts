
import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Signal } from '../models/signal.model';

@Injectable({
  providedIn: 'root',
})
export class SignalService {
  private signalsSubject = new BehaviorSubject<Signal[]>([]);
  signals$: Observable<Signal[]> = this.signalsSubject.asObservable();

  constructor() {
    this.startSignalGeneration();
    this.startSignalExpiration();
  }

  private createRandomSignal(): Signal {
    const assets = ['EUR/USD', 'GBP/JPY', 'AUD/CAD', 'USD/CHF', 'NZD/USD'];
    const strategies = [
      { name: 'Confluence of Trend', confirmations: ['Price > EMA 200', 'EMA 20 > 50', 'RSI Neutral', 'Pullback on Support'] },
      { name: 'Reversal in Extreme Zone', confirmations: ['RSI Oversold', 'Touched Lower Bollinger Band', 'Strong Support Zone'] },
      { name: 'Volatility Spike', confirmations: ['NY Session Open', 'High Volume', 'Breakout Pattern'] }
    ];
    
    const randomAsset = assets[Math.floor(Math.random() * assets.length)];
    const randomDirection = Math.random() > 0.5 ? 'CALL' : 'PUT';
    const randomStrategy = strategies[Math.floor(Math.random() * strategies.length)];

    return {
      id: `sig_${Date.now()}_${Math.random()}`,
      asset: randomAsset,
      direction: randomDirection,
      timeframe: Math.random() > 0.5 ? 'M1' : 'M5',
      expiration: Date.now() + 60000, // Expires in 60 seconds
      probability: Math.floor(88 + Math.random() * 12),
      strategy: randomStrategy.name,
      confirmations: randomStrategy.confirmations,
      status: 'active'
    };
  }

  private startSignalGeneration() {
    timer(2000, 15000).subscribe(() => { // New signal every 15 seconds
      if (this.signalsSubject.value.length < 5) {
        const newSignal = this.createRandomSignal();
        this.signalsSubject.next([newSignal, ...this.signalsSubject.value]);
        this.playNotificationSound();
      }
    });
  }
  
  private startSignalExpiration() {
      timer(0, 1000).subscribe(() => {
        const now = Date.now();
        const currentSignals = this.signalsSubject.value;
        const activeSignals = currentSignals.filter(s => s.expiration > now);
        if (activeSignals.length < currentSignals.length) {
          this.signalsSubject.next(activeSignals);
        }
      });
  }

  private playNotificationSound() {
    // A short, valid base64 WAV file to prevent syntax errors from truncation.
    const audio = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=');
    audio.play().catch(e => console.error("Audio play failed:", e));
  }
}
