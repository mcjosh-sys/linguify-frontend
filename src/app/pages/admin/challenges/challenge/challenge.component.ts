import { LoaderComponent } from '@/app/components/loader/loader.component';
import { RouterError } from '@/app/models';
import { Challenge } from '@/app/models/admin.models';
import { AdminService } from '@/app/services/admin.service';
import { RouterStateService } from '@/app/services/router-state.service';
import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, finalize, switchMap } from 'rxjs';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { ChallengeFormComponent } from '../components/challenge-form/challenge-form.component';

@Component({
  selector: 'app-challenge',
  standalone: true,
  imports: [PageHeaderComponent, LoaderComponent, ChallengeFormComponent],
  template: `
    @if(loading()){
    <app-loader />
    }@else{
    <app-admin-page-header [title]="title()" [description]="description()" />
    <app-admin-challenge-form [data]="challenge()" />
    }
  `,
})
export class ChallengeComponent {
  protected readonly title = signal<string>('Create challenge');
  protected readonly description = signal<string>('Add a new challenge');
  protected readonly challenge = signal<Challenge | null>(null);
  protected readonly loading = signal<boolean>(false);

  private readonly notFoundError: RouterError = {
    message: {
      title: '404: Challenge Not Found',
      description: "The challenge you're trying to access does not exist.",
    },
    redirect: {
      label: 'challenges page',
      url: '/admin/challenges',
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
          this.title.set('Edit challenge');
          this.description.set('Edit challenge');
          this.loading.set(true);
          return this.adminService
            .getChallengeById(params.get('id')!)
            .pipe(finalize(() => this.loading.set(false)));
        })
      )
      .subscribe({
        next: (data) => {
          this.challenge.set(data);
        },
        error: (_err: any) => {
          this.routerState.setError(this.notFoundError, '/admin/error');
        },
      });
  }
}
