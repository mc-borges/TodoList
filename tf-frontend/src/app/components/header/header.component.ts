import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'header[tfHeader]',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(protected router:Router) {}
}
