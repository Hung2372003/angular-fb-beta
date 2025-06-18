import { Component, inject } from '@angular/core';
import { AlertService } from '../../../../core/services/alert.service';
import { CommonModule } from '@angular/common';
import { AlertMessageComponent } from '../alert-message/alert-message.component';

@Component({
  selector: 'app-alert-host',
  imports: [AlertMessageComponent,CommonModule],
  template: `
    @if (alert()) {
      <app-alert-message
        [message]="alert()?.message"
        [type]="alert()?.type"
        [duration]="alert()?.duration"
        [timestamp]="alert()?.timestamp">
      </app-alert-message>
    }
  `,
  standalone: true
})
export class AlertHostComponent {
  public alertService = inject(AlertService);
  readonly alert = this.alertService.alert;

};

