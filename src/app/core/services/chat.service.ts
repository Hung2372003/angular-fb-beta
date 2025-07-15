import { SignalRService } from './signal-r.service';
import { buildChatBoxManagementAPI } from '../api/api.endpoints';
import { AddNewMessageRequest } from './../models/api/add-new-mesage.api.interface';
import { Injectable } from '@angular/core';
import { CallApiService } from './call-api.service';
import { A } from '@angular/cdk/keycodes';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

    private chatBoxManagementAPI: ReturnType<typeof buildChatBoxManagementAPI>

  constructor(
    private CallApiService: CallApiService,
    private SignalRService: SignalRService
  ) {
       this.chatBoxManagementAPI = buildChatBoxManagementAPI(this.CallApiService);
   }
  async addNewMessageToGroupChat(AddNewMessageRequest: AddNewMessageRequest){
    if(AddNewMessageRequest.groupChatId === undefined || AddNewMessageRequest.content === undefined) return;
     const data= await this.chatBoxManagementAPI.addNewMessage(AddNewMessageRequest);
     await this.SignalRService.SendMessageToGroup('groupChat_' + AddNewMessageRequest.groupChatId.toString(), AddNewMessageRequest.content, data.object);
    return data;
  }
}
