
import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { TooltipService } from '../tooltip/tooltip.service';
import { FileCommon } from '../../../core/models/common/file.interface';

@Component({
  selector: 'app-message',
  imports: [],
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {
  @Input() avatar!:string
  @Input() name!:string
  @Input() listImage?:Array<FileCommon>
  @Input() content!:string
  @Input() time!:string
  @Input() sentMessage?:boolean = false
  @Input() startMessage?:boolean = false
  @Input() endMessage?:boolean  = false
  @Input() displayTime?:boolean  = false
  @Input() theme!:{
    messageSentBackgroundColor:string
    messageReceivedBackgroundColor:string
    messageSentColor:string
    messageReceivedColor:string
    hoverIcon:string
    colorIcon:string
    colorTime:string
  }

  constructor(
    private el:ElementRef,
      public tooltipService:TooltipService,
  ){}

  ngOnInit(): void {
      this.changeTheme();
      this.content = this.content.replace(/\\n/g, '\n');
  }

  changeTheme() {
    const hostElement = this.el.nativeElement;
    if(this.theme){
      this.setTheme(hostElement, {
          '--messageSentBackgroundColor':this.theme.messageSentBackgroundColor,
          '--messageReceivedBackgroundColor':this.theme.messageReceivedBackgroundColor,
          '--messageSentColor':this.theme.messageSentColor,
          '--messageReceivedColor':this.theme.messageReceivedColor,
          '--hoverIcon':this.theme.hoverIcon,
          '--colorIcon':this.theme.colorIcon,
          '--colorTime':this.theme.colorTime
      });
    }else{
       this.setTheme(hostElement, {
          '--messageSentBackgroundColor':'#3653E8',
          '--messageReceivedBackgroundColor':'#F0F0F0',
          '--messageSentColor':'white',
          '--messageReceivedColor':'black',
          '--hoverIcon':'rgb(227 227 227 / 70%)',
          '--colorIcon':'#898989',
          '--colorTime':'#8c8c8c'
      });
    }
  }

  private setTheme(el: HTMLElement, variables: Record<string, string>) {
    Object.entries(variables).forEach(([key, value]) => {
      el.style.setProperty(key, value);
    });
  }
}
