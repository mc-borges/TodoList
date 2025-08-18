import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../components/button/button.component';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ButtonComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(private loading: LoadingService) { }
}
