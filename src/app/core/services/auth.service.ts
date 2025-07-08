import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { buildAuthAPI } from '../api/api.endpoints';
import { CallApiService } from './call-api.service';
import { AlertService } from './alert.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private authAPI: ReturnType<typeof buildAuthAPI>;

  constructor(
    private http: HttpClient,
    private ApiService: CallApiService,
    private alert: AlertService
  ) {
    this.authAPI = buildAuthAPI(this.ApiService);
  }

  async checkLogin(): Promise<boolean> {
    try {
      var data = await this.authAPI.checkLogin();
      if(data.error == true){
        return false
      }
      return true;
    } catch {
      this.alert.show('Yêu cầu đăng nhập!','error',3000,Date.now())
      return false;
    }
  }
}
