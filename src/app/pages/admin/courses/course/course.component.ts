import { LoaderComponent } from '@/app/components/loader/loader.component';
import { RouterError } from '@/app/models';
import { Course } from '@/app/models/admin.models';
import { AdminService } from '@/app/services/admin.service';
import { RouterStateService } from '@/app/services/router-state.service';
import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, filter, finalize, map, of, switchMap } from 'rxjs';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { CourseFormComponent } from '../components/course-form/course-form.component';

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [PageHeaderComponent, LoaderComponent, CourseFormComponent],
  template: `
    @if(loading()){
    <app-loader />
    }@else{
    <app-admin-page-header [title]="title()" [description]="description()" />
    <app-admin-course-form [course]="course()" />
    }
  `,
})
export class CourseComponent {
  protected readonly title = signal<string>('Create course');
  protected readonly description = signal<string>('Add a new course');
  protected readonly course = signal<Course | null>(null);
  protected readonly loading = signal<boolean>(false);

  private readonly notFoundError: RouterError = {
    message: {
      title: '404: Course Not Found',
      description: "The course you're trying to access does not exist.",
    },
    redirect: {
      label: 'courses page',
      url: '/admin/courses',
    },
  };

  constructor(
    private readonly route: ActivatedRoute,
    private readonly adminService: AdminService,
    private readonly routerState: RouterStateService
  ) {
    this.route.paramMap
      .pipe(
        filter((params) => !!params.get('id')),
        switchMap((params) => {
          this.loading.set(true);
          const id = params.get('id');
          this.title.set('Edit course');
          this.description.set('Edit course');
          return this.fetchCourse(id!);
        })
      )
      .subscribe();
  }

  fetchCourse(id: string) {
    return this.adminService.getCourseById(id).pipe(
      map((data: any) => {
        const course = data as Course;
        this.course.set(course);
      }),
      catchError((err: any) => {
        console.error(err.message);

        this.routerState.setError(this.notFoundError, '/admin/error');
        return of(err);
      }),
      finalize(() => this.loading.set(false))
    );
  }
}
