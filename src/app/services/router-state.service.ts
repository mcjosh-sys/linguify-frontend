import { Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { RouterError } from '../models';

@Injectable({
  providedIn: 'root',
})
export class RouterStateService {
  private readonly exceptRoutes = ['signin', 'signout', 'error', 'not-found'];
  private readonly _state = signal<Record<string, any>>({});
  private readonly _error = signal<RouterError | null>(null);
  private readonly _afterAuthUrl = signal<string | null>(null);
  private readonly afterAuthUrlLocalStorageKey = '_afterAuthUrl';

  constructor(private readonly router: Router) {
    const afterAuthUrl = localStorage.getItem(this.afterAuthUrlLocalStorageKey);
    if (afterAuthUrl) this.afterAuthUrl = afterAuthUrl;
    this.router.events
      .pipe(
        takeUntilDestroyed(),
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        ),
        // filter((event) => this.shouldCaptureAfterAuthUrl(event)),
        filter((event) => event.urlAfterRedirects !== this.afterAuthUrl)
      )
      .subscribe((event) => {
        const route =
          event.urlAfterRedirects.split(/[?#]/)[0].split('/').pop() ?? '';
        this.afterAuthUrl = route ? event.urlAfterRedirects : null;
      });
  }

  get state() {
    return this._state();
  }

  get error() {
    return this._error();
  }

  get hasError(): boolean {
    return !!this._error();
  }

  get afterAuthUrl() {
    return this._afterAuthUrl();
  }

  private set afterAuthUrl(url: string | null) {
    if (url) this.persistAfterAuthUrl(url);
    else localStorage.removeItem(this.afterAuthUrlLocalStorageKey);
    this._afterAuthUrl.set(url);
  }

  private shouldCaptureAfterAuthUrl(event: NavigationEnd): boolean {
    const route =
      event.urlAfterRedirects.split(/[?#]/)[0].split('/').pop() ?? '';
    return !this.exceptRoutes.includes(route);
  }

  private persistAfterAuthUrl(url: string) {
    localStorage.setItem(this.afterAuthUrlLocalStorageKey, url);
  }

  setState(data: Record<string, any>) {
    this._state.set({
      ...this._state(),
      ...data,
    });
  }

  clearState() {
    this._state.set({});
  }

  setError(error: RouterError, redirectTo: string = '/error') {
    this._error.set(error);
    this.router.navigateByUrl(redirectTo, { skipLocationChange: true });
  }

  clearError() {
    this._error.set(null);
  }
}
