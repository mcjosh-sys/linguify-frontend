import { LoaderComponent } from '@/app/components/loader/loader.component';
import { ChallengeOption } from '@/app/models/admin.models';
import { AdminService } from '@/app/services/admin.service';
import { AudioService } from '@/app/services/audio.service';
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
  selector: 'app-challenge-options-list',
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
  templateUrl: './challenge-options-list.component.html',
})
export class ChallengeOptionsListComponent {
  protected _challengeOptions = signal<ChallengeOption[]>([]);
  protected readonly _loading$ = this.loadingService.isLoading;
  protected readonly fetchChallengeOptions$ = new Subject<void>();

  protected readonly _rawFilterInput = signal('');
  protected readonly _textFilter = signal('');
  private readonly _debouncedFilter = toSignal(
    toObservable(this._rawFilterInput).pipe(debounceTime(300))
  );

  protected readonly _displayedIndices = signal({ start: 0, end: 0 });
  protected readonly _availablePageSizes = [5, 10, 15, 20, 10000];
  protected readonly _pageSize = signal(this._availablePageSizes[0]);

  protected readonly _columnManager = useBrnColumnManager({
    text: { visible: true, label: 'Text' },
    correct: { visible: true, label: 'Correct' },
    challenge: { visible: true, label: 'Challenge' },
    audioSrc: { visible: true, label: 'Audio Source' },
    imageSrc: { visible: true, label: 'Image Source' },
  });

  protected readonly _allDisplayedColumns = computed(() => [
    ...this._columnManager.displayedColumns(),
    'actions',
  ]);

  private readonly _filteredChallengeOptions = computed(() => {
    const questionFilter = this._textFilter()?.trim()?.toLocaleLowerCase();
    if (questionFilter && questionFilter.length > 0) {
      return this._challengeOptions().filter((c) =>
        c.text.toLocaleLowerCase().includes(questionFilter)
      );
    }
    return this._challengeOptions();
  });

  private readonly _textSort = signal<'ASC' | 'DESC' | null>(null);
  protected readonly _filteredSortedPaginatedChallengeOptions = computed(() => {
    const sort = this._textSort();
    const start = this._displayedIndices().start;
    const end = this._displayedIndices().end + 1;
    const challenges = this._filteredChallengeOptions();
    if (!sort) {
      return challenges.slice(start, end);
    }
    return [...challenges]
      .sort(
        (c1, c2) => (sort === 'ASC' ? 1 : -1) * c1.text.localeCompare(c2.text)
      )
      .slice(start, end);
  });

  protected readonly _trackBy: TrackByFunction<ChallengeOption> = (
    _: number,
    c: ChallengeOption
  ) => c.id;
  protected readonly _totalElements = computed(
    () => this._filteredChallengeOptions().length
  );
  protected readonly _onStateChange = ({
    startIndex,
    endIndex,
  }: PaginatorState) =>
    this._displayedIndices.set({ start: startIndex, end: endIndex });
  constructor(
    private readonly adminService: AdminService,
    private readonly loadingService: LoadingService,
    private readonly audioService: AudioService,
    private readonly clipboard: Clipboard,
    private readonly router: Router,
    private readonly cmService: ConfirmModalService
  ) {
    this.fetchChallengeOptions$
      .pipe(switchMap(() => this.handleFetch()))
      .subscribe();

    this.fetchChallengeOptions$.next();
    effect(() => this._textFilter.set(this._debouncedFilter() ?? ''), {
      allowSignalWrites: true,
    });
  }

  handleFetch() {
    this.loadingService.start();
    return this.adminService.getChallengeOptions().pipe(
      map((data) => this._challengeOptions.set(data)),
      catchError((err: any) => {
        console.error(err);
        return of(err);
      }),
      finalize(() => this.loadingService.stop())
    );
  }

  protected handleTextSortChange() {
    const sort = this._textSort();
    if (sort === 'ASC') {
      this._textSort.set('DESC');
    } else if (sort === 'DESC') {
      this._textSort.set(null);
    } else {
      this._textSort.set('ASC');
    }
  }

  onCopy(text: string) {
    const isCopied = this.clipboard.copy(text);
    if (isCopied) {
      toast.success('ID copied to clipboard');
    }
  }

  openLink(url: string) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  playAudio(src: string) {
    this.audioService.play(src);
  }

  handleCreate() {
    this.router.navigate(['/admin/challenge-options/new']);
  }
  handleUpdate(id: number) {
    this.router.navigate(['/admin/challenge-options', id]);
  }

  handleDelete(challengeOptionId: string) {
    const delete$ = this.adminService
      .deleteChallengeOption(challengeOptionId)
      .pipe(
        map((data: any) => {
          if (data?.error && data.error === 'permission') {
            throw new Error(data.error);
          }
          this.fetchChallengeOptions$.next();
          return data;
        })
      );
    toast.promise(firstValueFrom(delete$), {
      loading: 'Deleting challenge...',
      success: (_data: any) => 'Challenge option deleted successfully',
      error: errorHandler('challenge option', 'deleting'),
    });
  }
  confirmDelete(id: string) {
    const action = () => this.handleDelete(id);
    this.cmService.title$.next('Delete Challenge Option');
    this.cmService.message$.next(
      'This action cannot be reversed. Are you sure you want to continue?'
    );
    this.cmService.action$.next(action.bind(this));
    this.cmService.state$.next('open');
  }
}
