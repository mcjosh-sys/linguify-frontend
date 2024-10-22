import { Challenge, ChallengeOption } from '@/app/models/user.models';
import {
  Component,
  EventEmitter,
  Output,
  computed,
  input,
} from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { CardComponent } from './card/card.component';

@Component({
  selector: 'app-challenge',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './challenge.component.html',
  host: {
    '[class]': '__computedCls()',
  },
})
export class ChallengeComponent {
  options = input<ChallengeOption[]>([]);
  status = input<'correct' | 'wrong' | 'none'>('none');
  selectedOption = input<number>();
  disabled = input<boolean>(false);
  type = input<Challenge['type']>();

  @Output() onSelect: EventEmitter<number> = new EventEmitter();

  __computedCls = computed(() => {
    return hlm(
      'grid gap-2',
      this.type() === 'ASSIST' && 'grid-cols-1',
      this.type() === 'SELECT' &&
        'grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(0,1fr))]'
    );
  });

  onClick(id: number) {
    this.onSelect.emit(id);
  }
}
