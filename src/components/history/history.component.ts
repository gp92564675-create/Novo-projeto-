
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { BrokerService } from '../../services/broker.service';
import { Trade } from '../../models/trade.model';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryComponent {
  brokerService = inject(BrokerService);
  tradeHistory = toSignal(this.brokerService.tradeHistory$, { initialValue: [] as Trade[] });
}
