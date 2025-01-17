import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RouterStateService } from '../services/router-state.service';

export const errorGuard: CanActivateFn = (_route, _state) => {
  const router = inject(Router);
  const routerState = inject(RouterStateService);

  if (!routerState.hasError) {
    router.navigateByUrl('/not-found', { skipLocationChange: true });
    return false;
  }
  return true;
};
