import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CookieConsentService {
  private readonly consentKey = 'cookie-consent';

  hasConsented(): boolean {
    return localStorage.getItem(this.consentKey) === 'true';
  }

  giveConsent(): void {
    localStorage.setItem(this.consentKey, 'true');
  }

  denyConsent(): void {
    localStorage.setItem(this.consentKey, 'false');
  }
}
