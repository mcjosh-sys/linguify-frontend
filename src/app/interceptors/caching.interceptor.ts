import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CACHING_ENABLED, PAGE_URL } from '../tokens/caching-enabled.token';
import { CacheService } from '../services/cache.service';
import { environment } from '@/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CacheInterceptor implements HttpInterceptor {
  
  constructor(private cache: CacheService){}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!req.context.get(CACHING_ENABLED) || !req.headers.has('Cache-Control')) {
      return next.handle(req);
    }

    const cacheKey = req.url.split('api/')[1]
    const cachedResponse = this.cache.get(cacheKey);

    if (cachedResponse) {
      return of(cachedResponse);
    }

    return next.handle(req).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          this.cache.set(cacheKey, event);
        }
      })
    );
  }
}
