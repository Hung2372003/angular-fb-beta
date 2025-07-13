import {  Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MessageComponent } from "../message/message.component";
import { Message } from '../../../core/models/components/message/message.interface';
import { User } from '../../../core/models/common/user.interface';
import { TooltipService } from '../tooltip/tooltip.service';
import { PreviewCardComponent } from "../preview-card/preview-card.component";
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-chat-box',
  imports: [MessageComponent, PreviewCardComponent],
  templateUrl: './chat-box.component.html',
  styleUrl: './chat-box.component.scss'
})
export class ChatBoxComponent{
  constructor(
    public tooltipService:TooltipService,
    private datePipe: DatePipe
  ){}
 @Input() groupChatId?:number
 @Input() listMesages?:Array<Message> = []
 @Input() groupName?:string
 @Input() groupAvater?:string
 @Input() listUser?:Array<User> = []
 @Input() theme?:Partial<{
    // hoverBackgroundColor?: string;
    backgroundColor?: string;
    actionColor?: string;
    actionHoverColor?: string;
    borderBottomCard?: string;
    extraActionColor?: string;
    backgroupInputColor?: string;
    avatarSize?: string;
  }>;

  @ViewChild('chatInput') chatInput!:ElementRef
  @Output() message = new EventEmitter<{ content?: string; files?: Array<{file: File,url: string}> }>();
  previewFile:Array<{
    file: File,
    url: string
  }>=[];
  onInput(event:Event){
  }

  isHiddenAction:boolean=false;
  async onKeyDown(event: KeyboardEvent): Promise<void> {
    setTimeout(() => {
      const message = this.chatInput.nativeElement.innerText.trim();
      this.isHiddenAction = message !== '';
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        if (message) {
          this.sendMessage(message, this.previewFile);
          this.chatInput.nativeElement.innerText = '';
          this.previewFile = [];
          this.isHiddenAction = false;
        }
      }
    });
  }

  sendMessage(message?: string,listFile?: Array<{file: File,url: string}>): void {
    if(!message || message.trim() === '' && (!listFile || listFile.length === 0)){
      return;
    }
    this.message.emit({ content: message, files: listFile });
  }
  isSentMessage(userCode:number){
    const check = this.listUser?.some(x => x.userCode == userCode)
    if(check != undefined){
      return check
    }
    return false;
  }
  setDate(timeData:string){
    let time =new Date((new Date(timeData)).getTime() + 7 * 60 * 60 * 1000);
    let timeNow=new Date();

    let differenceInMilliseconds = Math.abs(time.getTime() - timeNow.getTime());
    let differenceInSeconds = differenceInMilliseconds / 1000;
    let differenceInMinutes = Math.round(differenceInSeconds / 60);
    let differenceInHour = Math.round(differenceInMinutes / 60);
    let differenceInDay =Math.round(differenceInHour / 24);
    const days = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const dayVT=['CN','T2','T3', 'T4', 'T5', 'T6', 'T7']
    const session = (time.getHours() < 12)?'SA':'CH'
    if(differenceInSeconds<10) return "vừa xong"
    else if(differenceInMinutes < 60)return differenceInMinutes.toString()+" phút"
    else if(differenceInHour<24)  return  this.datePipe.transform(time, 'h:MM') + " " + session;
    else if(differenceInDay < 7)
      {
        return   days[time.getDay()] + " " + this.datePipe.transform(time, 'h:MM') + " " + session
      }
    else return  this.datePipe.transform(time, 'h:MM (d ') + 'Tháng' + this.datePipe.transform(time, ' M, yyyy)')
  }
  setDateOptionMessage(timeData1:string ,timeData2?:string){
    let time1 =new Date((new Date(timeData1)).getTime() + 7 * 60 * 60 * 1000);
    if(timeData2 == '' || timeData2 == null){
      timeData2 = (new Date()).toString();
    }
    let time2 =new Date((new Date(timeData2)).getTime() + 7 * 60 * 60 * 1000);
    let differenceInMilliseconds = Math.abs(time1.getTime() - time2.getTime());
    let differenceInSeconds = differenceInMilliseconds / 1000;
    let differenceInMinutes = Math.round(differenceInSeconds / 60);
    if(differenceInMinutes < 20){ return true}
    return false
  }
  setAvatar(userCode:number){
    const data = this.listUser?.filter(user => user.userCode == userCode)[0]?.avatar
    if(data) return data
    return "";
  }
  setStartMessage(item: Message, index:number){
    // if(index == 0) return true;
    if(this.listMesages ){
            if(item.createdBy != this.listMesages[index-1]?.createdBy ||
               !this.setDateOptionMessage(item.createdTime,this.listMesages[index -1].createdTime)
            ) return true;
    }
    return false
  }
  setEndMessage(item: Message, index:number){
    // if(index +1 == this.listMesages?.length) return true
    if(this.listMesages){
      if((item.createdBy != this.listMesages[index +1]?.createdBy) ||
          !this.setDateOptionMessage(item.createdTime,this.listMesages[index + 1].createdTime)
        ) return true
    }
    return false
  }
  onFileSelected(event:Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
     const files = Array.from(input.files);
    const filesWithPreview = files.map(file => ({
      file,
      url: URL.createObjectURL(file)
    }));
    this.previewFile = filesWithPreview;
    }
    input.value = '';

  }
  onAddFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files);
      const filesWithPreview = files.map(file => ({
        file,
        url: URL.createObjectURL(file)
      }));
      this.previewFile.push(...filesWithPreview);
    }
    input.value = '';

  }
  removeFile(index: number): void {
    this.previewFile.splice(index, 1);
  }
}
