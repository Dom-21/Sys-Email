import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // console.log('Intercepted Request:', req.url); // Log request to verify
  const token = localStorage.getItem('token');

  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        AuthorizationToken: `Bearer Token '${token}'`
      }
    });
    console.log('Token Added:', token);
    return next(clonedReq);
  }

  return next(req);
};


export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError(error => {
      console.error('API Error:', error);
      return throwError(() => error);
    })
  );
};