import { Routes } from '@angular/router';
import { ChallengeOptionsComponent } from './challenge-options/challenge-options.component';
import { ChallengesComponent } from './challenges/challenges.component';
import { CoursesComponent } from './courses/courses.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LessonsComponent } from './lessons/lessons.component';
import { TeamComponent } from './team/team.component';
import { UnitsComponent } from './units/units.component';
import { ErrorComponent } from '@/app/components/error/error.component';
import { errorGuard } from '@/app/guards/error.guard';

export const ADMIN_ROUTES: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    title: 'Dashboard | Linguify',
    component: DashboardComponent,
  },
  {
    path: 'courses',
    title: 'Courses | Linguify',
    component: CoursesComponent,
    loadChildren: () =>
      import('./courses/courses.routes').then((m) => m.COURSES_ROUTES),
  },
  {
    path: 'units',
    title: 'Units | Linguify',
    component: UnitsComponent,
    loadChildren: () =>
      import('./units/units.routes').then((m) => m.UNITS_ROUTES),
  },
  {
    path: 'lessons',
    title: 'Lessons | Linguify',
    component: LessonsComponent,
    loadChildren: () =>
      import('./lessons/lessons.routes').then((m) => m.LESSONS_ROUTES),
  },
  {
    path: 'challenges',
    title: 'Challenges | Linguify',
    component: ChallengesComponent,
    loadChildren: () =>
      import('./challenges/challenges.routes').then((m) => m.CHALLENGES_ROUTES),
  },
  {
    path: 'challenge-options',
    title: 'Challenge Options | Linguify',
    component: ChallengeOptionsComponent,
    loadChildren: () =>
      import('./challenge-options/challenge-options.routes').then(
        (m) => m.CHALLENGE_OPTIONS_ROUTES
      ),
  },
  { path: 'team', title: 'Team | Linguify', component: TeamComponent },
  { path: 'error', component: ErrorComponent, canActivate: [errorGuard] },
];
