import { LoaderComponent } from '@/app/components/loader/loader.component';
import { RouterError } from '@/app/models';
import { Unit } from '@/app/models/admin.models';
import { AdminService } from '@/app/services/admin.service';
import { RouterStateService } from '@/app/services/router-state.service';
import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  private readonly notFoundError: RouterError = {
    message: {
      title: '404: Unit Not Found',
      description: "The unit you're trying to access does not exist.",
    },
    redirect: {
      label: 'units page',
      url: '/admin/units',
    },
  };

  constructor(
    private readonly route: ActivatedRoute,
    private readonly routerState: RouterStateService,
    private readonly adminService: AdminService
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
        next: (res: any) => {
          this.unit.set(res.data);
        },
        error: (_err: any) => {
          this.routerState.setError(this.notFoundError, '/admin/error');
        },
      });
  }
}
