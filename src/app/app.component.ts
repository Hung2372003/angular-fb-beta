import { SignalRService } from './core/services/signal-r.service';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { AlertHostComponent } from "./shared/components/alert/alert-host/alert-host.component";
import { LoadingComponent } from "./shared/components/loading/loading.component";
import { LoadingService } from './core/services/loading.service';
import { TooltipComponent } from "./shared/components/tooltip/tooltip.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AlertHostComponent, LoadingComponent, TooltipComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit,OnDestroy{
    private router = inject(Router);
    private loadingService = inject(LoadingService);
    private SignalRService = inject(SignalRService)
     title = 'angular_fb_beta';
   ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loadingService.show();
      }

      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.loadingService.hide();
      }
    });
  }
  async ngOnDestroy(): Promise<void> {
      await this.SignalRService.disconnect()
  }
}
