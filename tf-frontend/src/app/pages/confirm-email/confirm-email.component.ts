import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgOtpInputComponent } from 'ng-otp-input';
import { ButtonComponent } from '../../components/button/button.component';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-confirm-email',
  standalone: true,
  imports: [NgOtpInputComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './confirm-email.component.html',
  styleUrl: './confirm-email.component.scss'
})
export class ConfirmEmailComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private toastr: ToastrService, private loading: LoadingService) {
    this.form = this.fb.group({
      confirmationCode: [null, [Validators.required, Validators.minLength(6)]],
    });
  }

  confirmEmail() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.toastr.error('É necessário preencher o código de confirmação.');

      return;
    }

    this.router.navigate(['home']);

    console.log(this.form.getRawValue());

    this.toastr.success('E-mail confirmado com sucesso. Bem-vindo(a) ao Tá Feito!');
  }

  resendCode() {
    this.toastr.info('Código de confirmação reenviado. Verifique seu e-mail.');
  }
}
