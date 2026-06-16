import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify-pending',
  imports: [RouterLink, CommonModule],
  templateUrl: './verify-pending.html',
  styleUrl: './verify-pending.css',
})
export class VerifyPendingPage {
  auth = inject(AuthService);
  private toast = inject(ToastService);
  loading = signal(false);

  async resend(): Promise<void> {
    this.loading.set(true);
    try {
      await firstValueFrom(this.auth.resendVerification());
      this.toast.success('Email de verificación reenviado correctamente.');
    } catch (err: any) {
      this.toast.error(err.error?.message || 'Error al reenviar el correo de verificación.');
    } finally {
      this.loading.set(false);
    }
  }
}
