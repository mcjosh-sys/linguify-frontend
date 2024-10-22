import { Routes } from '@angular/router';
import { LessonComponent } from './lesson.component';

export const LESSON_ROUTES: Routes = [
    { path: '', component: LessonComponent },
    {path: ':id', component: LessonComponent}
];
