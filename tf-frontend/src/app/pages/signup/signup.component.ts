import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '../../components/button/button.component';
import { InputComponent } from '../../components/input/input.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { CustomPasswordValidator } from '../../helpers/validators/custom-password.validator';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from '../../services/loading.service';
import { AuthService } from '../../services/auth.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'tf-signup',
  standalone: true,
  imports: [InputComponent, ButtonComponent, RouterLink, ReactiveFormsModule, NgClass, NgxMaskDirective, NgxMaskPipe],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  form: FormGroup;
  usernamePattern = {
    'A': {
      pattern: new RegExp('[A-Za-zÀ-ÿ ]')
    }
  };

  constructor(private fb: FormBuilder, private router: Router, private toastr: ToastrService, private loading: LoadingService, private auth: AuthService) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6), CustomPasswordValidator]],
    });

  }

  signup() {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.toastr.error('É necessário preencher todos os campos.');

      return;
    }

    this.loading.on();

    this.auth.signup(this.form.getRawValue()).pipe(finalize(() => this.loading.off())).subscribe({
      next: (data) => {
        this.toastr.success('Cadastro realizado.');

        this.router.navigate(['login']);
      },
      error: (e) => {
        this.toastr.error(e.error.detail);

        console.error(e);

        this.form.reset();
        this.form.markAllAsTouched();
      },
    });
  }

  hasNumber(value: string): boolean {
    return /\d/.test(value || '');
  }

  hasSpecialChar(value: string): boolean {
    return /[^A-Za-z0-9]/.test(value || '');
  }
}
