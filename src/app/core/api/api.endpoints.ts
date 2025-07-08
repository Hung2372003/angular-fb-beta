import { CreateChatBoxReponse } from './../models/api/create-chat-box.api.interface';
// src/app/core/api/auth.api.ts
import { CallApiService } from '../services/call-api.service';
import { RegisterRequest } from '../models/api/register.api.interface';
import { LoginRequest } from '../models/api/login.api.interface';
import { ApiResponse } from '../models/api/common-response.api.interface';
import { NewMessage } from '../models/api/list-new-message.api.interface';
import { Message } from '../models/components/message/message.interface';

export const buildAuthAPI = (api: CallApiService) => ({
  login: (data: LoginRequest): Promise<ApiResponse<object>> =>
    api.callApi<ApiResponse<object>>('Security/UserLogin', 'post', data),

  register: (data: RegisterRequest): Promise<ApiResponse<object>> =>
    api.callApi<ApiResponse<object>>('Security/RegisterAcc', 'post', data),

  googleExchangeCodeLogin: (data: { code: string }): Promise<ApiResponse<object>> =>
    api.callApi<ApiResponse<object>>('Security/GoogleExchangeCodeLogin', 'post', data),

  googleExchangeCodeRegister: (data: { code: string }): Promise<ApiResponse<object>> =>
     api.callApi<ApiResponse<object>>('Security/GoogleExchangeCodeRegister', 'post', data),

  checkLogin: (): Promise<ApiResponse<object>> =>
    api.callApi<ApiResponse<object>>('Security/CheckLogin', 'get'),

  logout: (): Promise<{message:string}> =>
    api.callApi<{message:string}>('Security/Logout', 'post'),

});



export const buildActionMessageAPI = (api: CallApiService) => ({
  listNewMessage: (): Promise<ApiResponse<Array<NewMessage>>> =>
    api.callApi<ApiResponse<Array<NewMessage>>>('ActionMessage/GetAllMessageGroups', 'get'),
  setStatusReadMessage : (groupChatId:number):Promise<ApiResponse<any>> =>
    api.callApi<ApiResponse<any>>('ActionMessage/SetStatusReadMessage' , 'patch',groupChatId)
});

export const buildChatBoxManagementAPI = (api: CallApiService) => ({
  createChatBox: (data:CreateChatBoxReponse): Promise<ApiResponse<Array<Message>>> =>
    api.callApi<ApiResponse<Array<Message>>>('ChatBox/CreateWindowChat', 'post',data),
});
