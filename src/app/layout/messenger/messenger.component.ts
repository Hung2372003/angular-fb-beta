import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ChatHistoryComponent } from '../../shared/components/chat-history/chat-history.component';
import { ChatBoxComponent } from '../../shared/components/chat-box/chat-box.component';
import { CallApiService } from '../../core/services/call-api.service';
import { buildActionMessageAPI, buildChatBoxManagementAPI } from '../../core/api/api.endpoints';
import { NewMessage } from '../../core/models/api/list-new-message.api.interface';
import { Message } from '../../core/models/components/message/message.interface';
import { User } from '../../core/models/common/user.interface';
import { TooltipComponent } from "../../shared/components/tooltip/tooltip.component";

@Component({
  selector: 'app-messenger',
  imports: [ChatHistoryComponent, ChatBoxComponent, TooltipComponent],
  templateUrl: './messenger.component.html',
  styleUrl: './messenger.component.scss'
})
export class MessengerComponent implements OnInit {
  private actionMessageAPI: ReturnType<typeof buildActionMessageAPI>;
  private chatBoxManagementAPI: ReturnType<typeof buildChatBoxManagementAPI>
  constructor(
    private CallApiService:CallApiService,
  ){
    this.actionMessageAPI = buildActionMessageAPI(this.CallApiService);
    this.chatBoxManagementAPI = buildChatBoxManagementAPI(this.CallApiService);
  }

  listNewMessage:Array<NewMessage> = []
  dataChatbox:{
    groupChatId?:number,
    groupAvatar?:string,
    groupName?:string,
    listMessage?:Array<Message>,
    listUser?:Array<User>,
  } = {}
  async ngOnInit(): Promise<void> {
    const data = await this.actionMessageAPI.listNewMessage();
    this.listNewMessage = data.object;
  }
  sendMessage(message: { content?: string, files?: Array<{ file: File, url: string }> }): void {
    const data = { content: message.content, files: message.files };
  }
  async openChat(newMessage: NewMessage){
    if(newMessage.groupChatId == this.dataChatbox.groupChatId){
       return
    }
    await this.actionMessageAPI.setStatusReadMessage(newMessage.groupChatId)
    const data = await this.chatBoxManagementAPI.createChatBox({groupChatId:newMessage.groupChatId})
    this.dataChatbox.listMessage = data.object
    this.dataChatbox.groupChatId = newMessage.groupChatId
    this.dataChatbox.groupAvatar = newMessage.groupAvatar
    this.dataChatbox.groupName = newMessage.groupName
    this.dataChatbox.listUser = newMessage.listUser
  }
}
