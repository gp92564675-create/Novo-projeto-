
import { Injectable, signal } from '@angular/core';
import { Signal } from '../models/signal.model';

export type Page = 'DASHBOARD' | 'SIGNALS' | 'CHART' | 'HISTORY' | 'SETTINGS';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  currentPage = signal<Page>('DASHBOARD');
  isModalOpen = signal(false);
  modalContent = signal<{title: string, content: string}>({title: '', content: ''});
  
  // For trade confirmation
  tradeSignal = signal<Signal | null>(null);

  navigateTo(page: Page) {
    this.currentPage.set(page);
  }

  openModal(title: string, content: string) {
    this.modalContent.set({title, content});
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  openTradeConfirmation(signal: Signal) {
    this.tradeSignal.set(signal);
  }

  closeTradeConfirmation() {
    this.tradeSignal.set(null);
  }
}
