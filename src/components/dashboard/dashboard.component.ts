
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

import { BrokerService } from '../../services/broker.service';
import { UiService } from '../../services/ui.service';
import { Trade } from '../../models/trade.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  brokerService = inject(BrokerService);
  uiService = inject(UiService);

  balance = this.brokerService.balance;
  accountType = this.brokerService.accountType;
  winRate = toSignal(this.brokerService.winRate$, { initialValue: 0 });
  recentTrades = toSignal(this.brokerService.tradeHistory$, { initialValue: [] as Trade[] });
  
  getWinRateCircumference() {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    return circumference;
  }
  
  getWinRateOffset() {
    const rate = this.winRate() || 0;
    return this.getWinRateCircumference() * (1 - rate / 100);
  }
}
