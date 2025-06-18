import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlertHostComponent } from "./shared/components/alert/alert-host/alert-host.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AlertHostComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular_fb_beta';
}
