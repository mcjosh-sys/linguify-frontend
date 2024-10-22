import { LoaderComponent } from '@/app/components/loader/loader.component';
import { Course } from '@/app/models/admin.models';
import { AdminService } from '@/app/services/admin.service';
import { Component, signal } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
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

  private readonly _notFoundExtras: NavigationExtras = {
    skipLocationChange: true,
    state: {
      error: {
        message: {
          title: '404: Course Not Found',
          description: "The course you're trying to access does not exist.",
        },
        redirect: {
          text: 'courses page',
          url: '/admin/courses',
        },
      },
    },
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService
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

        this.router.navigateByUrl('/admin/error', this._notFoundExtras);
        // if (err.status === 404) {
        // } else {
        //   console.error(err.message);
        // }

        return of(err);
      }),
      finalize(() => this.loading.set(false))
    );
  }
}
