import { Component } from '@angular/core';
import { ChatHistoryComponent } from '../../shared/components/chat-history/chat-history.component';
import { ChatBoxComponent } from '../../shared/components/chat-box/chat-box.component';

@Component({
  selector: 'app-messenger',
  imports: [ChatHistoryComponent, ChatBoxComponent],
  templateUrl: './messenger.component.html',
  styleUrl: './messenger.component.scss'
})
export class MessengerComponent {

  sendMessage(message: string) {
    const data = message;
    console.log("Message sent:", data);

  }
}
