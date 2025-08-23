import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { ButtonComponent } from '../../components/button/button.component';
import { LoadingService } from '../../services/loading.service';
import { ChecklistService } from '../../services/checklist.service';
import { ChecklistDataResponse } from '../../helpers/types/checklist.type';
import { finalize, filter } from 'rxjs';
import { InputComponent } from '../../components/input/input.component';
import { ChecklistCardComponent } from '../../components/checklist-card/checklist-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ButtonComponent, RouterLink, InputComponent, ChecklistCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  checklists: ChecklistDataResponse[] = [];
  filteredChecklists: ChecklistDataResponse[] = [];

  constructor(
    private loading: LoadingService, 
    private checkService: ChecklistService,
    private router: Router
  ) { 
    // Atualizar checklists quando navegar de volta para home
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (event.url === '/home') {
        this.getChecklists();
      }
    });
  }

  ngOnInit(): void {
    this.getChecklists();
  }

  getChecklists() {
    this.loading.on();

    this.checkService.getChecklists().pipe(finalize(() => this.loading.off())).subscribe({
      next: (data) => {
        this.filteredChecklists = data,
        this.checklists = data;
      },
      error: (e) => console.error(e),
    });
  }

  filterChecklists(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    this.loading.on();

    if (value) {
      this.filteredChecklists = this.checklists.filter((checklist) => {
        return checklist?.name?.toLowerCase().includes(value.toLowerCase()) ||
          checklist?.description?.toLowerCase().includes(value.toLowerCase()) ||
          checklist?.category?.toLowerCase().includes(value.toLowerCase());
      });
    } else {
      this.filteredChecklists = this.checklists;
    }

    this.loading.off();
  }
}
