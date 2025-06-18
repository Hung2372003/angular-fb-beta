
import { Component, ElementRef, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-preview-card',
  imports: [],
  templateUrl: './preview-card.component.html',
  styleUrl: './preview-card.component.scss'
})

export class PreviewCardComponent implements OnInit{
  @Input() avatar!:string
  @Input() title!:string
  @Input() content!:string
  @Input() time!:string
  @Input() isOnline!:boolean
  @Input() isRead!:boolean
  @Input() notifi!:boolean
  @Input() theme?: Partial<{
    // hoverBackgroundColor?: string;
    backgroundColor?: string;
    titleColor?: string;
    titleSize?: string;
    contentColor?: string;
    contentApprovedColor?: string;
    borderOnlineDotColor?: string;
    avatarSize?: string;
}>;
  constructor(
    private el : ElementRef
  ){}

  ngOnInit(): void {
      this.changeTheme();

  }
private changeTheme() {
    const hostElement = this.el.nativeElement;

    const defaultTheme: Record<string, string> = {
      '--hoverBackgroundColor': 'rgb(227 227 227 / 70%)',
      '--backgroundColor': 'rgb(255, 255, 255)',
      '--titleColor': 'black',
      '--titleSize': '17px',
      '--contentColor': 'black',
      '--contentApprovedColor': '#898989',
      '--borderOnlineDotColor': '#ffffff',
      '--avatarSize': '50px',
    };

    const customTheme: Record<string, string | undefined> = {
      // '--hoverBackgroundColor': this.theme?.hoverBackgroundColor,
      '--backgroundColor': this.theme?.backgroundColor,
      '--titleColor': this.theme?.titleColor,
      '--titleSize': this.theme?.titleSize,
      '--contentColor': this.theme?.contentColor,
      '--contentApprovedColor': this.theme?.contentApprovedColor,
      '--borderOnlineDotColor': this.theme?.borderOnlineDotColor,
      '--avatarSize': this.theme?.avatarSize,
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
