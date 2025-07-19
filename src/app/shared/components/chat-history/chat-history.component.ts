
import { Component, EventEmitter, Input, input, OnInit, Output } from '@angular/core';
import { User } from '../../../core/models/common/user.interface';
import { PreviewCardComponent } from "../preview-card/preview-card.component";
import { NewMessage } from '../../../core/models/api/list-new-message.api.interface';
@Component({
  selector: 'app-chat-history',
  imports: [PreviewCardComponent],
  templateUrl: './chat-history.component.html',
  styleUrl: './chat-history.component.scss'
})
export class ChatHistoryComponent implements OnInit {
  @Input() listNewMessage!: Array<NewMessage>
  @Output() openChat = new EventEmitter<NewMessage>
  @Input() listUserOnline?: Array<string> = [];
  ngOnInit(): void {
  }
  checkOnline(data:Array<User>){
    if(this.listUserOnline && this.listUserOnline.length>0){
      return data.some(x => this.listUserOnline?.includes(x.userCode.toString()));
    }
    return false;
  }
  setDate(timeData:string){
    let time =new Date(new Date(timeData).getTime() - 7 * 60 * 60 * 1000);
    //  let time =new Date(new Date(timeData).getTime());
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
