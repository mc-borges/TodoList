import { NgClass } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { ButtonComponent } from '../../components/button/button.component';
import { InputComponent } from '../../components/input/input.component';
import { ClickableTooltipDirective } from '../../helpers/directives/clickable-tooltip.directive';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MAT_DATE_LOCALE, DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from '../../services/loading.service';
import { ChecklistService } from '../../services/checklist.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-new-checklist',
  standalone: true,
  imports: [
    InputComponent,
    ButtonComponent,
    RouterLink,
    ReactiveFormsModule,
    NgClass,
    NgxMaskDirective,
    NgxMaskPipe,
    MatTooltipModule,
    MatIconModule,
    ClickableTooltipDirective,
    MatNativeDateModule,
    MatDatepickerModule,
    MatInputModule
  ],
  templateUrl: './new-checklist.component.html',
  styleUrl: './new-checklist.component.scss',
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},
  ]
})
export class NewChecklistComponent implements OnInit {
  form: FormGroup;
  today: Date = new Date();

  constructor(private fb: FormBuilder, private _adapter: DateAdapter<any>, @Inject(MAT_DATE_LOCALE) private _locale: string, private router: Router, private toastr: ToastrService, private loading: LoadingService, private checkService: ChecklistService) {
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

    if (this.form.get('changeColorByDate')?.value && this.form.get('limitDate')?.errors) {
      this.toastr.error('Ao marcar a opção "Ativar coloração por prazo", é necessário selecionar um prazo.');

      return;
    };

    if (this.form.invalid) {
      this.toastr.error('É necessário preencher o nome da checklist.');

      return;
    };

    this.loading.on();

    this.checkService.createChecklist(this.form.getRawValue()).pipe(finalize(() => this.loading.off())).subscribe({
      next: (data) => {
        this.toastr.success('Nova Checklist criada com sucesso.');

        this.router.navigate(['home']);
      },
      error: (e) => {
        this.toastr.error(e.error.detail);

        console.error(e);
      },
    });
  }

  resetCheckboxes() {
    this.form.reset();

    this.form.get('changeColorByDate')?.setValue(false);
    this.form.get('showMotivationalMsg')?.setValue(false);
    this.form.get('limitDate')?.clearValidators();
    this.form.get('limitDate')?.updateValueAndValidity();
  }

  changeLimitDateValidation(event: any): void {
    if (event.target.checked) {
      this.form.get('limitDate')?.setValidators([Validators.required]);
    } else {
      this.form.get('limitDate')?.clearValidators();
    }

    this.form.get('limitDate')?.updateValueAndValidity();
  }
}
