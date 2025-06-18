import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MessageComponent } from "../message/message.component";
import { Message } from '../../../core/models/components/message/message.interface';
import { User } from '../../../core/models/common/user.interface';
import { ButtonComponent } from "../button/button.component";
import { TooltipComponent } from "../tooltip/tooltip.component";
import { TooltipService } from '../tooltip/tooltip.service';
import { PreviewCardComponent } from "../preview-card/preview-card.component";


@Component({
  selector: 'app-chat-box',
  imports: [MessageComponent, ButtonComponent, TooltipComponent, PreviewCardComponent],
  templateUrl: './chat-box.component.html',
  styleUrl: './chat-box.component.scss'
})
export class ChatBoxComponent implements AfterViewInit{

  constructor(
    private cdr:ChangeDetectorRef,
    public tooltipService:TooltipService
  ){}
 @ViewChild('tooltip') tooltip!:TooltipComponent;
 @Input() groupChatId!:number
 @Input() listMesages!:Array<Message>
 @Input() groupName!:string
 @Input() groupAvater!:string
 @Input() listUser!:Array<User>
 @Input() theme!:Partial<{
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

  @Output() message = new EventEmitter<string>();

  ngAfterViewInit(): void {
      this.tooltipService.register(this.tooltip);
  }

  onInput(event:Event){

  }

  isHiddenAction:boolean=false;
  async onKeyDown(event: KeyboardEvent): Promise<void> {
    setTimeout(() => {
      const message = this.chatInput.nativeElement.innerText.trim();
      this.isHiddenAction = message !== '';

      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault(); // Ngăn xuống dòng
        if (message) {
          this.sendMessage(message);
          this.chatInput.nativeElement.innerText = '';
          this.isHiddenAction = false;
        }
      }
    });
  }

  sendMessage(message: string): void {
   this.message.emit(message);
  }
}
