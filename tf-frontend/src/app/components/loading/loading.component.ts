import { Component } from '@angular/core';
import { LoadingService } from '../../services/loading.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'tf-loading',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent {
  isLoading = false;

  constructor(private loadingService: LoadingService) {}

  ngOnInit(): void {
    this.loadingService.loading$.subscribe((loading) => {
      this.isLoading = loading;
    });
  }
}
