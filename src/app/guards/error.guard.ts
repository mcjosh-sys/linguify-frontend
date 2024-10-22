import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const errorGuard: CanActivateFn = (_route, _state) => {
  const router = inject(Router);
  const navExtras = router.getCurrentNavigation()?.extras;

  if (!navExtras?.state && !navExtras?.state?.['error']) {
    router.navigateByUrl('/not-found', { skipLocationChange: true });
    return false;
  }
  return true;
};
