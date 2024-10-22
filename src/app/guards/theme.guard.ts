import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { ThemeService } from '../services/theme.service';

export const themeGuard: CanActivateFn = (route, state) => {
  const themeService = inject(ThemeService)
  if (route.url[0].path === 'admin') {
    
  }
  return true;
};
