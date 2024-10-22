import { Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';

const authUrls = ['/signin', '/signout']
@Injectable({
  providedIn: 'root',
})
export class RouterStateService {
  private readonly _previousUrl = signal<string | undefined>(undefined);
  private readonly _currentUrl = signal<string | undefined>(undefined);
  private readonly _authUrl = signal<string | undefined>(undefined);

  constructor(private router: Router) {
    this.router.events
      .pipe(
        takeUntilDestroyed(),
        filter(
          (event) => event instanceof NavigationEnd),
          filter((event:any) => !authUrls.includes(event.url))
    )
      .subscribe((event: any) => {
        this._previousUrl.set(this._currentUrl());
        this._currentUrl.set(event.url);
        if (this._previousUrl() === this._currentUrl()) {
          this._previousUrl.set(undefined)
        }
      });
  }

  get previousUrl() {
    return this._previousUrl();
  }
}
