import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('auth_token');

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      },
      withCredentials: true // ✅ Chính xác ở đây
    });
  } else {
    req = req.clone({ withCredentials: true }); // Nếu không có token nhưng vẫn cần credentials
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.log('Unauthorized access - redirecting to login');

        // Thêm xử lý điều hướng hoặc logout ở đây nếu cần
      }
      return throwError(() => error);
    })
  );
};
