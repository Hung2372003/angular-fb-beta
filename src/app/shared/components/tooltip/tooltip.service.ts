import { Injectable } from '@angular/core';
import { TooltipComponent } from './tooltip.component';

@Injectable({
  providedIn: 'root'
})
export class TooltipService {

  constructor() { }
  tooltipComponent: TooltipComponent | null = null;

  register(component: TooltipComponent) {
    this.tooltipComponent = component;
  }

  show(text: string) {
    this.tooltipComponent?.show(text);
  }

  hide() {
    this.tooltipComponent?.hide();
  }
}
