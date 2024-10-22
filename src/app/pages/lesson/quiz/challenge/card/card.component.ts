import { Challenge } from '@/app/models/user.models';
import { AudioService } from '@/app/services/audio.service';
import { KeyListenerService } from '@/app/services/key-listener.service';
import {
  Component,
  EventEmitter,
  Output,
  computed,
  input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { hlm } from '@spartan-ng/ui-core';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-challenge-card',
  standalone: true,
  imports: [],
  templateUrl: './card.component.html',
  host: {
    '(click)': 'handleClick()',
    '[class]': '__computedCls()',
  },
})
export class CardComponent {
  id = input<number>();
  text = input<string>();
  imageSrc = input<string>();
  shortcut = input<string>();
  selected = input<boolean>(false);
  status = input<'correct' | 'wrong' | 'none'>();
  audioSrc = input<string>();
  disabled = input<boolean>();
  type = input<Challenge['type']>();
  hlm = hlm;

  @Output() onClick: EventEmitter<number> = new EventEmitter();

  keySubscription!: Subscription

  protected readonly audioLoading = signal<boolean>(false)

  constructor(
    private audioService: AudioService,
    private keyListenerService: KeyListenerService
  ) {
    this.audioService.state$.pipe(takeUntilDestroyed()).subscribe((value) => {
      this.audioLoading.set(value.loading)
    })
  }

  ngOnInit() {
    this.keySubscription = this.keyListenerService.listen([this.shortcut()!], this.handleClick.bind(this))
  }

  ngOnDestroy() {
    if (this.keySubscription) {
      this.keySubscription.unsubscribe()
    }
  }

  __computedCls = computed(() => {
    return hlm(
      'h-full border-2 rounded-xl border-b-4 hover:bg-black/5  p-4 lg:p-6 cursor-pointer active:boder-b-2',
      this.selected() && 'border-sky-300 bg-sky-100 hover:bg-sky-100',
      this.selected() &&
        this.status() === 'correct' &&
        'border-green-300 bg-green-100 hover:bg-green-100',
      this.selected() &&
        this.status() === 'wrong' &&
        'border-rose-300 bg-rose-100 hover:bg-rose-100',
      (this.disabled() || this.audioLoading()) && 'pointer-events-none hover:bg-white',
      this.type() === 'ASSIST' && 'lg:p-3 w-full'
    );
  });

  handleClick() {
    if (this.disabled()) return;
    this.audioService.play(this.audioSrc() || '');
    this.onClick.emit(this.id());
  }
}
