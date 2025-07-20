import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hostUrlApi: string;
  private hubConnection!: signalR.HubConnection;

  constructor() {
    this.hostUrlApi = environment.apiUrl;
    this.startConnection(); // khởi tạo ngay lần đầu
  }

  private async ensureDisconnected(): Promise<void> {
    if (this.hubConnection && this.hubConnection.state !== signalR.HubConnectionState.Disconnected) {
      return new Promise((resolve) => {
        const check = setInterval(() => {
          if (this.hubConnection.state === signalR.HubConnectionState.Disconnected) {
            clearInterval(check);
            resolve();
          }
        }, 300);
      });
    }
  }

  async startConnection(): Promise<void> {
    if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
      console.log('SignalR already connected.');
      return;
    }

    await this.ensureDisconnected();

    if (!this.hubConnection) {
      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(`${this.hostUrlApi}/hub`, {
          withCredentials: true
        })
        .withAutomaticReconnect()
        .build();

      this.hubConnection.onclose(err => console.warn('SignalR closed', err));
      this.hubConnection.onreconnecting(err => console.warn('SignalR reconnecting...', err));
      this.hubConnection.onreconnected(connectionId => console.log('SignalR reconnected:', connectionId));
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

  public async onReceiveMessage(callback: (groupId?: string, content?: string, userCode?: string, listFile?: Array<any>) => void): Promise<void> {
    await this.startConnection();
    this.hubConnection.on('ReceiveMessage', callback);
  }

  public async onListUserOnline(callback: (listUserOnline: Array<string>) => void): Promise<void> {
    await this.startConnection();
    this.hubConnection.on('ListUserOnline', callback);
  }
}
