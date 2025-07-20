import {  AfterViewChecked, AfterViewInit, Component, ElementRef, EventEmitter, Input, NgZone, OnChanges, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { MessageComponent } from "../message/message.component";
import { Message } from '../../../core/models/components/message/message.interface';
import { User } from '../../../core/models/common/user.interface';
import { TooltipService } from '../tooltip/tooltip.service';
import { PreviewCardComponent } from "../preview-card/preview-card.component";
import { DatePipe } from '@angular/common';
import { ActionsMenuComponent } from "../actions-menu/actions-menu.component";
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-chat-box',
  imports: [MessageComponent, PreviewCardComponent, ActionsMenuComponent],
  templateUrl: './chat-box.component.html',
  styleUrl: './chat-box.component.scss'
})
export class ChatBoxComponent implements OnChanges, AfterViewInit {
  constructor(
    public tooltipService:TooltipService,
    private datePipe: DatePipe,
  ){}
 @Input() groupChatId?:number
 @Input() listMesages?:Array<Message> = []
 @Input() groupName?:string
 @Input() groupAvater?:string
 @Input() listUser?:Array<User> = []
 @Input() shouldScrollToBottom: boolean = true;
 @Input() listUserOnline?: Array<string> = [];
 @Input() isHiddenBackButton?:boolean = true;
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

  @ViewChild('chatInput') chatInput!:ElementRef;
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  @Output() message = new EventEmitter<{ groupChatId?: number; content?: string; files?: Array<{file: File,url: string}> }>();
  @Output() back = new EventEmitter();
  previewFile:Array<{
    file: File,
    url: string
  }>=[];
  isHiddenListAction:boolean = false;
  listMenu:Array<{
    icon: string;
    label: string;
    groupId?: number;
    action?: () => void | undefined;
  }> = [
    { icon: 'fa-solid fa-microphone', label: 'Gửi clip âm thanh'},
    { icon: 'fa-regular fa-images', label: 'Đính kèm file', action: () => this.triggerFileInput()},
    { icon: 'fa-solid fa-person-breastfeeding', label: 'Chọn nhãn dán',},
    { icon:'fa-solid fa-gif', label: 'Chọn file GIF'}
  ];
  isHiddenAction:boolean=false;
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;
  ngAfterViewInit(): void {

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['listMesages'] && this.shouldScrollToBottom) {
        setTimeout(() => {
          this.scrollToBottom();
      },500);
    }
  }
  scrollToBottom(): void {
    if (this.scrollContainer?.nativeElement) {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    }
  }
  triggerFileInput() {
    this.fileInputRef.nativeElement.click();
  }

  async onKeyDown(event: KeyboardEvent): Promise<void> {
    setTimeout(() => {
      const message = this.chatInput.nativeElement.innerText.trim();
      this.isHiddenAction = message !== '';
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        if (message || this.previewFile.length > 0) {
          this.sendMessage(message, this.previewFile);
          this.chatInput.nativeElement.innerText = '';
          this.previewFile = [];
          this.isHiddenAction = false;
        }
      }
    });
  }

  sendMessage(message?: string,listFile?: Array<{file: File,url: string}>): void {
    this.message.emit({groupChatId: this.groupChatId, content: message, files: listFile });
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
    if(this.listMesages ){
            if(item.createdBy != this.listMesages[index-1]?.createdBy ||
               !this.setDateOptionMessage(item.createdTime,this.listMesages[index -1].createdTime)
            ) return true;
    }
    return false
  }

  setEndMessage(item: Message, index:number){
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
  getUserName(userCode: number): string {
    const user = this.listUser?.find(u => u.userCode === userCode);
    return user ? user.name || '' : '';
  }
  checkOnline(listUserOnline?: Array<string>): boolean {
    if (listUserOnline && listUserOnline.length > 0) {
      return this.listUser?.some(user => listUserOnline.includes(user.userCode.toString())) ?? false;
    }
    return false;
  }
  backEvent(){
    this.back.emit();
  }
}
