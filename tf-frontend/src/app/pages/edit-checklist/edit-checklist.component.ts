import { NgClass } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatNativeDateModule, MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { ButtonComponent } from '../../components/button/button.component';
import { InputComponent } from '../../components/input/input.component';
import { ClickableTooltipDirective } from '../../helpers/directives/clickable-tooltip.directive';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from '../../services/loading.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';
import { ChecklistService } from '../../services/checklist.service';
import { finalize } from 'rxjs';
import { ChecklistDataResponse } from '../../helpers/types/checklist.type';

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
export class EditChecklistComponent implements OnInit {
  listId!: string | null;
  checklist!: ChecklistDataResponse;
  form!: FormGroup;
  today: Date = new Date();

  constructor(private fb: FormBuilder, private _adapter: DateAdapter<any>, @Inject(MAT_DATE_LOCALE) private _locale: string, private router: Router, private toastr: ToastrService, private loading: LoadingService, private modal: MatDialog, private activatedroute: ActivatedRoute, private checkService: ChecklistService) {
    this.form = this.fb.group({
      name: [null, Validators.required],
      category: [null],
      description: [null],
      limitDate: [null],
      changeColorByDate: [false],
      showMotivationalMsg: [false],
    });
  }

  ngOnInit(): void {
    this.listId = this.activatedroute.snapshot.paramMap.get('id');

    this.checkService.getChecklistById(this.listId!).subscribe({
      next: (res) => {
        this.updateForm(res);
      },
      error: (e) => {
        console.error(e);

        this.toastr.error('Algo deu errado. Tente novamente mais tarde.');

        this.router.navigate(['home']);
      },
    });

    this._locale = 'pt-BR';
    this._adapter.setLocale(this._locale);
  }

  updateForm(data: ChecklistDataResponse) {
    this.form.get('name')?.setValue(data.name);
    this.form.get('category')?.setValue(data.category);
    this.form.get('description')?.setValue(data.description);
    this.form.get('limitDate')?.setValue(data.limit_date);
    this.form.get('changeColorByDate')?.setValue(data.change_color_by_date);
    this.form.get('showMotivationalMsg')?.setValue(data.show_motivational_msg);

    this.checklist = this.form.getRawValue();
  }

  editChecklist() {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.toastr.error('É necessário preencher o nome da checklist.');

      return;
    };

    this.loading.on();

    this.checkService.updateChecklist(this.listId!, this.form.getRawValue()).pipe(finalize(() => this.loading.off())).subscribe({
      next: () => {
        this.toastr.success('Checklist atualizada com sucesso.');

        this.router.navigate(['home']);
      },
      error: (e) => {
        this.toastr.error(e.error.detail);

        console.error(e);
      },
    });
  }

  cancelEdit(isArrowButton: boolean = false) {
    if (isArrowButton && JSON.stringify(this.form.getRawValue()) === JSON.stringify(this.checklist)) {
      this.router.navigate(['home']);

      return;
    }

    const dialogRef = this.modal.open(ConfirmationModalComponent, {
      width: '695px',
      data: {
        title: 'Sair sem salvar?',
        message: 'Você tem alterações não salvas. Se sair agora, elas serão perdidas!',
        buttonText: 'Continuar editando',
        hasSecondaryButton: true,
        secondaryButtonText: 'Descartar alterações'
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res === 'Clicked Secondary') {
        this.router.navigate(['home']);
      }
    });
  }
}
