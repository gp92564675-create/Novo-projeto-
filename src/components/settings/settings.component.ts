
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrokerService } from '../../services/broker.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  brokerService = inject(BrokerService);
  authService = inject(AuthService);

  brokers = ['Quotex', 'Nexus', 'IQ Option', 'Olymp Trade'];
  selectedBroker = this.brokerService.selectedBroker;
  
  brokerUser = signal('');
  brokerPass = signal('');

  isConnecting = signal(false);
  isConnected = this.brokerService.isConnected;
  
  tradeAmount = this.brokerService.tradeAmount;
  stopLossPercentage = signal(10);
  
  accountType = this.brokerService.accountType;

  async connectToBroker() {
    this.isConnecting.set(true);
    await this.brokerService.connect(this.selectedBroker(), this.brokerUser(), this.brokerPass());
    this.isConnecting.set(false);
  }

  disconnectFromBroker() {
    this.brokerService.disconnect();
    this.brokerUser.set('');
    this.brokerPass.set('');
  }

  logout() {
    this.disconnectFromBroker();
    this.authService.logout();
  }
}
