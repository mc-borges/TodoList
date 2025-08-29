import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-change-password',
  imports: [CommonModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  currentPassword = '';
  newPassword = '';
  confirm = '';
  saving = false;
  okMsg = '';
  errMsg = '';

  // ajuste se tua API tiver outro host/porta
  private readonly API_BASE = 'http://localhost:8001';

  constructor(private router: Router) {}

  async submit(ev: Event) {
    ev.preventDefault();
    this.okMsg = '';
    this.errMsg = '';

    if (!this.newPassword || this.newPassword !== this.confirm) {
      this.errMsg = 'As senhas não coincidem.';
      return;
    }

    this.saving = true;
    try {
      const token = localStorage.getItem('access_token') || '';
      const res = await fetch(`${this.API_BASE}/auth/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: this.currentPassword,
          new_password: this.newPassword,
        }),
      });

      if (!res.ok) throw new Error(await res.text());
      this.okMsg = 'Senha alterada com sucesso.';
      this.currentPassword = this.newPassword = this.confirm = '';
    } catch (e: any) {
      this.errMsg = 'Erro ao alterar senha. ' + (e?.message || '');
    } finally {
      this.saving = false;
    }
  }

  back() {
    this.router.navigate(['/account']);
  }
}
