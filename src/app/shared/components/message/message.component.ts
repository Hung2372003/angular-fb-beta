
import { Component, ElementRef, Input, OnInit } from '@angular/core';


@Component({
  selector: 'app-message',
  imports: [],
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {
  @Input() avatar!:string
  @Input() name!:string
  @Input() content!:string
  @Input() time!:string
  @Input() sentMessage!:boolean
  @Input() startMessage!:boolean
  @Input() endMessage!:boolean
  @Input() displayTime!:boolean
  @Input() theme!:{
    messageSentBackgroundColor:string
    messageReceivedBackgroundColor:string
    messageSentColor:string
    messageReceivedColor:string
    hoverIcon:string
    colorIcon:string
  }

  constructor(
    private el:ElementRef
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
          '--colorIcon':this.theme.colorIcon
      });
    }else{
       this.setTheme(hostElement, {
          '--messageSentBackgroundColor':'#3653E8',
          '--messageReceivedBackgroundColor':'#F0F0F0',
          '--messageSentColor':'white',
          '--messageReceivedColor':'black',
          '--hoverIcon':'rgb(227 227 227 / 70%)',
          '--colorIcon':'#898989',
      });
    }
  }

  private setTheme(el: HTMLElement, variables: Record<string, string>) {
    Object.entries(variables).forEach(([key, value]) => {
      el.style.setProperty(key, value);
    });
  }

}
