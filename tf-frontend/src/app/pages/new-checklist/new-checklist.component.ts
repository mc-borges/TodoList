import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { ButtonComponent } from '../../components/button/button.component';
import { InputComponent } from '../../components/input/input.component';
import { CustomPasswordValidator } from '../../helpers/validators/custom-password.validator';

@Component({
  selector: 'app-new-checklist',
  standalone: true,
  imports: [InputComponent, ButtonComponent, RouterLink, ReactiveFormsModule, NgClass, NgxMaskDirective, NgxMaskPipe],
  templateUrl: './new-checklist.component.html',
  styleUrl: './new-checklist.component.scss'
})
export class NewChecklistComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      category: [''],
      description: [''],
      limitDate: [''],
      changeColorByDate: [false],
      showMotivationalMsg: [false],
    });
  }

  createChecklist() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    console.log(this.form.getRawValue());
  }
}
