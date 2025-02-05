import { LoaderComponent } from '@/app/components/loader/loader.component';
import { Lesson } from '@/app/models/admin.models';
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
  selector: 'app-lesson-list',
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
  templateUrl: './lessons-list.component.html',
})
export class LessonsListComponent {
  protected readonly _lessons = signal<Lesson[]>([]);
  protected readonly _loading$ = this.loadingService.isLoading;
  protected readonly fetchLessons$ = new Subject<void>();

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
    challenges: { visible: true, label: 'Challenges' },
    unit: { visible: true, label: 'Unit' },
    order: { visible: true, label: 'Order' },
  });

  protected readonly _allDisplayedColumns = computed(() => [
    ...this._columnManager.displayedColumns(),
    'actions',
  ]);

  private readonly _filteredLessons = computed(() => {
    const titleFilter = this._titleFilter()?.trim()?.toLocaleLowerCase();
    if (titleFilter && titleFilter.length > 0) {
      return this._lessons().filter((l) =>
        l.title.toLocaleLowerCase().includes(titleFilter)
      );
    }
    return this._lessons();
  });

  private readonly _titleSort = signal<'ASC' | 'DESC' | null>(null);
  protected readonly _filteredSortedPaginatedLessons = computed(() => {
    const sort = this._titleSort();
    const start = this._displayedIndices().start;
    const end = this._displayedIndices().end + 1;
    const units = this._filteredLessons();
    if (!sort) {
      return units.slice(start, end);
    }
    return [...units]
      .sort(
        (u1, u2) => (sort === 'ASC' ? 1 : -1) * u1.title.localeCompare(u2.title)
      )
      .slice(start, end);
  });

  protected readonly _trackBy: TrackByFunction<Lesson> = (
    _: number,
    l: Lesson
  ) => l.id;
  protected readonly _totalElements = computed(
    () => this._filteredLessons().length
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
    this.fetchLessons$.pipe(switchMap(() => this.handleFetch())).subscribe();
    this.fetchLessons$.next();
    effect(() => this._titleFilter.set(this._debouncedFilter() ?? ''), {
      allowSignalWrites: true,
    });
  }

  handleFetch() {
    this.loadingService.start();
    return this.adminService.getLessons().pipe(
      map((res: any) => this._lessons.set(res.data)),
      catchError((err: any) => {
        console.error(err);
        return of(err);
      }),
      finalize(() => this.loadingService.stop())
    );
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

  onCopy(text: string) {
    const isCopied = this.clipboard.copy(text);
    if (isCopied) {
      toast.success('ID copied to clipboard');
    }
  }

  handleCreate() {
    this.router.navigate(['/admin/lessons/new']);
  }
  handleUpdate(lessonId: string) {
    this.router.navigate(['/admin/lessons', lessonId]);
  }

  handleDelete(lessonId: string) {
    const delete$ = this.adminService.deleteLesson(lessonId).pipe(
      map((data: any) => {
        if (data?.error && data.error === 'permission') {
          throw new Error(data.error);
        }
        this.fetchLessons$.next();
        return data;
      })
    );
    toast.promise(firstValueFrom(delete$), {
      loading: 'Deleting lesson...',
      success: (_data: any) => "Lesson deleted successfully.",
      error: errorHandler('lesson', 'deleting'),
    });
  }

  confirmDelete(id: string) {
    const action = () => this.handleDelete(id);
    this.cmService.title$.next('Delete Lesson');
    this.cmService.message$.next(
      'This action cannot be reversed. Are you sure you want to continue?'
    );
    this.cmService.action$.next(action.bind(this));
    this.cmService.state$.next('open');
  }
}
