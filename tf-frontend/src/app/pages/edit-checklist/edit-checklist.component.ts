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
      },
    });

    this._locale = 'pt-BR';
    this._adapter.setLocale(this._locale);
  }

  updateForm(data: ChecklistDataResponse) {
    this.form.get('name')?.setValue(data.name);
    this.form.get('category')?.setValue(data.category);
    this.form.get('description')?.setValue(data.description);
    // Convert ISO string back to Date object for the date picker
    this.form.get('limitDate')?.setValue(data.limit_date ? new Date(data.limit_date) : null);
    this.form.get('changeColorByDate')?.setValue(data.change_color_by_date);
    this.form.get('showMotivationalMsg')?.setValue(data.show_motivational_msg);

    // Salvar uma cópia dos dados originais para comparação
    this.checklist = {
      name: data.name,
      category: data.category,
      description: data.description,
      limit_date: data.limit_date,
      change_color_by_date: data.change_color_by_date,
      show_motivational_msg: data.show_motivational_msg
    } as any;
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

  // Método simples para voltar - sempre funciona
  goBack() {
    console.log('goBack chamado');
    this.router.navigate(['home']);
    return;
  }

  cancelEdit(isArrowButton: boolean = false) {
    console.log('cancelEdit chamado, isArrowButton:', isArrowButton);
    
    // VERSÃO SIMPLIFICADA PARA TESTE
    if (isArrowButton) {
      console.log('Botão de seta clicado - navegando diretamente');
      this.router.navigate(['home']);
      return;
    }

    // Se há mudanças ou é o botão cancelar, mostrar modal de confirmação
    console.log('Mostrando modal de confirmação');
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
      console.log('Modal fechado com resultado:', res);
      if (res === 'Clicked Secondary') {
        console.log('Navegando para home após descartar');
        this.router.navigate(['home']);
      }
    });
  }

  private hasDateChanged(currentDate: Date | null, originalDate: string | null): boolean {
    // Se ambos são null/undefined, não houve mudança
    if (!currentDate && !originalDate) return false;
    
    // Se um é null e outro não, houve mudança
    if (!currentDate || !originalDate) return true;
    
    // Comparar as datas
    const originalDateObj = new Date(originalDate);
    return currentDate.getTime() !== originalDateObj.getTime();
  }
}
