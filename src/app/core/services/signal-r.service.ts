import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hostUrlApi: string;
  private hubConnection!: signalR.HubConnection;
  private connectionStarted: Promise<void>;

  constructor() {
    this.hostUrlApi = environment.apiUrl;
    this.connectionStarted = this.startConnection(); // gọi trước luôn để đảm bảo
  }

  async startConnection(): Promise<void> {
    if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
      console.log('SignalR already connected.');
      return;
    }

    if (!this.hubConnection) {
      await this.disconnect()
      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(`${this.hostUrlApi}/hub`, {
          withCredentials: true
        })
        .withAutomaticReconnect()
        .build();
    }

    try {
      await this.hubConnection.start();
      console.log('SignalR Connected!');
    } catch (err) {
      console.error('Error connecting SignalR:', err);
    }
  }


  public async disconnect(): Promise<void> {
  if (this.hubConnection && this.hubConnection.state !== signalR.HubConnectionState.Disconnected) {
    try {
      await this.hubConnection.stop();
      console.log('SignalR disconnected');
    } catch (err) {
      console.error('Error disconnecting SignalR:', err);
    }
  }
}

  public async joinGroup(groupId: string): Promise<void> {

    if (!this.hubConnection || this.hubConnection.state !== signalR.HubConnectionState.Connected) {
      console.warn('Cannot join group: SignalR is not connected');
      return;
    }

   await this.hubConnection.invoke('JoinGroup', groupId)
      .then(() => console.log(`Joined group: ${groupId}`))
      .catch(err => console.error('Error joining group:', err));
  }

  public async leaveGroup(groupId: string): Promise<void> {
    if (!this.hubConnection || this.hubConnection.state !== signalR.HubConnectionState.Connected) {
      console.warn('Cannot leave group: SignalR is not connected');
      return;
    }

   await this.hubConnection.invoke('LeaveGroup', groupId)
      .catch(err => console.error('Error leaving group:', err));
  }

  public async SendMessageToGroup(groupId?: string, content?: string, listFile?: Array<any>): Promise<void> {

    if (!this.hubConnection || this.hubConnection.state !== signalR.HubConnectionState.Connected) {
      console.warn('Cannot send message: SignalR is not connected');
      return;
    }

   await this.hubConnection.invoke('SendMessageToGroup', groupId, content, listFile)
      .then(() => console.log(`Message sent to group: ${groupId}`))
      .catch(err => console.error('Error sending message to group:', err));
  }

  public onReceiveMessage(callback: (groupId?: string, content?: string, userCode?: string, listFile?: Array<any>) => void): void {
    this.connectionStarted.then(() => {
      this.hubConnection.on('ReceiveMessage', callback);
    });
  }
  public onListUserOnline(callback: (listUserOnline: Array<string>) => void): void {
    this.connectionStarted.then(() => {
      this.hubConnection.on('ListUserOnline', callback);
    });
  }
}
