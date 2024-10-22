import { PaginationComponent } from '@/app/components/pagination/pagination.component';
import { Staff } from '@/app/models/admin.models';
import {
  Component,
  computed,
  input,
  signal,
  TrackByFunction,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  PaginatorState,
  useBrnColumnManager,
} from '@spartan-ng/ui-table-brain';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-admin-team-list',
  standalone: true,
  imports: [PaginationComponent],
  templateUrl: './team-list.component.html',
  styleUrl: './team-list.component.css',
})
export class TeamListComponent {
  readonly team = input<Staff[]>([]);
  protected readonly loading = signal<boolean>(false);

  currentPage: number = 1;

  protected readonly rawFilterInput = signal('');
  protected readonly emailFilter = signal('');
  private readonly debouncedFilter = toSignal(
    toObservable(this.rawFilterInput).pipe(debounceTime(300))
  );

  protected readonly displayedIndices = signal({ start: 0, end: 0 });
  protected readonly availablePageSizes = [5, 10, 15, 20, 10000];
  protected readonly pageSize = signal(this.availablePageSizes[0]);

  protected readonly columnManager = useBrnColumnManager({
    title: { visible: true, label: 'Title' },
    imageSrc: { visible: true, label: 'Image Src' },
    units: { visible: true, label: 'Units' },
  });
  protected readonly allDisplayedColumns = computed(() => [
    ...this.columnManager.displayedColumns(),
    'actions',
  ]);

  private readonly filteredTeam = computed(() => {
    const filter = this.emailFilter()?.trim()?.toLocaleLowerCase();
    if (filter && filter.length > 0) {
      return this.team().filter((t) =>
        t.user.email.toLocaleLowerCase().includes(filter)
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
          new Date(t2.createdAt).getTime()
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

  onPageChange(page: number): void {
    console.log('Page changed to:', page);
    this.currentPage = page;
    // Fetch data based on the current page
  }
}
