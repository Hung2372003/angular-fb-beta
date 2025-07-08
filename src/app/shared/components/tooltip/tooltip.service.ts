import { Injectable } from '@angular/core';
import { TooltipComponent } from './tooltip.component';

@Injectable({
  providedIn: 'root'
})
export class TooltipService {
    private resolveReady: (() => void) | null = null;
  private ready: Promise<void>;
   constructor() {
    this.ready = new Promise((resolve) => {
      this.resolveReady = resolve;
    });
  }
  tooltipComponent: TooltipComponent | null = null;

  register(component: TooltipComponent) {
    this.tooltipComponent = component;
    this.resolveReady?.();
    return 'heheh'
  }

  async show(text: string) {
     await this.ready;
    this.tooltipComponent?.show(text);
  }

  async hide() {
     await this.ready;
    this.tooltipComponent?.hide();
  }

}
