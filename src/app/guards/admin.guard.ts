import { inject } from '@angular/core';
import { CanActivateFn, NavigationExtras, Router } from '@angular/router';
import { map, of, switchMap } from 'rxjs';
import { AdminService } from '../services/admin.service';
import { UserService } from '../services/user.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userService = inject(UserService);
  const adminService = inject(AdminService);

  const unauthorizedExtras: NavigationExtras = {
    skipLocationChange: true,
    state: {
      error: {
        message: {
          title: '403 Unauthorized',
          description: 'You are not authorized to access this page.',
        },
        redirect: {
          text: 'Learn Page',
          url: '/learn',
        },
      },
    },
  };

  return userService.isAuthenticated
    .pipe(
      switchMap((isAuthenticated) => {
        if (isAuthenticated) {
          return adminService
            .checkIfStaff()
            .pipe(map((data: any) => data.isAdmin));
        }

        const navExtras: NavigationExtras = {
          state: {
            returnUrl: state.url,
          },
        };
        router.navigateByUrl('/signin', navExtras);
        return of(false);
      })
    )
    .pipe(
      map((isAdmin) => {
        if (isAdmin) {
          return true;
        }
        router.navigate(['/error'], unauthorizedExtras);
        return false;
      })
    );
};
