import { Routes } from '@angular/router';
import { HomeComponent } from '@pages/home/home.component';
import { ErrorComponent } from './components/error/error.component';
import { authGuard } from './guards/auth.guard';
import { errorGuard } from './guards/error.guard';
import { AdminComponent } from './pages/admin/admin.component';
import { MainComponent } from './pages/main/main.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: '',
    component: MainComponent,
    canActivateChild: [authGuard],
    loadChildren: () =>
      import('@pages/main/main.routes').then((m) => m.MAIN_ROUTES),
  },
  {
    path: 'lesson',
    canActivateChild: [authGuard],
    loadChildren: () =>
      import('@pages/lesson/lesson.routes').then((m) => m.LESSON_ROUTES),
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    loadChildren: () =>
      import('@pages/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  { path: 'error', component: ErrorComponent, canActivate: [errorGuard] },
  { path: 'signin', component: SignInComponent },
  { path: 'signup', component: SignUpComponent },
  { path: '**', component: NotFoundComponent },
];
