
import { Component, EventEmitter, Input, input, OnInit, Output } from '@angular/core';
import { NewMessage } from '../../../core/models/components/chat-history/new-message.interface';
import { User } from '../../../core/models/common/user.interface';
import { PreviewCardComponent } from "../preview-card/preview-card.component";
@Component({
  selector: 'app-chat-history',
  imports: [PreviewCardComponent],
  templateUrl: './chat-history.component.html',
  styleUrl: './chat-history.component.scss'
})
export class ChatHistoryComponent implements OnInit {

  constructor(
  ){
  }
  @Input() listNewMessage!: Array<NewMessage>
  @Output() openChat = new EventEmitter<NewMessage>

  ngOnInit(): void {
      this.listNewMessage=[
  {
    groupChatId: 1,
    groupAvatar: "https://i.imgur.com/1Jqv1.jpg", // Ảnh từ Imgur
    groupName: "Gia đình",
    listUser: [
      { userCode: 1, name: "Alice" },
      { userCode: 2, name: "Bob" }
    ],
    status: true,
    newMessage: {
      id: 1001,
      content: "Mọi người ăn tối chưa?",
      createdBy: 101,
      createdTime: "2025-05-17T20:45:00Z"
    }
  },
  {
    groupChatId: 2,
    groupAvatar: "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png", // Ảnh từ Wikimedia Commons
    groupName: "Nhóm công việc",
    listUser: [
      { userCode: 1, name: "Alice" },
      { userCode: 2, name: "Bob" }
    ],
    status: false,
    newMessage: {
      id: 1002,
      content: "Báo cáo đã được gửi.",
      createdBy: 202,
      createdTime: "2025-05-17T19:30:00Z"
    }
  },
  {
    groupChatId: 3,
    groupAvatar: "https://i.imgur.com/2nCt3Sbl.jpg", // Ảnh từ Imgur
    groupName: "Bạn bè",
    listUser: [
      { userCode: 1, name: "Alice" },
      { userCode: 2, name: "Bob" }
    ],
    status: true,
    newMessage: {
      id: 1003,
      content: "Cuối tuần này đi đâu chơi không?",
      createdBy: 303,
      createdTime: "2025-05-17T18:15:00Z"
    }
  }
];
  }
  checkOnline(data:Array<User>){}
  setDate(timeData:string){
    let time =new Date(timeData);
    let timeNow=new Date();

    let differenceInMilliseconds = Math.abs(time.getTime() - timeNow.getTime());
    let differenceInSeconds = differenceInMilliseconds / 1000;
    let differenceInMinutes = Math.round(differenceInSeconds / 60);
    let differenceInHour = Math.round(differenceInMinutes / 60);
    let differenceInDay =Math.round(differenceInHour / 24);

    if(differenceInSeconds<10) return "vừa xong"
    else if(differenceInMinutes < 60)return differenceInMinutes.toString()+" phút"
    else if(differenceInHour<24)  return differenceInHour.toString()+" giờ"
    else return differenceInDay.toString() +" Ngày"
  }
}
