import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const apiReq = req.clone({
    setParams: {
      api_key: environment.apiKey
    }
  });
  return next(apiReq);
};
