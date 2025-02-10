import { LoaderComponent } from '@/app/components/loader/loader.component';
import { Unit } from '@/app/models/admin.models';
import { AdminService } from '@/app/services/admin.service';
import { ConfirmModalService } from '@/app/services/confirm-modal.service';
import { LoadingService } from '@/app/services/loading.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { AsyncPipe, TitleCasePipe } from '@angular/common';
import {
  Component,
  computed,
  effect,
  signal,
  TrackByFunction,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import {
  lucideArrowUpDown,
  lucideChevronDown,
  lucideCopy,
  lucideEdit,
  lucideEye,
  lucideMoreHorizontal,
  lucideTrash2,
} from '@ng-icons/lucide';
import {
  HlmButtonDirective,
  HlmButtonModule,
} from '@spartan-ng/ui-button-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
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
import { toast } from 'ngx-sonner';
import {
  catchError,
  debounceTime,
  finalize,
  firstValueFrom,
  map,
  of,
  Subject,
  switchMap,
} from 'rxjs';
import { CreateButtonComponent } from '../../components/create-button/create-button.component';
import { EmptyListComponent } from '../../components/empty-list/empty-list.component';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { errorHandler } from '../../courses/components/course-form/course-form.component';

@Component({
  selector: 'app-unit-list',
  standalone: true,
  imports: [
    FormsModule,

    BrnMenuTriggerDirective,
    HlmMenuModule,

    BrnTableModule,
    HlmTableModule,

    HlmButtonModule,
    HlmButtonDirective,

    TitleCasePipe,
    HlmIconComponent,
    HlmInputDirective,

    BrnSelectModule,
    HlmSelectModule,

    RouterLink,
    AsyncPipe,

    CreateButtonComponent,
    EmptyListComponent,
    LoaderComponent,
    PageHeaderComponent,
  ],
  providers: [
    provideIcons({
      lucideChevronDown,
      lucideMoreHorizontal,
      lucideArrowUpDown,
      lucideTrash2,
      lucideEye,
      lucideCopy,
      lucideEdit,
    }),
  ],
  templateUrl: './units-list.component.html',
})
export class UnitsListComponent {
  protected _units = signal<Unit[]>([]);
  protected readonly isLoading$ = this.loadingService.isLoading;
  protected readonly fetchUnits$ = new Subject<void>();

  protected readonly _rawFilterInput = signal('');
  protected readonly _titleFilter = signal('');
  private readonly _debouncedFilter = toSignal(
    toObservable(this._rawFilterInput).pipe(debounceTime(300))
  );

  protected readonly _displayedIndices = signal({ start: 0, end: 0 });
  protected readonly _availablePageSizes = [5, 10, 15, 20, 10000];
  protected readonly _pageSize = signal(this._availablePageSizes[0]);

  protected readonly _columnManager = useBrnColumnManager({
    title: { visible: true, label: 'Title' },
    desc: { visible: true, label: 'Description' },
    lessons: { visible: true, label: 'Lessons' },
    course: { visible: true, label: 'Course' },
    order: { visible: true, label: 'Order' },
  });

  protected readonly _allDisplayedColumns = computed(() => [
    ...this._columnManager.displayedColumns(),
    'actions',
  ]);

  private readonly _filteredUnits = computed(() => {
    const titleFilter = this._titleFilter()?.trim()?.toLocaleLowerCase();
    if (titleFilter && titleFilter.length > 0) {
      return this._units().filter((u) =>
        u.title.toLocaleLowerCase().includes(titleFilter)
      );
    }
    return this._units();
  });

  private readonly _titleSort = signal<'ASC' | 'DESC' | null>(null);
  protected readonly _filteredSortedPaginatedUnits = computed(() => {
    const sort = this._titleSort();
    const start = this._displayedIndices().start;
    const end = this._displayedIndices().end + 1;
    const units = this._filteredUnits();
    if (!sort) {
      return units.slice(start, end);
    }
    return [...units]
      .sort(
        (u1, u2) => (sort === 'ASC' ? 1 : -1) * u1.title.localeCompare(u2.title)
      )
      .slice(start, end);
  });

  protected readonly _trackBy: TrackByFunction<Unit> = (_: number, u: Unit) =>
    u.id;
  protected readonly _totalElements = computed(
    () => this._filteredUnits().length
  );
  protected readonly _onStateChange = ({
    startIndex,
    endIndex,
  }: PaginatorState) =>
    this._displayedIndices.set({ start: startIndex, end: endIndex });

  constructor(
    private readonly adminService: AdminService,
    private readonly loadingService: LoadingService,
    private readonly clipboard: Clipboard,
    private readonly router: Router,
    private readonly cmService: ConfirmModalService
  ) {
    this.fetchUnits$.pipe(switchMap(() => this.handleFetch())).subscribe();

    this.fetchUnits$.next();

    effect(() => this._titleFilter.set(this._debouncedFilter() ?? ''), {
      allowSignalWrites: true,
    });
  }

  protected handleTitleSortChange() {
    const sort = this._titleSort();
    if (sort === 'ASC') {
      this._titleSort.set('DESC');
    } else if (sort === 'DESC') {
      this._titleSort.set(null);
    } else {
      this._titleSort.set('ASC');
    }
  }

  handleFetch() {
    this.loadingService.start();
    return this.adminService.getUnits().pipe(
      map((data) => {
        this._units.set(data);
      }),
      catchError((err: any) => {
        console.error(err);
        return of(err);
      }),
      finalize(() => this.loadingService.stop())
    );
  }

  onCopy(text: string) {
    const isCopied = this.clipboard.copy(text);
    if (isCopied) {
      toast.success('ID copied to clipboard');
    }
  }

  handleCreate() {
    this.router.navigate(['/admin/units/new']);
  }
  handleUpdate(unitId: number) {
    this.router.navigate(['/admin/units', unitId]);
  }

  handleDelete(unitId: string) {
    const delete$ = this.adminService.deleteUnit(unitId).pipe(
      map((data: any) => {
        if (data?.error && data.error === 'permission') {
          throw new Error(data.error);
        }
        this.fetchUnits$.next();
        return data;
      })
    );
    toast.promise(firstValueFrom(delete$), {
      loading: 'Deleting unit...',
      success: (data: any) => 'Unit deleted successfully.',
      error: errorHandler('unit', 'deleting'),
    });
  }

  confirmDelete(id: string) {
    const action = () => this.handleDelete(id);
    this.cmService.title$.next('Delete Unit');
    this.cmService.message$.next(
      'This action cannot be reversed. Are you sure you want to continue?'
    );
    this.cmService.action$.next(action.bind(this));
    this.cmService.state$.next('open');
  }
}
