import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPasswordPage {
  private auth = inject(AuthService);
  private toast = inject(ToastService);

  email = '';
  loading = signal(false);
  sent = signal(false);

  async submit(): Promise<void> {
    if (!this.email.trim()) return;
    this.loading.set(true);

    try {
      await firstValueFrom(this.auth.forgotPassword(this.email));
      this.sent.set(true);
      this.toast.success('Si el email existe, recibirás un link de recuperación.');
    } catch (err: any) {
      this.toast.error(err.error?.message || 'Error al procesar la solicitud.');
    } finally {
      this.loading.set(false);
    }
  }
}
