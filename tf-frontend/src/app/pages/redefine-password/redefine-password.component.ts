import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomPasswordValidator } from '../../helpers/validators/custom-password.validator';
import { NgClass } from '@angular/common';
import { ButtonComponent } from '../../components/button/button.component';
import { InputComponent } from '../../components/input/input.component';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-redefine-password',
  standalone: true,
  imports: [InputComponent, ButtonComponent, ReactiveFormsModule, NgClass],
  templateUrl: './redefine-password.component.html',
  styleUrl: './redefine-password.component.scss'
})
export class RedefinePasswordComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private toastr: ToastrService, private loading: LoadingService) {
    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6), CustomPasswordValidator]],
      passwordConfirm: ['', [Validators.required, Validators.minLength(6), CustomPasswordValidator]],
    });

  }

  redefinePassword() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.toastr.error('É necessário preencher todos os campos.');

      return;
    }

    if (this.form.get('password')?.value !== this.form.get('passwordConfirm')?.value) {
      this.toastr.error('As senhas devem ser iguais. Verifique os campos e tente novamente.');

      return;
    }

    this.router.navigate(['login']);

    console.log(this.form.getRawValue());

    this.toastr.success('Senha redefinida com sucesso.');
  }

  hasNumber(value: string): boolean {
    return /\d/.test(value || '');
  }

  hasSpecialChar(value: string): boolean {
    return /[^A-Za-z0-9]/.test(value || '');
  }
}
