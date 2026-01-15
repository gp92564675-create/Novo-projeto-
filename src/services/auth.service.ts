
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = signal<boolean>(false);

  login(user: string, pass: string): boolean {
    // Mock login logic
    if (user && pass) {
      this.isLoggedIn.set(true);
      return true;
    }
    return false;
  }

  logout() {
    this.isLoggedIn.set(false);
  }
}
