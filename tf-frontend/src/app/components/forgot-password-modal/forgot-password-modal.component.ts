import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'tf-forgot-password-modal',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './forgot-password-modal.component.html',
  styleUrl: './forgot-password-modal.component.scss'
})
export class ForgotPasswordComponent {
  constructor(private dialogRef: MatDialogRef<ForgotPasswordComponent>, private router: Router) { }

  redirectRedefinePassword() {
    this.dialogRef.close();

    this.router.navigate(['redefine-password']);
  }
}
