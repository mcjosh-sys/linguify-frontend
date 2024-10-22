import { Routes } from '@angular/router';
import { CoursesComponent } from './courses/courses.component';
import { LearnComponent } from './learn/learn.component';
import { ShopComponent } from './shop/shop.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { QuestsComponent } from './quests/quests.component';

export const MAIN_ROUTES: Routes = [
  {
    path: 'learn',
    component: LearnComponent,
  },
  {
    path: 'courses',
    component: CoursesComponent,
  },
  {
    path: 'shop',
    component: ShopComponent,
  },
  {
    path: 'leaderboard',
    component: LeaderboardComponent,
  },
  {
    path: 'quests',
    component: QuestsComponent,
  },
];
