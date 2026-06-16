import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify-email',
  imports: [RouterLink, CommonModule],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.css',
})
export class VerifyEmailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);
  private toast = inject(ToastService);

  status = signal<'verifying' | 'success' | 'error'>('verifying');
  errorMessage = signal('');

  async ngOnInit(): Promise<void> {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.status.set('error');
      this.errorMessage.set('Token de verificación ausente.');
      return;
    }

    try {
      await firstValueFrom(this.auth.verifyEmail(token));
      this.status.set('success');
      this.toast.success('¡Email verificado correctamente! Ya puedes utilizar tu cuenta.');
    } catch (err: any) {
      this.status.set('error');
      this.errorMessage.set(err.error?.message || 'Token inválido o expirado.');
      this.toast.error(this.errorMessage());
    }
  }
}
