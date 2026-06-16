import { Component, inject, signal } from '@angular/core';
import { DatePipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-profile',
  imports: [DatePipe, CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfilePage {
  auth = inject(AuthService);
  private toast = inject(ToastService);

  // Reenviar email
  resendLoading = signal(false);

  // Formulario Cambio Contraseña
  currentPassword = '';
  newPassword = '';
  confirmNewPassword = '';
  passwordLoading = signal(false);

  // Formulario Cambio Email
  newEmail = '';
  emailCurrentPassword = '';
  emailLoading = signal(false);

  async resendVerification(): Promise<void> {
    this.resendLoading.set(true);
    try {
      await firstValueFrom(this.auth.resendVerification());
      this.toast.success('Email de verificación reenviado.');
    } catch (err: any) {
      this.toast.error(err.error?.message || 'Error al reenviar el email de verificación.');
    } finally {
      this.resendLoading.set(false);
    }
  }

  async changePassword(): Promise<void> {
    if (!this.currentPassword || !this.newPassword || !this.confirmNewPassword) return;

    if (this.newPassword.length < 8) {
      this.toast.error('La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (this.newPassword !== this.confirmNewPassword) {
      this.toast.error('Las contraseñas nuevas no coinciden.');
      return;
    }

    this.passwordLoading.set(true);
    try {
      await firstValueFrom(this.auth.updatePassword(this.currentPassword, this.newPassword));
      this.toast.success('Contraseña cambiada exitosamente.');
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmNewPassword = '';
    } catch (err: any) {
      this.toast.error(err.error?.message || 'Error al cambiar la contraseña.');
    } finally {
      this.passwordLoading.set(false);
    }
  }

  async changeEmail(): Promise<void> {
    if (!this.newEmail || !this.emailCurrentPassword) return;

    this.emailLoading.set(true);
    try {
      await firstValueFrom(this.auth.updateEmail(this.newEmail, this.emailCurrentPassword));
      this.toast.success('Email actualizado. Se ha enviado un enlace de verificación a la nueva dirección.');
      this.newEmail = '';
      this.emailCurrentPassword = '';
    } catch (err: any) {
      this.toast.error(err.error?.message || 'Error al actualizar el email.');
    } finally {
      this.emailLoading.set(false);
    }
  }
}
