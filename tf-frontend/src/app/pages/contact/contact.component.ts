import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from '../../services/loading.service';
import { InputComponent } from "../../components/input/input.component";
import { ButtonComponent } from '../../components/button/button.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent, ButtonComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit {
  contactForm!: FormGroup;

  constructor(private fb: FormBuilder, private location: Location, private toastr: ToastrService, private loading: LoadingService) { }

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      subject: [''],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit(): void {
    this.contactForm.markAllAsTouched();

    if (this.contactForm.invalid) {
      this.toastr.error('É necessário preencher o nome, e-mail e uma mensagem com ao menos 10 caracteres.');

      return;
    };

    this.loading.on();

    setTimeout(() => {
      this.loading.off();

      this.toastr.success('Mensagem enviada com sucesso.');
      this.contactForm.reset();
    }, 1000);
  }

  goBack(): void {
    this.location.back();
  }
}
