import { Directive, HostListener, inject } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';

@Directive({
  selector: '[clickableTooltip]',
  standalone: true
})
export class ClickableTooltipDirective {

  private matTooltip = inject(MatTooltip);

  @HostListener('click')
  onClick() {
    this.matTooltip.show();
  }
}
