import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '../../components/button/button.component';
import { InputComponent } from '../../components/input/input.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { CustomPasswordValidator } from '../../helpers/validators/custom-password.validator';

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

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6), CustomPasswordValidator]],
    });

  }

  signup() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.router.navigate(['login']);

    console.log(this.form.getRawValue());
  }

  hasNumber(value: string): boolean {
    return /\d/.test(value || '');
  }

  hasSpecialChar(value: string): boolean {
    return /[^A-Za-z0-9]/.test(value || '');
  }
}
