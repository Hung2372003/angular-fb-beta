import { SignalRService } from '../../core/services/signal-r.service';
import { CallApiService } from '../../core/services/call-api.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActionsMenuComponent } from "../../shared/components/actions-menu/actions-menu.component";
import { PreviewCardComponent } from "../../shared/components/preview-card/preview-card.component";
import { PersonalInformationResponse } from '../../core/models/api/get-personal-information.api.interface';
import { buildActionMessageAPI, buildPersonalActionAPI } from '../../core/api/api.endpoints';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { TooltipService } from '../../shared/components/tooltip/tooltip.service';
import { ChatComponent } from '../chat/chat.component';

@Component({
  selector: 'app-messenger',
  imports: [ActionsMenuComponent, PreviewCardComponent, RouterOutlet,RouterLink,RouterLinkActive],
  templateUrl: './messenger.component.html',
  styleUrl: './messenger.component.scss'
})
export class MessengerComponent implements OnInit, AfterViewInit{
    private actionMessageAPI: ReturnType<typeof buildActionMessageAPI>;
    private personalActionAPI: ReturnType<typeof buildPersonalActionAPI>;

    constructor(
      private CallApiService:CallApiService,
      private SignalRService:SignalRService,
       public tooltipService:TooltipService,
       public router: Router
    ){
      this.actionMessageAPI = buildActionMessageAPI(this.CallApiService);
      this.personalActionAPI = buildPersonalActionAPI(this.CallApiService);

    }

    @ViewChild(RouterOutlet) outlet!: RouterOutlet;
    isHiddenMenuBottom?:boolean = true;
    personalInformation?:PersonalInformationResponse
    isToggleMenu: boolean = false;
    listMenuItem?: Array<{
    icon: string;
    label: string;
    groupId?: number;
    backgroupActiveColor?:string,
    notifiCount?: number;
    action?: () => void | undefined;
  }>;

   async updateMenuItem() {
    this.listMenuItem = [
      { icon: 'fa-brands fa-facebook-messenger', label: 'Đoạn chat', notifiCount: (await this.actionMessageAPI.getUnreadMessageCount()).count,backgroupActiveColor:this.router.url=='/messenger/chat'?'#ffffffd4':'', action: () => { console.log('Tin nhắn clicked')} },
       { icon:'fa-regular fa-scanner-touchscreen', label:'Xem tin' },
      { icon:'fa-regular fa-user-group', label:'Bạn bè' },
      { icon: 'fa-regular fa-users-medical', label: 'Tạo nhóm', action: () => { console.log('Tạo nhóm clicked')} },
    ];
  }
  toggleMenu(){
    this.isToggleMenu = !this.isToggleMenu;
  }
   ngAfterViewInit() {
      this.updateMenuItem()
      const child = this.outlet.component as ChatComponent;
      child.isHiddenChatToParent.subscribe(val => {
          this.isHiddenMenuBottom = val
      });
  }
  async ngOnInit(): Promise<void> {
    this.personalInformation = (await this.personalActionAPI.getPersonalInformation({userCode: parseInt(localStorage.getItem('userCode') ?? '0')})).object;
    await this.SignalRService.startConnection()
    this.SignalRService.onReceiveMessage( async ()=>{
      if (this.listMenuItem && this.listMenuItem[0]) {
        this.listMenuItem[0].notifiCount = (await this.actionMessageAPI.getUnreadMessageCount()).count;
      }
    })
  }
    checkScreenSize(): boolean {
    return window.innerWidth <= 740 ? true : false;
  }
}
