import { Component, signal } from '@angular/core';
import { PageHeaderComponent } from '../components/page-header/page-header.component';
import { LoaderComponent } from '@/app/components/loader/loader.component';
import { AdminService } from '@/app/services/admin.service';
import { finalize, forkJoin } from 'rxjs';
import { CreateButtonComponent } from '../components/create-button/create-button.component';
import { GenericModalService } from '@/app/services/generic-modal.service';
import { InvitationComponent } from './components/invitation/invitation.component';
import { HlmTabsComponent, HlmTabsContentDirective, HlmTabsListComponent, HlmTabsTriggerDirective } from '@spartan-ng/ui-tabs-helm';
import { TeamListComponent } from './components/team-list/team-list.component';
import { Staff } from '@/app/models/admin.models';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [
    PageHeaderComponent,
    LoaderComponent,
    CreateButtonComponent,
    HlmTabsComponent,
    HlmTabsListComponent,
    HlmTabsTriggerDirective,
    HlmTabsContentDirective,
    TeamListComponent
  ],
  templateUrl: './team.component.html',
})
export class TeamComponent {
  protected readonly loading = signal<boolean>(true);
  protected readonly description = signal<string>('View team members');
  protected readonly isAdmin = signal<boolean>(false);
  protected readonly team = signal<Staff[]>([])

  constructor(
    private adminService: AdminService,
    private gMS: GenericModalService
  ) {
    forkJoin({
      isAdmin: this.adminService.checkIfAdmin(),
      teamData: this.adminService.getTeam()
    })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: ({ isAdmin, teamData }) => {
          if (isAdmin) {
            this.isAdmin.set(isAdmin);
            this.description.set('View and manage your team members');
          }
          this.team.set(teamData)
        },
      });
  }

  openInvitationMotal() {
    this.gMS.open({
      component: InvitationComponent,
      props: {},
      title: 'Invitation',
      description: 'Invite a member',
    });
  }
}
