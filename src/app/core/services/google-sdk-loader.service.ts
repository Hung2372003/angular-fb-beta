import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GoogleSdkLoaderService {

  private sdkLoaded = false;

  constructor() {}

  load(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.sdkLoaded) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        this.sdkLoaded = true;
        resolve();
      };
      script.onerror = (error) => reject(error);

      document.body.appendChild(script);
    });
  }
}
