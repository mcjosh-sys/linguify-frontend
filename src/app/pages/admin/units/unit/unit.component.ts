import { LoaderComponent } from '@/app/components/loader/loader.component';
import { Unit } from '@/app/models/admin.models';
import { AdminService } from '@/app/services/admin.service';
import { Component, signal } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { filter, finalize, switchMap } from 'rxjs';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { UnitFormComponent } from '../components/unit-form/unit-form.component';

@Component({
  selector: 'app-unit',
  standalone: true,
  imports: [PageHeaderComponent, LoaderComponent, UnitFormComponent],
  template: `
    @if(loading()){
    <app-loader />
    }@else{
    <app-admin-page-header [title]="title()" [description]="description()" />
    <app-admin-unit-form [data]="unit()" />
    }
  `,
})
export class UnitComponent {
  protected readonly title = signal<string>('Create unit');
  protected readonly description = signal<string>('Add a new unit');
  protected readonly unit = signal<Unit | null>(null);
  protected readonly loading = signal<boolean>(false);

  private readonly _navigationExtras: NavigationExtras = {
    skipLocationChange: true,
    state: {
      error: {
        message: {
          title: '404: Unit Not Found',
          description: "The unit you're trying to access does not exist.",
        },
        redirect: {
          text: 'units page',
          url: '/admin/units',
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
          this.title.set('Edit unit');
          this.description.set('Edit unit');
          this.loading.set(true);
          return this.adminService
            .getUnitById(params.get('id')!)
            .pipe(finalize(() => this.loading.set(false)));
        })
      )
      .subscribe({
        next: (data: any) => {
          this.unit.set(data);
        },
        error: (_err: any) => {
          this.router.navigateByUrl('/admin/error', this._navigationExtras);
          // if (err.status === 404) {
          // } else {
          //   console.error(err.message);
          // }
        },
      });
  }
}
