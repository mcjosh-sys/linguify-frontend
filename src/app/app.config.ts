import {
  APP_INITIALIZER,
  ApplicationConfig,
  isDevMode,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { firstValueFrom } from 'rxjs';
import { routes } from './app.routes';
import { CacheInterceptor } from './interceptors/caching.interceptor';
import { ClerkService } from './services/clerk.service';
import { RouterStateService } from './services/router-state.service';
import { ThemeService } from './services/theme.service';
import { exitModalReducer } from './store/reducers/exit-modal.reducer';
import { heartsModalReducer } from './store/reducers/hearts-modal.reducer';
import { mediaWidgetReducer } from './store/reducers/media-widget.reducer';
import { practiceModalReducer } from './store/reducers/practice-modal.reducer';

function initializeClerkService(clerkService: ClerkService) {
  return () =>
    firstValueFrom(clerkService.load())
      .then((value) => {
        if (value) {
          console.log('Clerk is loaded successfully');
        }
      })
      .catch((error: any) =>
        console.log('Error while loading clerk: ', error.message)
      );
}

function initializeThemeService(_themeService: ThemeService) {
  return () => new Promise<void>((resolve) => resolve());
}

function initializeRouterStateService(_routerStateService: RouterStateService) {
  return () => new Promise<void>((resolve) => resolve());
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    provideAnimations(),
    provideStore({
      exitModal: exitModalReducer,
      heartModal: heartsModalReducer,
      practiceModal: practiceModalReducer,
      mediaWidget: mediaWidgetReducer,
    }),
    ClerkService,
    { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true },
    RouterStateService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeClerkService,
      deps: [ClerkService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeThemeService,
      deps: [ThemeService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeRouterStateService,
      deps: [RouterStateService],
      multi: true,
    },
  ],
};
