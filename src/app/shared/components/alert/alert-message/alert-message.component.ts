import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';

@Component({
  selector: 'app-alert-message',
  templateUrl: './alert-message.component.html',
  styleUrls: ['./alert-message.component.scss'],
  imports: [CommonModule],
  animations: [
    trigger('fadeInOut', [
    transition(':enter', [
      style({ transform: 'translateX(100%)', opacity: 0 }),
      animate('400ms ease-out', style({ transform: 'translateX(0)', opacity: 1 })),
    ]),
    transition(':leave', [
      animate('400ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 })),
    ]),
  ]),
  ],
})
export class AlertMessageComponent implements OnInit {
  @Input() message?: string| any ='';
  @Input() type?: null | 'success' | 'error' |'warning'| 'info' = 'info';
  @Input() duration?: number = 3000; // auto dismiss sau 3s mặc định
  @Input() timestamp?: number ; // Thêm trường timestamp

  visible = true;

  ngOnInit() {
    setTimeout(() => {
      this.visible = false;
    }, this.duration);
  }

  close() {
    this.visible = false;
  }
}
