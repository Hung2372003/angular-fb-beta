import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { ErrorHandlingService } from './error-handling.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CallApiService {
  private isBrowser: boolean;
  private hostUrlApi: string;

  constructor(
    private http: HttpClient,
    private errorHandlingService: ErrorHandlingService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.hostUrlApi = environment.apiUrl;
  }

  async callApi<T>(endpoint: string, method: string, data?: any): Promise<T> {
    if (!this.isBrowser) {
      throw new Error('API calls are not supported in server-side rendering');
    }

    const url = `${this.hostUrlApi}/${endpoint}`;
    const m = method.toLowerCase();
    const options: any = {};

    // Handle different HTTP methods
    switch (m) {
      case 'get':
        if (data) {
          options.params = new HttpParams({ fromObject: data });
        }
        break;
      case 'post':
      case 'put':
      case 'patch':
      case 'delete':
        if (data) {
          options.body = data;
        }
        break;
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }

    try {
      const request$ = this.http.request<T>(m, url, options).pipe(
        map(response => response as T)
      );
      return await firstValueFrom(request$);
    } catch (error) {
      this.errorHandlingService.handleError(error as HttpErrorResponse);
      throw error;
    }
  }
}
