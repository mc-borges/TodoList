import { ChangeDetectorRef, Component } from '@angular/core';
import { ChecklistService } from '../../services/checklist.service';
import { ChecklistDataResponse } from '../../helpers/types/checklist.type';
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

  private createTask(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required]],
      completed: [false],
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
      },
      error: (e) => {
        console.error(e);
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

    this.router.navigate(['home']);
  }

  cancel() {
    this.router.navigate(['home']);

    return;
  }
}
