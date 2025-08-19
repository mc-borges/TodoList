import { Component } from '@angular/core';
import { InputComponent } from '../../components/input/input.component';
import { ButtonComponent } from '../../components/button/button.component';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { CustomPasswordValidator } from '../../helpers/validators/custom-password.validator';
import { MatDialog } from '@angular/material/dialog';
import { ForgotPasswordComponent } from '../../components/forgot-password-modal/forgot-password-modal.component';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from '../../services/loading.service';
import { AuthService } from '../../services/auth.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'tf-login',
  standalone: true,
  imports: [InputComponent, ButtonComponent, RouterLink, ReactiveFormsModule, NgClass, NgxMaskDirective, NgxMaskPipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private modal:MatDialog, private toastr: ToastrService, private loading: LoadingService, private auth: AuthService) {
    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6), CustomPasswordValidator]],
    });
  }

  login() {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.toastr.error('É necessário preencher todos os campos.');

      return;
    }

    this.loading.on();

    this.auth.login(this.form.getRawValue()).pipe(finalize(() => this.loading.off())).subscribe({
      next: (data) => {
        this.toastr.success('Login realizado.');

        this.router.navigate(['home']);
      },
      error: (e) => {
        this.toastr.error(e.error.detail);

        console.error(e);

        this.form.reset();
        this.form.markAllAsTouched();
      },
    });
  }

  openForgotPasswordModal() {
    this.modal.open(ForgotPasswordComponent, {
      width: '695px',
    });
  }
}
