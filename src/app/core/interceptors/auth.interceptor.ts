import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { inject } from '@angular/core';
import { AlertService } from '../services/alert.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  let alertService = inject(AlertService)
  req = req.clone({ withCredentials: true });
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        alertService.show("Unauthorized access - redirecting to login");
        // Thêm xử lý điều hướng hoặc logout ở đây nếu cần
      }

      return throwError(() => error);
    })
  );
};
