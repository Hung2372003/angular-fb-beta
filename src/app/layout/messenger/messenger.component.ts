import { SignalRService } from '../../core/services/signal-r.service';
import { CallApiService } from '../../core/services/call-api.service';
import { Component, OnInit } from '@angular/core';
import { ActionsMenuComponent } from "../../shared/components/actions-menu/actions-menu.component";
import { PreviewCardComponent } from "../../shared/components/preview-card/preview-card.component";
import { PersonalInformationResponse } from '../../core/models/api/get-personal-information.api.interface';
import { buildActionMessageAPI, buildPersonalActionAPI } from '../../core/api/api.endpoints';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-messenger',
  imports: [ActionsMenuComponent, PreviewCardComponent, RouterOutlet],
  templateUrl: './messenger.component.html',
  styleUrl: './messenger.component.scss'
})
export class MessengerComponent implements OnInit{
    private actionMessageAPI: ReturnType<typeof buildActionMessageAPI>;
    private personalActionAPI: ReturnType<typeof buildPersonalActionAPI>;

    constructor(
      private CallApiService:CallApiService,
      private SignalRService:SignalRService
    ){
      this.actionMessageAPI = buildActionMessageAPI(this.CallApiService);
      this.personalActionAPI = buildPersonalActionAPI(this.CallApiService);

    }

    personalInformation?:PersonalInformationResponse
    isToggleMenu: boolean = false;
    listMenuItem?: Array<{
    icon: string;
    label: string;
    groupId?: number;
    notifiCount?: number;
    action?: () => void | undefined;
  }>= [
      { icon: 'fa-brands fa-facebook-messenger', label: 'Đoạn chat', notifiCount: 0, action: () => { console.log('Tin nhắn clicked')} },
      { icon:'fa-regular fa-user-group', label:'Bạn bè' },
      { icon: 'fa-regular fa-users-medical', label: 'Tạo nhóm', action: () => { console.log('Tạo nhóm clicked')} },
      { icon:'fa-regular fa-scanner-touchscreen', label:'Xem tin' }
    ];;

   async updateMenuItem() {
    this.listMenuItem = [
      { icon: 'fa-brands fa-facebook-messenger', label: 'Đoạn chat', notifiCount: (await this.actionMessageAPI.getUnreadMessageCount()).count, action: () => { console.log('Tin nhắn clicked')} },
      { icon:'fa-regular fa-user-group', label:'Bạn bè' },
      { icon: 'fa-regular fa-users-medical', label: 'Tạo nhóm', action: () => { console.log('Tạo nhóm clicked')} },
      { icon:'fa-regular fa-scanner-touchscreen', label:'Xem tin' }
    ];
  }
  toggleMenu(){
    this.isToggleMenu = !this.isToggleMenu;
  }
  async ngOnInit(): Promise<void> {
    this.personalInformation = (await this.personalActionAPI.getPersonalInformation({userCode: parseInt(localStorage.getItem('userCode') ?? '0')})).object;
    await this.SignalRService.startConnection()
    this.SignalRService.onReceiveMessage( async ()=>{
      if (this.listMenuItem && this.listMenuItem[1]) {
        this.listMenuItem[1].notifiCount = (await this.actionMessageAPI.getUnreadMessageCount()).count;
      }
    })
  }
}
