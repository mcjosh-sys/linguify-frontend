import { LoaderComponent } from '@/app/components/loader/loader.component';
import { Staff } from '@/app/models/admin.models';
import { AdminService } from '@/app/services/admin.service';
import { GenericModalService } from '@/app/services/generic-modal.service';
import { Component, signal } from '@angular/core';
import {
  HlmTabsComponent,
  HlmTabsContentDirective,
  HlmTabsListComponent,
  HlmTabsTriggerDirective,
} from '@spartan-ng/ui-tabs-helm';
import { finalize, forkJoin } from 'rxjs';
import { CreateButtonComponent } from '../components/create-button/create-button.component';
import { PageHeaderComponent } from '../components/page-header/page-header.component';
import { InvitationComponent } from './components/invitation/invitation.component';
import { TeamListComponent } from './components/team-list/team-list.component';

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
    TeamListComponent,
  ],
  templateUrl: './team.component.html',
})
export class TeamComponent {
  protected readonly loading = signal<boolean>(true);
  protected readonly description = signal<string>('View team members');
  protected readonly isAdmin = signal<boolean>(false);
  protected readonly team = signal<Staff[]>([]);

  constructor(
    private readonly adminService: AdminService,
    private readonly gm: GenericModalService,
  ) {
    forkJoin({
      isAdmin: this.adminService.checkIfAdmin(),
      teamData: this.adminService.getTeam(),
    })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: ({ isAdmin, teamData }) => {
          if (isAdmin) {
            this.isAdmin.set(isAdmin);
            this.description.set('View and manage your team members');
          }
          this.team.set(teamData);
        },
      });
  }

  openInvitationMotal() {
    this.gm.open({
      component: InvitationComponent,
      props: {},
      title: 'Invitation',
      description: 'Invite a member',
    });
  }
}
