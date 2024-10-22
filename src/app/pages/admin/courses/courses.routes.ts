import { Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { CourseComponent } from './course/course.component';

export const COURSES_ROUTES: Routes = [
    { path: '', component: ListComponent },
    { path: 'new', component: CourseComponent },
    { path: ':id', component: CourseComponent },
];
