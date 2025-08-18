import { NgClass } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatNativeDateModule, MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink, Router } from '@angular/router';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { ButtonComponent } from '../../components/button/button.component';
import { InputComponent } from '../../components/input/input.component';
import { ClickableTooltipDirective } from '../../helpers/directives/clickable-tooltip.directive';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-edit-checklist',
  standalone: true,
  imports: [InputComponent, ButtonComponent, RouterLink, ReactiveFormsModule, NgClass, NgxMaskDirective, NgxMaskPipe, MatTooltipModule, MatIconModule, ClickableTooltipDirective, MatNativeDateModule, MatDatepickerModule, MatInputModule],
  templateUrl: './edit-checklist.component.html',
  styleUrl: './edit-checklist.component.scss',
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},
  ]
})
export class EditChecklistComponent {
  form: FormGroup;
  today: Date = new Date();

  constructor(private fb: FormBuilder, private _adapter: DateAdapter<any>, @Inject(MAT_DATE_LOCALE) private _locale: string, private router: Router, private toastr: ToastrService, private loading: LoadingService) {
    this.form = this.fb.group({
      name: [null, Validators.required],
      category: [null],
      description: [null],
      limitDate: [null],
      changeColorByDate: [false],
      showMotivationalMsg: [false],
    });
  }

  ngOnInit() {
    this._locale = 'pt-BR';
    this._adapter.setLocale(this._locale);
  }

  createChecklist() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.toastr.error('É necessário preencher o nome da checklist.');

      return;
    };

    this.router.navigate(['home']);

    console.log(this.form.getRawValue());

    this.toastr.success('Checklist editada com sucesso!');
  }

  resetCheckboxes() {
    this.form.reset();

    this.form.get('changeColorByDate')?.setValue(false);
    this.form.get('showMotivationalMsg')?.setValue(false);
  }
}
