import { LoaderComponent } from '@/app/components/loader/loader.component';
import { Lesson } from '@/app/models/admin.models';
import { AdminService } from '@/app/services/admin.service';
import { Component, signal } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { filter, finalize, switchMap } from 'rxjs';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { LessonFormComponent } from '../components/lesson-form/lesson-form.component';

@Component({
  selector: 'app-lesson',
  standalone: true,
  imports: [PageHeaderComponent, LoaderComponent, LessonFormComponent],
  template: `
    @if(loading()){
    <app-loader />
    }@else{
    <app-admin-page-header [title]="title()" [description]="description()" />
    <app-admin-lesson-form [data]="lesson()" />
    }
  `,
})
export class LessonComponent {
  protected readonly title = signal<string>('Create lesson');
  protected readonly description = signal<string>('Add a new lesson');
  protected readonly lesson = signal<Lesson | null>(null);
  protected readonly loading = signal<boolean>(false);

  private readonly _navigationExtras: NavigationExtras = {
    skipLocationChange: true,
    state: {
      error: {
        message: {
          title: '404: Lesson Not Found',
          description: "The lesson you're trying to access does not exist.",
        },
        redirect: {
          text: 'lessons page',
          url: '/admin/lessons',
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
          this.title.set('Edit lesson');
          this.description.set('Edit lesson');
          this.loading.set(true);
          return this.adminService
            .getLessonById(params.get('id')!)
            .pipe(finalize(() => this.loading.set(false)));
        })
      )
      .subscribe({
        next: (data: any) => {
          this.lesson.set(data);
        },
        error: (_err: any) => {
          this.router.navigateByUrl('/admin/error', this._navigationExtras);
          // if (err.status === 404) {
          //   this.router.navigateByUrl('notfound', { skipLocationChange: true });
          // } else {
          //   console.log(err.message);
          // }
        },
      });
  }
}
