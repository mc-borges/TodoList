import { ChangeDetectorRef, Component } from '@angular/core';
import { ChecklistService } from '../../services/checklist.service';
import { ChecklistDataResponse, ChecklistItem } from '../../helpers/types/checklist.type';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '../../services/loading.service';
import { ToastrService } from 'ngx-toastr';
import { InputComponent } from '../../components/input/input.component';
import { MatIconModule } from '@angular/material/icon';
import {CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray, CdkDragHandle} from '@angular/cdk/drag-drop';
import { finalize } from 'rxjs';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../components/button/button.component';

@Component({
  selector: 'app-checklist-tasks',
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent, ButtonComponent, MatIconModule, CdkDropList, CdkDrag, CdkDragHandle],
  templateUrl: './checklist-tasks.component.html',
  styleUrl: './checklist-tasks.component.scss'
})
export class ChecklistTasksComponent {
  formGroup: FormGroup;
  listId!: string | null;
  checklist!: ChecklistDataResponse;
  saveItemsClicked: boolean = false;

  constructor(private cdRef: ChangeDetectorRef, private fb: FormBuilder, private checkService: ChecklistService, private activatedroute: ActivatedRoute, private loading: LoadingService, private toastr: ToastrService, private router: Router) {
    this.formGroup = this.fb.group({
      form: this.fb.array([this.createTask()])
    });
  }

  get form(): FormArray {
    return this.formGroup.get('form') as FormArray;
  }

  get items() {
    return this.form.controls as FormGroup[];
  }

  private createTask(item?: ChecklistItem): FormGroup {
    return this.fb.group({
      id: [item?.id || null],
      title: [item?.title || '', [Validators.required]],
      description: [item?.description || ''],
      completed: [item?.completed || false],
    });
  }

  addItem(): void {
    this.form.push(this.createTask());

    this.cdRef.detectChanges();

    document.getElementById('task-' + (this.form.length - 1))?.focus();
  }

  editItem(index: number): void {

  }

  removeItem(index: number): void {
    this.form.removeAt(index);
  }

  drop(event: CdkDragDrop<FormGroup[]>): void {
    moveItemInArray(this.form.controls, event.previousIndex, event.currentIndex);
  }

  ngOnInit(): void {
    this.listId = this.activatedroute.snapshot.paramMap.get('id');

    this.loading.on();

    this.checkService.getChecklistById(this.listId!).pipe(finalize(() => this.loading.off())).subscribe({
      next: (res) => {
        this.checklist = res;
        
        // Limpar o FormArray atual
        this.form.clear();
        
        // Se há itens existentes, carregar no formulário
        if (res.items && res.items.length > 0) {
          res.items.forEach(item => {
            this.form.push(this.createTask(item));
          });
        } else {
          // Se não há itens, adicionar um campo vazio
          this.form.push(this.createTask());
        }
      },
      error: (e) => {
        console.error(e);
        this.toastr.error('Erro ao carregar checklist');
      },
    });
  }

  addTasksInChecklist() {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.saveItemsClicked = true;

      if (this.form.length === 1) {
        this.toastr.error('É necessário preencher pelo menos uma tarefa.');
      } else {
        this.toastr.error('Todos os campos de tarefa devem ser preenchidos.');
      }

      setTimeout(() => {
        this.saveItemsClicked = false;
      }, 2000);

      return;
    }

    // Preparar dados para o novo endpoint otimizado
    const items: ChecklistItem[] = this.form.value.map((formItem: any) => ({
      id: formItem.id || null,
      title: formItem.title,
      description: formItem.description || null,
      completed: formItem.completed
    }));

    // Filtrar itens com título vazio (caso o usuário tenha removido o conteúdo)
    const validItems = items.filter(item => item.title && item.title.trim().length > 0);

    this.loading.on();

    // Usar o novo endpoint otimizado
    this.checkService.updateChecklistItems(this.listId!, { items: validItems })
      .pipe(finalize(() => this.loading.off()))
      .subscribe({
        next: (response) => {
          console.log('Resposta do servidor:', response);
          
          // Mostrar estatísticas da operação
          const stats = [];
          if (response.created_count > 0) stats.push(`${response.created_count} criadas`);
          if (response.updated_count > 0) stats.push(`${response.updated_count} atualizadas`);
          if (response.deleted_count > 0) stats.push(`${response.deleted_count} removidas`);
          
          const message = stats.length > 0 
            ? `Tarefas salvas! (${stats.join(', ')})`
            : 'Tarefas salvas com sucesso!';
          
          this.toastr.success(message);
          this.router.navigate(['home']);
        },
        error: (e) => {
          console.error('Erro ao salvar tarefas:', e);
          this.toastr.error('Erro ao salvar tarefas. Tente novamente.');
        }
      });
  }

  cancel() {
    this.router.navigate(['home']);

    return;
  }
}
