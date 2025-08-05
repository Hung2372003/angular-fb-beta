import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { TooltipService } from '../tooltip/tooltip.service';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-actions-menu',
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './actions-menu.component.html',
  styleUrl: './actions-menu.component.scss'
})
export class ActionsMenuComponent implements OnInit {
  constructor(
  private el:ElementRef,
   public tooltipService:TooltipService,
  ) {}
  @Input() isLabel?:boolean = true
  @Input() listMenu?: Array<{
    icon: string;
    label: string;
    groupId?: number;
    notifiCount?: number;
    routerLink?:string;
    action?: () => void | undefined;
  }>;
  @Input() theme?: Partial<{
    iconColor?: string;
    textColor?: string;
    backgroundColor?: string;
    boxShadowColor?: string;
    backgroupActiveColor?:string;
  }>;

  ngOnInit(): void {
    this.changeTheme();
  }
  changeTheme() {
    const hostElement = this.el.nativeElement;
    if(this.theme){
      this.setTheme(hostElement, {
         '--icon-color': this.theme.iconColor || '#000',
         '--text-color': this.theme.textColor || '#000',
         '--background-color': this.theme.backgroundColor || '#fff',
         '--boxShadow-color': this.theme.boxShadowColor || '#fdfdfd01',
         '--backgroup-active-color':this.theme.backgroupActiveColor || '',
      });
    }else{
       this.setTheme(hostElement, {
          '--icon-color':'#000',
          '--text-color':'#000',
          '--background-color':'#fff',
          '--boxShadow-color':'#9b9a9a',
          '--backgroup-active-color':'',
      });
    }
  }
    private setTheme(el: HTMLElement, variables: Record<string, string>) {
    Object.entries(variables).forEach(([key, value]) => {
      el.style.setProperty(key, value);
    });
  }
}
