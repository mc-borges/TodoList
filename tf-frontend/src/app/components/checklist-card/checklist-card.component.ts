import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChecklistDataResponse } from '../../helpers/types/checklist.type';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { ChecklistService } from '../../services/checklist.service';
import { finalize } from 'rxjs';
import { LoadingService } from '../../services/loading.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'tf-checklist-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './checklist-card.component.html',
  styleUrl: './checklist-card.component.scss',
})
export class ChecklistCardComponent {
  @Input() data!: ChecklistDataResponse;
  @Output() hasUpdatedChecklists = new EventEmitter();
  statusColor: string = '#30B43C';

  constructor(private modal: MatDialog, private checkService: ChecklistService, private loading: LoadingService, private toastr: ToastrService) { }

  ngOnInit() {
    this.statusColor = this.getStatusColor();
  }

  get completedTasksCount(): number {
    if (!this.data?.items) return 0;
    return this.data.items.filter(item => item.completed).length;
  }

  get totalTasksCount(): number {
    return this.data?.items?.length || 0;
  }

  getStatusColor() {
    if (!this.data?.change_color_by_date) return '#30B43C';

    const limitDate = new Date(this.data.limit_date);
    const now = new Date();
    const diffDays = (limitDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays > 3) {
      return '#30B43C';
    } else if (diffDays >= 1 && diffDays <= 3) {
      return '#FFC107';
    } else {
      return '#FF0000';
    }
  }

  deleteChecklist(id: string) {
    const dialogRef = this.modal.open(ConfirmationModalComponent, {
      width: '695px',
      data: {
        title: 'Excluir checklist',
        message: 'Atenção! A ação de excluir a checklist é permanente, tem certeza?',
        buttonText: 'Cancelar',
        hasSecondaryButton: true,
        secondaryButtonText: 'Excluir',
        secondaryButtonColor: 'tertiary'
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res === 'Clicked Secondary') {
        this.loading.on();

        this.checkService.deleteChecklist(id).pipe(finalize(() => this.loading.off())).subscribe({
          next: () => {
            this.hasUpdatedChecklists.emit();

            this.toastr.success('Checklist deletada.');
          },
          error: (e) => console.error(e),
        });
      }
    });
  }
}
