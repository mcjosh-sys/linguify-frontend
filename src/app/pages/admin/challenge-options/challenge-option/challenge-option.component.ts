import { LoaderComponent } from '@/app/components/loader/loader.component';
import { ChallengeOption } from '@/app/models/admin.models';
import { AdminService } from '@/app/services/admin.service';
import { Component, signal } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { filter, finalize, switchMap, tap } from 'rxjs';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { ChallengeOptionFormComponent } from '../components/challenge-option-form/challenge-option-form.component';

@Component({
  selector: 'app-challenge-option',
  standalone: true,
  imports: [PageHeaderComponent, LoaderComponent, ChallengeOptionFormComponent],
  template: `
    @if(loading()){
    <app-loader />
    }@else{
    <app-admin-page-header [title]="title()" [description]="description()" />
    <app-admin-challenge-option-form [data]="challengeOption()" />
    }
  `,
})
export class ChallengeOptionComponent {
  protected readonly title = signal<string>('Create option');
  protected readonly description = signal<string>('Add a new challenge option');
  protected readonly challengeOption = signal<ChallengeOption | null>(null);
  protected readonly loading = signal<boolean>(false);

  private readonly _navigationExtras: NavigationExtras = {
    skipLocationChange: true,
    state: {
      error: {
        message: {
          title: '404: Option Not Found',
          description: "The challenge option you're trying to access does not exist.",
        },
        redirect: {
          text: 'challenge options page',
          url: '/admin/challenge-options',
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
          this.title.set('Edit Option');
          this.description.set('Edit challenge option');
          this.loading.set(true);
          return this.adminService.getChallengeByOptionId(params.get('id')!).pipe(finalize(() => this.loading.set(false)));
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: (data: any) => {
          this.challengeOption.set(data);
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
