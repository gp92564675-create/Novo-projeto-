
import { Component, ChangeDetectionStrategy, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  loginSuccess = output<void>();
  authService = new AuthService();

  username = signal('');
  password = signal('');
  error = signal('');
  isLoading = signal(false);

  onLogin() {
    this.isLoading.set(true);
    this.error.set('');
    
    // Simulate API call
    setTimeout(() => {
      const success = this.authService.login(this.username(), this.password());
      if (success) {
        this.loginSuccess.emit();
      } else {
        this.error.set('Invalid credentials. Please try again.');
      }
      this.isLoading.set(false);
    }, 1000);
  }
}
