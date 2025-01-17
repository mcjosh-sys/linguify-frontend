import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, forkJoin, map } from 'rxjs';
import { AdminService } from '../services/admin.service';
import { UserService } from '../services/user.service';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const adminService = inject(AdminService);
  const router = inject(Router);
  
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
    catchError(() => router.navigateByUrl('/signin'))
  );
};
