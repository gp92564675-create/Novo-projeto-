
import { Component, ChangeDetectionStrategy, inject, signal, OnDestroy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subscription, interval } from 'rxjs';

import { SignalService } from '../../services/signal.service';
import { GeminiService } from '../../services/gemini.service';
import { BrokerService } from '../../services/broker.service';
import { Signal } from '../../models/signal.model';
import { UiService } from '../../services/ui.service';
import { TradeConfirmationModalComponent } from '../trade-confirmation-modal/trade-confirmation-modal.component';


@Component({
  selector: 'app-signals',
  standalone: true,
  imports: [CommonModule, TradeConfirmationModalComponent],
  templateUrl: './signals.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalsComponent implements OnDestroy {
  signalService = inject(SignalService);
  geminiService = inject(GeminiService);
  brokerService = inject(BrokerService);
  uiService = inject(UiService);

  signals = toSignal(this.signalService.signals$, { initialValue: [] as Signal[] });
  countdownTimers = signal<{[key: string]: number}>({});

  private timerSubscription: Subscription;

  constructor() {
    this.timerSubscription = interval(1000).subscribe(() => this.updateTimers());
  }

  updateTimers() {
    const timers: {[key: string]: number} = {};
    const now = Date.now();
    for (const sig of this.signals()) {
      timers[sig.id] = Math.max(0, Math.floor((sig.expiration - now) / 1000));
    }
    this.countdownTimers.set(timers);
  }

  async showExplanation(signal: Signal, event: MouseEvent) {
    event.stopPropagation();
    this.uiService.openModal('AI Signal Analysis', 'Generating analysis...');
    const explanation = await this.geminiService.getSignalExplanation(signal);
    this.uiService.openModal('AI Signal Analysis', explanation);
  }

  openTradeModal(signal: Signal) {
    if (this.brokerService.isConnected()) {
      this.uiService.openTradeConfirmation(signal);
    } else {
      this.uiService.openModal('Broker Not Connected', 'Please connect to your broker in the Settings page before placing a trade.');
    }
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}
