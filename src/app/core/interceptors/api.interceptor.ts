import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  // Solo agregar api_key a peticiones dirigidas a la API de TMDB
  if (req.url.includes('api.themoviedb.org') || req.url.includes(environment.apiUrl)) {
    const apiReq = req.clone({
      setParams: {
        api_key: environment.apiKey
      }
    });
    return next(apiReq);
  }
  return next(req);
};
