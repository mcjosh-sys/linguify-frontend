import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, of, switchMap } from 'rxjs';
import { RouterError } from '../models';
import { AdminService } from '../services/admin.service';
import { RouterStateService } from '../services/router-state.service';
import { UserService } from '../services/user.service';

export const adminGuard: CanActivateFn = (_route, _state) => {
  const router = inject(Router);
  const routerState = inject(RouterStateService);
  const userService = inject(UserService);
  const adminService = inject(AdminService);

  const unauthorized: RouterError = {
    message: {
      title: '403 Unauthorized',
      description: 'You are not authorized to access this page.',
    },
    redirect: {
      label: 'Learn Page',
      url: '/learn',
    },
  };

  return userService.isAuthenticated
    .pipe(
      switchMap((isAuthenticated) => {
        if (isAuthenticated) {
          return adminService
            .checkIfStaff()
        }
        router.navigateByUrl('/signin');
        return of(false);
      })
    )
    .pipe(
      map((isAdmin) => {
        if (isAdmin) {
          return true;
        }
        routerState.setError(unauthorized);
        return false;
      })
    );
};
