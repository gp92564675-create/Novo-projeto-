
import { Component, ChangeDetectionStrategy, input, output, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Signal } from '../../models/signal.model';
import { BrokerService } from '../../services/broker.service';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-trade-confirmation-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trade-confirmation-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TradeConfirmationModalComponent {
  signal = input.required<Signal>();
  close = output<void>();

  brokerService = inject(BrokerService);
  uiService = inject(UiService);

  tradeAmount = signal(this.brokerService.tradeAmount());
  isExecuting = signal(false);

  balance = this.brokerService.balance;
  accountType = this.brokerService.accountType;

  newBalance = computed(() => this.balance() - this.tradeAmount());
  potentialPayout = computed(() => this.tradeAmount() * 1.85); // 85% payout

  async confirmTrade() {
    this.isExecuting.set(true);
    await this.brokerService.executeTrade(this.signal().asset, this.signal().direction, this.tradeAmount());
    this.isExecuting.set(false);
    this.close.emit();
    this.uiService.navigateTo('HISTORY');
  }

  cancel() {
    this.close.emit();
  }
}
