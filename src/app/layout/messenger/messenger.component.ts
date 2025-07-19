import { TooltipService } from './../../shared/components/tooltip/tooltip.service';
import { LoadingService } from './../../core/services/loading.service';
import { SignalRService } from './../../core/services/signal-r.service';
import { ChatService } from './../../core/services/chat.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ChatHistoryComponent } from '../../shared/components/chat-history/chat-history.component';
import { ChatBoxComponent } from '../../shared/components/chat-box/chat-box.component';
import { CallApiService } from '../../core/services/call-api.service';
import { buildActionMessageAPI, buildChatBoxManagementAPI, buildPersonalActionAPI } from '../../core/api/api.endpoints';
import { NewMessage } from '../../core/models/api/list-new-message.api.interface';
import { Message } from '../../core/models/components/message/message.interface';
import { User } from '../../core/models/common/user.interface';
import { TooltipComponent } from "../../shared/components/tooltip/tooltip.component";
import { ActionsMenuComponent } from "../../shared/components/actions-menu/actions-menu.component";
import { PreviewCardComponent } from "../../shared/components/preview-card/preview-card.component";
import { PersonalInformationResponse } from '../../core/models/api/get-personal-information.api.interface';

interface DataChatbox {
  groupChatId?: number;
  groupAvatar?: string;
  groupName?: string;
  listMessage?: Array<Message>;
  listUser?: Array<User>;
}
@Component({
  selector: 'app-messenger',
  imports: [ChatHistoryComponent, ChatBoxComponent, TooltipComponent, ActionsMenuComponent, PreviewCardComponent],
  templateUrl: './messenger.component.html',
  styleUrl: './messenger.component.scss'
})
export class MessengerComponent implements OnInit {
  private actionMessageAPI: ReturnType<typeof buildActionMessageAPI>;
  private chatBoxManagementAPI: ReturnType<typeof buildChatBoxManagementAPI>
  private personalActionAPI: ReturnType<typeof buildPersonalActionAPI>;
  constructor(
    private CallApiService:CallApiService,
    private ChatService: ChatService,
    private SignalRService: SignalRService,
    private LoadingService: LoadingService,
    public tooltipService: TooltipService
  ){
    this.actionMessageAPI = buildActionMessageAPI(this.CallApiService);
    this.chatBoxManagementAPI = buildChatBoxManagementAPI(this.CallApiService);
    this.personalActionAPI = buildPersonalActionAPI(this.CallApiService);
  }
  listNewMessage: Array <NewMessage> = []
  listDataChatBox: Array <DataChatbox> = []
  dataChatbox: DataChatbox = {}
  listUserOnline: Array<string> = [];
  updatedItem: NewMessage | null = null;
  listMenuItem?: Array<{
    icon: string;
    label: string;
    groupId?: number;
    notifiCount?: number;
    action?: () => void | undefined;
  }>;
  personalInformation?:PersonalInformationResponse
  isToggleMenu: boolean = false;
  updateMenuItem() {
  this.listMenuItem = [
    { icon: 'fa-solid fa-comment', label: 'Tin nhắn', notifiCount: this.isToggleMenu? this.listNewMessage.filter(item => item.status === false).length : 0, action: () => { console.log('Tin nhắn clicked')} },
    { icon:'fa-regular fa-user-group', label:'Bạn bè' },
    { icon: 'fa-regular fa-users-medical', label: 'Tạo nhóm', action: () => { console.log('Tạo nhóm clicked')} },

  ];
}
  async ngOnInit(): Promise<void> {
    this.personalInformation = (await this.personalActionAPI.getPersonalInformation({userCode: parseInt(localStorage.getItem('userCode') ?? '0')})).object;

    await this.SignalRService.startConnection();
    this.LoadingService.show();
    await this.getNewMessage();
    await this.listNewMessage.forEach(async newMessage => {
    await this.SignalRService.joinGroup('groupChat_' + newMessage.groupChatId.toString());
    })
    this.updateMenuItem();
    this.SignalRService.onReceiveMessage((groupId, content, userCode, listFile) => {
      if (groupId) {
        groupId = groupId.replace('groupChat_', '');
        const groupIdNum = parseInt(groupId);
        this.listDataChatBox.forEach(chatBox => {
          if (chatBox.groupChatId == groupIdNum) {
            const newMessage: Message = {
              id: listFile && listFile[0]?.messId ? listFile[0].messId : 0,
              content: content || '',
              createdBy: parseInt(userCode ?? '0'),
              listFile: listFile || [],
              createdTime: (new Date((new Date()).getTime() - 7 * 60 * 60 * 1000)).toString(),
            };
            chatBox.listMessage = [...(chatBox.listMessage ?? []), newMessage];

          }
        });
        this.listNewMessage = [
            ...this.listNewMessage
              .map(item => {
                if (item.groupChatId == groupIdNum) {
                  return {
                    ...item,
                    newMessage: {
                      ...item.newMessage,
                      content: content ?? '',
                      createdTime: new Date().toString(),
                    },
                    status: parseInt(userCode ?? '0') != parseInt(localStorage.getItem('userCode') ?? '0') ? false : true,
                  } as NewMessage;
                }
                return item as NewMessage;
              })
              .sort((a, b) => (a.groupChatId == groupIdNum ? -1 : b.groupChatId == groupIdNum ? 1 : 0))
          ];
          this.updateMenuItem();
        }

    });

    this.SignalRService.onListUserOnline((listUserOnline: Array<string>) => {
      this.listUserOnline = listUserOnline;
    });
    this.LoadingService.hide();
  }

  async getNewMessage(): Promise<void> {
    const data = await this.actionMessageAPI.listNewMessage();
    await (this.listNewMessage = data.object);
  }

  async sendMessage(message: { groupChatId?: number , content?: string, files?: Array<{ file: File, url: string }> }): Promise<void> {
    await this.ChatService.addNewMessageToGroupChat({
      groupChatId: message.groupChatId ?? 0,
      content: message.content,
      files: message.files
    });
  }

  clickChatBox(groupChatId?: number): void {
     if (groupChatId !== undefined) {
     this.listNewMessage = this.listNewMessage.map(item => {
       if (item.groupChatId == groupChatId && item.status == false) {
        this.actionMessageAPI.setStatusReadMessage(groupChatId);
         return {
           ...item,
           status: true,
         } as NewMessage;
       }
       return item as NewMessage;
     });
    }
  }

  async openChat(newMessage: NewMessage){
    if(newMessage.status == false && newMessage.newMessage.createdBy != parseInt(localStorage.getItem('userCode') ?? '0')) {
        await this.actionMessageAPI.setStatusReadMessage(newMessage.groupChatId)
        newMessage.status = true;
        this.listNewMessage = this.listNewMessage.map(item => {
          if (item.groupChatId == newMessage.groupChatId) {
            return {
              ...item,
              status: true,
            } as NewMessage;
          }
          return item as NewMessage;
        });
         this.updateMenuItem();
    }
    if(newMessage.groupChatId == this.dataChatbox.groupChatId ) return;
    if(this.listDataChatBox.some(chatBox => chatBox.groupChatId == newMessage.groupChatId)) {
      this.dataChatbox = this.listDataChatBox.find(chatBox => chatBox.groupChatId == newMessage.groupChatId) || {};
      return;
    }
    const data = await this.chatBoxManagementAPI.createChatBox({groupChatId:newMessage.groupChatId})
     const newChatBox: DataChatbox = await {
        groupChatId: newMessage.groupChatId,
        groupAvatar: newMessage.groupAvatar,
        groupName: newMessage.groupName,
        listUser: newMessage.listUser,
        listMessage: data.object,
    };
    this.dataChatbox = newChatBox;
    this.listDataChatBox.push(this.dataChatbox);
  }
  toggleMenu(){
    this.isToggleMenu = !this.isToggleMenu;
    this.updateMenuItem();
  }
}
