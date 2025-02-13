import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';

export const userIdInterceptor: HttpInterceptorFn = (req, next) => {
  const loginId = localStorage.getItem('loginId');
  const token = localStorage.getItem('token');

  const modifiedReq = req.clone({
    setHeaders: {
      'X-Login-ID': loginId ? loginId : '',
      'Authorization': token ? `Bearer ${token}` : ''
    }
  });

  return next(modifiedReq);
};