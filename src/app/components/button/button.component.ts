import { Component, Input } from '@angular/core';

@Component({
  selector: 'button[tfButton]',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  host: {
    '[class.primary]': 'color === "primary"',
    '[class.secondary]': 'color === "secondary"',
    '[class.tertiary]': 'color === "tertiary"',
  }
})
export class ButtonComponent {
  @Input({required: true}) color: 'primary' | 'secondary' | 'tertiary' = 'primary';
}
