import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, forkJoin, map, of } from 'rxjs';
import { AdminService } from '../services/admin.service';
import { RouterStateService } from '../services/router-state.service';
import { UserService } from '../services/user.service';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const adminService = inject(AdminService);
  const router = inject(Router);
  const routerState = inject(RouterStateService);

  return forkJoin({
    isAuth: userService.isAuthenticated,
    isStaff: adminService.checkIfStaff(),
  }).pipe(
    map(({ isAuth, isStaff }) => {
      if (isAuth) {
        if (route.queryParams['__auth']) {
          if (isStaff) {
            router.navigateByUrl('/admin');
          } else {
            router.navigateByUrl('/learn');
          }
        }
        return true;
      }

      router.navigateByUrl('/signin');
      return false;
    }),
    catchError(() => {
      routerState.setError({
        message: {
          title: 'Server Error',
          description:
            'There is something wrong with the server. Please try again later.',
        },
        redirect: {
          label: 'homepage',
          url: '/',
        },
      });
      return of(false);
    }),
  );
};
