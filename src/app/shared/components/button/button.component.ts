
import { Component, ElementRef, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent implements OnInit {
  @Input() tooltip!:string
  @Input() tooltipTop!:boolean
  @Input() tooltipBottom!:boolean
  @Input() tooltipRight!:boolean
  @Input() tooltipLeft!:boolean
  @Input() directionTooltip!:boolean
  @Input() theme?: Partial<{
    iconColor?: string;
    backgroundHoverButtonColor?: string;
    backgroundTooltip?: string;
    textTooltipColor?: string;
}>;
  constructor(
    private el:ElementRef
  ){}

  ngOnInit(): void {
      this.changeTheme()
  }

  private changeTheme() {
    const hostElement = this.el.nativeElement;

    const defaultTheme: Record<string, string> = {
        '--iconColor':'#3653E8',
        '--backgroundHoverButtonColor':'rgb(227 227 227 / 70%)',
        '--backgroundTooltip':'#000000bf',
        '--textTooltipColor':'white',
    };

    const customTheme: Record<string, string | undefined> = {
      '--iconColor': this.theme?.iconColor,
      '--backgroundHoverButtonColor': this.theme?.backgroundHoverButtonColor,
      '--backgroundTooltip': this.theme?.backgroundTooltip,
      '--textTooltipColor':this.theme?.textTooltipColor,
    };
    function cleanTheme(theme: Record<string, string | undefined>): Record<string, string> {
      return Object.fromEntries(
        Object.entries(theme).filter(([_, v]) => v !== undefined)
      ) as Record<string, string>;
    }

    const mergedTheme = {
      ...defaultTheme,
      ...cleanTheme(customTheme)
    };
    this.setTheme(hostElement, mergedTheme);
  }

  private setTheme(el: HTMLElement, variables: Record<string, string>) {
    Object.entries(variables).forEach(([key, value]) => {
      el.style.setProperty(key, value);
    });
  }
}
