import { Staff } from '@/app/models/admin.models';
import { GenericModalService } from '@/app/services/generic-modal.service';
import { UserService } from '@/app/services/user.service';
import {
  Component,
  computed,
  effect,
  input,
  signal,
  TrackByFunction,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { lucideCog, lucideEye, lucideMoreHorizontal } from '@ng-icons/lucide';
import {
  HlmAvatarComponent,
  HlmAvatarFallbackDirective,
  HlmAvatarImageDirective,
} from '@spartan-ng/ui-avatar-helm';
import {
  HlmButtonDirective,
  HlmButtonModule,
} from '@spartan-ng/ui-button-helm';
import { hlm } from '@spartan-ng/ui-core';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { BrnMenuTriggerDirective } from '@spartan-ng/ui-menu-brain';
import { HlmMenuModule } from '@spartan-ng/ui-menu-helm';
import { BrnSelectModule } from '@spartan-ng/ui-select-brain';
import { HlmSelectModule } from '@spartan-ng/ui-select-helm';
import {
  BrnTableModule,
  PaginatorState,
  useBrnColumnManager,
} from '@spartan-ng/ui-table-brain';
import { HlmTableModule } from '@spartan-ng/ui-table-helm';
import { debounceTime } from 'rxjs';
import { SettingsComponent } from '../settings/settings.component';

@Component({
  selector: 'app-admin-team-list',
  standalone: true,
  imports: [
    FormsModule,

    HlmAvatarFallbackDirective,
    HlmAvatarComponent,
    HlmAvatarImageDirective,

    BrnMenuTriggerDirective,
    HlmMenuModule,

    BrnTableModule,
    HlmTableModule,

    HlmButtonModule,
    HlmButtonDirective,
    HlmIconComponent,
    HlmInputDirective,

    BrnSelectModule,
    HlmSelectModule,
  ],
  providers: [provideIcons({ lucideMoreHorizontal, lucideCog, lucideEye })],
  templateUrl: './team-list.component.html',
  styleUrl: './team-list.component.css',
})
export class TeamListComponent {
  readonly team = input<Staff[]>([]);
  readonly isAdmin = input<boolean>(false);
  protected readonly loading = signal<boolean>(true);
  protected readonly currentUserId = signal(this.userService.currentUser?.id);

  protected readonly rawFilterInput = signal('');
  protected readonly filter = signal('');
  private readonly debouncedFilter = toSignal(
    toObservable(this.rawFilterInput).pipe(debounceTime(300)),
  );

  protected readonly displayedIndices = signal({ start: 0, end: 0 });
  protected readonly availablePageSizes = [5, 10, 15, 20, 10000];
  protected readonly pageSize = signal(this.availablePageSizes[0]);

  protected readonly columnManager = useBrnColumnManager({
    name: { visible: true, label: 'Name' },
    role: { visible: true, label: 'Role' },
    email: { visible: true, label: 'Email' },
    joined: { visible: true, label: 'Joined' },
  });
  protected readonly allDisplayedColumns = computed(() => [
    ...this.columnManager.displayedColumns(),
    'actions',
  ]);

  private readonly filteredTeam = computed(() => {
    const filter = this.filter()?.trim()?.toLocaleLowerCase();
    if (filter && filter.length > 0) {
      return this.team().filter((t) =>
        t.user.firstName
          .concat(' ' + t.user.lastName)
          .toLocaleLowerCase()
          .includes(filter),
      );
    }
    return this.team();
  });
  private readonly dateSort = signal<'ASC' | 'DESC' | null>(null);
  protected readonly filteredSortedPaginatedTeam = computed(() => {
    const sort = this.dateSort();
    const start = this.displayedIndices().start;
    const end = this.displayedIndices().end + 1;
    const team = this.filteredTeam();
    if (!sort) {
      return team.slice(start, end);
    }
    return [...team]
      .sort(
        (t1, t2) =>
          (sort === 'ASC' ? 1 : -1) * new Date(t1.createdAt).getTime() -
          new Date(t2.createdAt).getTime(),
      )
      .slice(start, end);
  });

  protected readonly trackBy: TrackByFunction<Staff> = (_: number, s: Staff) =>
    s.id;
  protected readonly totalElements = computed(() => this.filteredTeam().length);
  protected readonly onStateChange = ({
    startIndex,
    endIndex,
  }: PaginatorState) =>
    this.displayedIndices.set({ start: startIndex, end: endIndex });

  protected readonly hlm = hlm;

  constructor(
    private readonly userService: UserService,
    private readonly genericModal: GenericModalService,
  ) {
    effect(() => this.filter.set(this.debouncedFilter() ?? ''), {
      allowSignalWrites: true,
    });
  }

  openSettingsModal(staff: Staff) {
    this.genericModal.open({
      title:
        this.isAdmin() && this.currentUserId() !== staff.userId
          ? 'User Settings'
          : 'User Information',
      description:
        this.isAdmin() && this.currentUserId() !== staff.userId
          ? 'View and manage user settings'
          : 'View user information',
      component: SettingsComponent,
      props: {
        staff,
        isAdmin: this.isAdmin(),
        isCurrentUser: this.currentUserId() === staff.userId,
      },
    });
  }

  isoStringToDate(date: string) {
    return new Date(date);
  }
}
