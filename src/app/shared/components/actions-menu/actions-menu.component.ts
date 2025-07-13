import { Component, ElementRef, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-actions-menu',
  imports: [],
  templateUrl: './actions-menu.component.html',
  styleUrl: './actions-menu.component.scss'
})
export class ActionsMenuComponent implements OnInit {
  constructor(
  private el:ElementRef,
  ) {}
  @Input() listMenu?: Array<{
    icon: string;
    label: string;
    groupId?: number;
    action?: () => void | undefined;
  }>;
  @Input() theme?: Partial<{
    iconColor?: string;
    textColor?: string;
  }>;

  ngOnInit(): void {
    this.changeTheme();
  }
  changeTheme() {
    const hostElement = this.el.nativeElement;
    if(this.theme){
      this.setTheme(hostElement, {
         '--icon-color': this.theme.iconColor || '#000',
         '--text-color': this.theme.textColor || '#000'
      });
    }else{
       this.setTheme(hostElement, {
          '--icon-color':'#000',
          '--text-color':'#000',
      });
    }
  }
    private setTheme(el: HTMLElement, variables: Record<string, string>) {
    Object.entries(variables).forEach(([key, value]) => {
      el.style.setProperty(key, value);
    });
  }
}
