import { Component } from '@angular/core';
import { CookieConsentService } from '../../../core/services/cookie-consent.service';

@Component({
  selector: 'app-cookie-consent',
  imports: [],
  templateUrl: './cookie-consent.component.html',
  styleUrl: './cookie-consent.component.scss'
})
export class CookieConsentComponent {
    constructor(public cookieConsentService: CookieConsentService) {}

  accept() {
    this.cookieConsentService.giveConsent();
  }

  deny() {
    this.cookieConsentService.denyConsent();
  }
}
