import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, map } from 'rxjs';
import { CacheService } from './cache.service';
import { UrlService } from './url.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  constructor(
    private userService: UserService,
    private urlService: UrlService,
    private http: HttpClient,
    private cache: CacheService
  ) {}

  createStripeUrl() {
    this.userService.verifyAuth();

    return this.http
      .post(this.urlService.stripe.post.createStripeUrl(), {
        email: this.userService.currentUser?.emailAddresses[0].emailAddress,
      })
      .pipe(
        map((res: any) => res.data as string),
        finalize(() => {
          this.cache.invalidateCache(
            this.urlService.user.get.subscriptionUrl()
          );
        })
      );
  }
}
