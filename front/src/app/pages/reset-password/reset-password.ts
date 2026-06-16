import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPasswordPage implements OnInit {
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);

  token = '';
  password = '';
  confirmPassword = '';
  loading = signal(false);
  errorMsg = signal('');

  ngOnInit(): void {
    const t = this.route.snapshot.queryParamMap.get('token');
    if (!t) {
      this.errorMsg.set('Token de restablecimiento ausente de la URL.');
      this.toast.error('Token inválido.');
    } else {
      this.token = t;
    }
  }

  async submit(): Promise<void> {
    if (!this.token) {
      this.errorMsg.set('No se puede restablecer la contraseña sin un token válido.');
      return;
    }

    if (this.password.length < 8) {
      this.errorMsg.set('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMsg.set('Las contraseñas no coinciden.');
      return;
    }

    this.loading.set(true);
    this.errorMsg.set('');

    try {
      await firstValueFrom(this.auth.resetPassword(this.token, this.password));
      this.toast.success('Tu contraseña ha sido restablecida correctamente. Ya puedes iniciar sesión.');
      this.router.navigate(['/login']);
    } catch (err: any) {
      this.errorMsg.set(err.error?.message || 'Error al restablecer la contraseña. El token podría haber expirado.');
      this.toast.error('Error al restablecer contraseña.');
    } finally {
      this.loading.set(false);
    }
  }
}
