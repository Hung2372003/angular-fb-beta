import { Injectable } from '@angular/core';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  constructor(
    private alert:AlertService
  ){

  }
  private clientId = '385205005569-lcj7sjqrccd2c3t42u3637mgiv179t5l.apps.googleusercontent.com';
  private initialized = false;


  initializeGoogleLogin(callback: (res: google.accounts.id.CredentialResponse) => void): void {
     if (this.initialized) return; // Đảm bảo chỉ khởi tạo 1 lần

    google.accounts.id.initialize({
      client_id: this.clientId,
      callback,
      cancel_on_tap_outside: false,
      auto_select: false,
      ux_mode: 'popup',
      nonce: crypto.randomUUID()
    } as google.accounts.id.IdConfiguration);

    //Tùy chọn: render nút Google mặc định (nếu dùng)
    const btn = document.getElementById('google-btn');
    if (btn) {
      google.accounts.id.renderButton(btn, {
        theme: 'outline',
        size: 'large',
      });
    }

    this.initialized = true;
    //this.promptLogin()
  }

  promptLogin(): void {
    // google.accounts.id.disableAutoSelect();
    google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed()) {
        console.warn('Hộp thoại KHÔNG hiển thị:', notification.getNotDisplayedReason());
        this.alert.show('Hộp thoại KHÔNG hiển thị','error',4000,Date.now())
      }
      if (notification.isSkippedMoment()) {
        console.warn('Google login bị bỏ qua:', notification.getSkippedReason());
          this.alert.show('Google login bị bỏ qua','error',4000,Date.now())
      }
      if (notification.isDismissedMoment()) {
        console.warn('Google login bị đóng:', notification.getDismissedReason());
          this.alert.show('Google login bị đóng','error',4000,Date.now())
      }
    });
  }

  revoke(): void {
    google.accounts.id.disableAutoSelect();
  }
}
