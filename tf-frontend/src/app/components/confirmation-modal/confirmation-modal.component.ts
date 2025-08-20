import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'tf-confirmation-modal',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.scss'
})
export class ConfirmationModalComponent {
  data = inject(MAT_DIALOG_DATA);

  constructor(private dialogRef: MatDialogRef<ConfirmationModalComponent>) { }

  onButtonClick(clickedButton: string) {
    this.dialogRef.close(clickedButton);
  }
}
