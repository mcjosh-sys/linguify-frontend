import { Routes } from '@angular/router';
import { ChallengeComponent } from './challenge/challenge.component';
import { ChallengesListComponent } from './challenges-list/challenges-list.component';

export const CHALLENGES_ROUTES: Routes = [
  { path: '', component: ChallengesListComponent },
  { path: 'new', component: ChallengeComponent },
  { path: ':id', component: ChallengeComponent },
];
