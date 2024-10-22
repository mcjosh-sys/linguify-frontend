import { LoaderComponent } from '@/app/components/loader/loader.component';
import { Media } from '@/app/models/admin.models';
import { AudioService } from '@/app/services/audio.service';
import { CloudinaryService } from '@/app/services/cloudinary.service';
import { MediaBucketService } from '@/app/services/media-bucket.service';
import { MediaType } from '@/app/store/reducers/media-widget.reducer';
import { AsyncPipe, NgClass, NgStyle } from '@angular/common';
import {
  Component,
  computed,
  EventEmitter,
  Input,
  Output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { provideIcons } from '@ng-icons/core';
import {
  lucideFilePlus2,
  lucideImagePlus,
  lucideIterationCcw,
  lucideLoader2,
  lucideTrash,
  lucideUpload,
} from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import {
  BrnDialogContentDirective,
  BrnDialogState,
} from '@spartan-ng/ui-dialog-brain';
import {
  HlmDialogComponent,
  HlmDialogContentComponent,
  HlmDialogDescriptionDirective,
  HlmDialogFooterComponent,
  HlmDialogHeaderComponent,
  HlmDialogTitleDirective,
} from '@spartan-ng/ui-dialog-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { BrnSeparatorComponent } from '@spartan-ng/ui-separator-brain';
import { HlmSeparatorDirective } from '@spartan-ng/ui-separator-helm';
import { debounceTime, distinctUntilChanged, Observable } from 'rxjs';

@Component({
  selector: 'app-media-widget',
  standalone: true,
  imports: [
    NgClass,
    NgStyle,
    AsyncPipe,
    ReactiveFormsModule,
    BrnDialogContentDirective,
    HlmDialogComponent,
    HlmDialogContentComponent,
    HlmDialogDescriptionDirective,
    HlmDialogFooterComponent,
    HlmDialogHeaderComponent,
    HlmDialogTitleDirective,
    HlmButtonDirective,
    HlmIconComponent,
    HlmInputDirective,
    HlmSeparatorDirective,
    BrnSeparatorComponent,
    LoaderComponent,
  ],
  providers: [
    provideIcons({
      lucideFilePlus2,
      lucideImagePlus,
      lucideTrash,
      lucideUpload,
      lucideIterationCcw,
      lucideLoader2,
    }),
  ],
  templateUrl: './media-widget.component.html',
})
export class MediaWidgetComponent {
  protected readonly state = signal<BrnDialogState>('closed');
  protected readonly selectedItem = signal<Media | null>(null);
  protected readonly toBeSelectedItem = signal<Media | null>(null);

  protected media$!: Observable<Media[]>;
  protected isMediaLoading$ = this.mediaBucket.loading$;
  protected readonly audioState = toSignal(this.audioService.state$);

  protected readonly mediaType = signal<MediaType>('image');
  protected readonly _value = signal<string>('');

  protected readonly isImage = signal<boolean>(false);

  protected readonly _bgImage = computed(() =>
    this.mediaType() === 'image' ? this._value() : '/images/mp3.png'
  );

  protected readonly _filterInput = new FormControl('');

  protected _debouncedFilter = this._filterInput.valueChanges.pipe(
    takeUntilDestroyed(),
    debounceTime(300)
  );

  protected readonly isWidgetLoading = toSignal(
    this.cldService.loading$.pipe(distinctUntilChanged())
  );


  constructor(
    private mediaBucket: MediaBucketService,
    private audioService: AudioService,
    private cldService: CloudinaryService
  ) {}

  ngOnInit() {
    if (this.mediaType() === 'image') {
      this.media$ = this.mediaBucket.images$;
    } else {
      this.media$ = this.mediaBucket.audio$;
    }
    if (this._value()) {
      const media = this.mediaBucket.getMedia(this.mediaType(), this._value());
      if (media) {
        this.selectedItem.set(media);
      }
    }
    this._debouncedFilter.subscribe((value: any) => {
      this.mediaBucket.filter(this.mediaType(), value);
    });
  }

  openCldWidget() {
    this.cldService.openWidget(this.mediaType());
  }

  onSelect(selected: Media) {
    this.toBeSelectedItem.set(selected);
    if (!this.isImage()) {
      this.audioService.play(selected.src);
    }
  }

  onDelete() {
    this.toBeSelectedItem.set(null)
    this.selectedItem.set(null)
    this.select.emit('')
  }

  onOk() {
    if (this.toBeSelectedItem()) {
      this.selectedItem.set(this.toBeSelectedItem());
      this.select.emit(this.toBeSelectedItem()?.src);
      this.closeWidget();
    }
  }

  playAudio() {
    if (!this.isImage()) {
      this.audioService.play(this._value());
    }
  }

  openWidget() {
    this.state.set('open');
  }
  closeWidget() {
    this.state.set('closed');
    this.toBeSelectedItem.set(null);
  }

  @Input()
  set type(val: MediaType) {
    this.mediaType.set(val);
    this.isImage.set(val === 'image');
  }

  @Input()
  set value(val: string) {
    this._value.set(val);
  }

  @Output() select = new EventEmitter<string>();
}
