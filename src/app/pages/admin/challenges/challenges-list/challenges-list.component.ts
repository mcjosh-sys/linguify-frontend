import { LoaderComponent } from '@/app/components/loader/loader.component';
import { Challenge } from '@/app/models/admin.models';
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
  selector: 'app-challenges-list',
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
  templateUrl: './challenges-list.component.html',
})
export class ChallengesListComponent {
  protected _challenges = signal<Challenge[]>([]);
  protected readonly _loading$ = this.loadingService.isLoading;
  protected readonly fetchChallenges$ = new Subject<void>();

  protected readonly _rawFilterInput = signal('');
  protected readonly _questionFilter = signal('');
  private readonly _debouncedFilter = toSignal(
    toObservable(this._rawFilterInput).pipe(debounceTime(300))
  );

  protected readonly _displayedIndices = signal({ start: 0, end: 0 });
  protected readonly _availablePageSizes = [5, 10, 15, 20, 10000];
  protected readonly _pageSize = signal(this._availablePageSizes[0]);

  protected readonly _columnManager = useBrnColumnManager({
    question: { visible: true, label: 'Question' },
    type: { visible: true, label: 'Type' },
    options: { visible: true, label: 'Options' },
    lesson: { visible: true, label: 'Lesson' },
    order: { visible: true, label: 'Order' },
  });

  protected readonly _allDisplayedColumns = computed(() => [
    ...this._columnManager.displayedColumns(),
    'actions',
  ]);

  private readonly _filteredChallenges = computed(() => {
    const questionFilter = this._questionFilter()?.trim()?.toLocaleLowerCase();
    if (questionFilter && questionFilter.length > 0) {
      return this._challenges().filter((c) =>
        c.question.toLocaleLowerCase().includes(questionFilter)
      );
    }
    return this._challenges();
  });

  private readonly _questionSort = signal<'ASC' | 'DESC' | null>(null);
  protected readonly _filteredSortedPaginatedChallenges = computed(() => {
    const sort = this._questionSort();
    const start = this._displayedIndices().start;
    const end = this._displayedIndices().end + 1;
    const challenges = this._filteredChallenges();
    if (!sort) {
      return challenges.slice(start, end);
    }
    return [...challenges]
      .sort(
        (c1, c2) =>
          (sort === 'ASC' ? 1 : -1) * c1.question.localeCompare(c2.question)
      )
      .slice(start, end);
  });

  protected readonly _trackBy: TrackByFunction<Challenge> = (
    _: number,
    c: Challenge
  ) => c.id;
  protected readonly _totalElements = computed(
    () => this._filteredChallenges().length
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
    this.fetchChallenges$.pipe(switchMap(() => this.handleFetch())).subscribe();

    this.fetchChallenges$.next();

    effect(() => this._questionFilter.set(this._debouncedFilter() ?? ''), {
      allowSignalWrites: true,
    });
  }

  handleFetch() {
    this.loadingService.start();
    return this.adminService.getChallenges().pipe(
      map((data: any) => this._challenges.set(data)),
      catchError((err: any) => {
        console.error(err);
        return of(err);
      }),
      finalize(() => this.loadingService.stop())
    );
  }

  protected handleQuestionSortChange() {
    const sort = this._questionSort();
    if (sort === 'ASC') {
      this._questionSort.set('DESC');
    } else if (sort === 'DESC') {
      this._questionSort.set(null);
    } else {
      this._questionSort.set('ASC');
    }
  }

  onCopy(text: string) {
    const isCopied = this.clipboard.copy(text);
    if (isCopied) {
      toast.success('ID copied to clipboard');
    }
  }

  handleCreate() {
    this.router.navigate(['/admin/challenges/new']);
  }
  handleUpdate(challengeId: number) {
    this.router.navigate(['/admin/challenges', challengeId]);
  }

  handleDelete(challengeId: string) {
    const delete$ = this.adminService.deleteChallenge(challengeId).pipe(
      map((data: any) => {
        if (data?.error && data.error === 'permission') {
          throw new Error(data.error);
        }
        this.fetchChallenges$.next();
        return data;
      })
    );
    toast.promise(firstValueFrom(delete$), {
      loading: 'Deleting challenge...',
      success: (data: any) => data,
      error: errorHandler('challenge', 'deleting'),
    });
  }

  confirmDelete(id: string) {
    const action = () => this.handleDelete(id);
    this.cmService.title$.next('Delete Challenge');
    this.cmService.message$.next(
      'This action cannot be reversed. Are you sure you want to continue?'
    );
    this.cmService.action$.next(action.bind(this));
    this.cmService.state$.next('open');
  }
}
