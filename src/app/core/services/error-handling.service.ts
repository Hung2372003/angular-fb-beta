import { inject, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {
  private alertService = inject(AlertService)
  handleError(error: HttpErrorResponse): void {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;

      // Handle specific error codes
      switch (error.status) {
        case 400:
          errorMessage = '(400) Bad Request - Please check your input';
          break;
        case 401:
          errorMessage = '(401) Unauthorized - Please login again';
          break;
        case 403:
          errorMessage = '(403) Forbidden - You don\'t have permission';
          break;
        case 404:
          errorMessage = '(404) Not Found - The requested resource was not found';
          break;
        case 500:
          errorMessage = '(500) Server Error - Please try again later';
          break;
      }
      this.alertService.show(errorMessage,'error',3700,Date.now())
    }
    console.error(errorMessage);
  }
}
