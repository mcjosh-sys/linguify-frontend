import { Routes } from '@angular/router';
import { LessonComponent } from './lesson/lesson.component';
import { LessonsListComponent } from './lessons-list/lessons-list.component';

export const LESSONS_ROUTES: Routes = [
  { path: '', component: LessonsListComponent },
  { path: 'new', component: LessonComponent },
  { path: ':id', component: LessonComponent },
];
