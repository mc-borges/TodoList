import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  // Importante: Adicionamos ReactiveFormsModule aqui para o formulário funcionar
  imports: [ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit {
  // A '!' indica ao TypeScript que esta propriedade será inicializada no construtor
  contactForm!: FormGroup;
  
  // Injetamos o FormBuilder para criar o formulário e o Location para o botão "voltar"
  constructor(private fb: FormBuilder, private location: Location) { }

  ngOnInit(): void {
    // Criamos a estrutura do formulário com seus campos e validações
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      subject: [''], // Campo opcional
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  // Função chamada quando o formulário é enviado
  onSubmit(): void {
    if (this.contactForm.valid) {
      console.log('Dados do Formulário:', this.contactForm.value);
      // Em um projeto real, aqui você faria a chamada para uma API para enviar o email.
      // Por enquanto, exibimos um alerta e limpamos o formulário.
      alert('Mensagem enviada com sucesso! (Verifique o console para ver os dados)');
      this.contactForm.reset();
    } else {
      // Marca todos os campos como "tocados" para exibir os erros de validação
      this.contactForm.markAllAsTouched();
    }
  }

  // Função para navegar para a página anterior
  goBack(): void {
    this.location.back();
  }
}