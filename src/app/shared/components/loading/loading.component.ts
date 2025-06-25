import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingService } from '../../../core/services/loading.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  imports: [MatProgressSpinnerModule,CommonModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent {
   constructor(public loadingService: LoadingService) {}
}
