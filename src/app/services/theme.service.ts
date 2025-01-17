import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  inject,
  Injectable,
  PLATFORM_ID,
  RendererFactory2,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, distinctUntilChanged, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _renderer = inject(RendererFactory2).createRenderer(null, null);
  private readonly _document = inject(DOCUMENT);

  private readonly _theme$ = new ReplaySubject<'light' | 'dark'>(1);
  public theme$ = this._theme$.asObservable();

  private _isDarkMode = false;

  private readonly _shouldDisableDarkMode$ = new BehaviorSubject<boolean>(false);

  constructor(private readonly router: Router) {
    this.syncThemeFromLocalStorage();
    this.toggleClassOnThemeChanges();

    this._shouldDisableDarkMode$
      .asObservable()
      .pipe(takeUntilDestroyed(), distinctUntilChanged())
      .subscribe((value) => {
        if (this._isDarkMode) {
          if (value) {
            this._renderer.removeClass(this._document.documentElement, 'dark');
            // console.log('dark mode is disabled')
          } else {
            this._renderer.addClass(this._document.documentElement, 'dark');
          }
        }
      });

    this.router.events.pipe(takeUntilDestroyed()).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const isAdminRoute = event.url.split('/')[1] === 'admin';
        if (isAdminRoute) {
          this._shouldDisableDarkMode$.next(false);
        } else {
          this._shouldDisableDarkMode$.next(true);
        }
      }
    });
  }

  private syncThemeFromLocalStorage(): void {
    if (isPlatformBrowser(this._platformId)) {
      const storedTheme = localStorage.getItem('theme') ?? 'light';
      this._isDarkMode = storedTheme === 'dark';
      this._theme$.next(
        localStorage.getItem('theme') === 'dark' ? 'dark' : 'light'
      );
    }
  }

  private toggleClassOnThemeChanges(): void {
    this.theme$.pipe(takeUntilDestroyed()).subscribe((theme) => {
      if (theme === 'dark') {
        this._renderer.addClass(this._document.documentElement, 'dark');
        this._isDarkMode = true;
      } else {
        if (this._isDarkMode)
          this._renderer.removeClass(this._document.documentElement, 'dark');
        this._isDarkMode = false;
      }
    });
  }

  toggleDarkMode(): void {
    const newTheme =
      localStorage.getItem('theme') === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    this._theme$.next(newTheme);
  }
}
