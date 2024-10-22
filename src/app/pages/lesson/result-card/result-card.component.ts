import { Component, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';

@Component({
  selector: 'app-result-card',
  standalone: true,
  imports: [],
  templateUrl: './result-card.component.html',
  host: {
    '[class]': '_computedClass()',
  },
})
export class ResultCardComponent {
  variant = input<'points' | 'hearts'>();
  value = input<number>();

  imageSrc!: string;

  ngOnInit() {
    this.imageSrc =
      this.variant() === 'points' ? '/images/points.svg' : '/images/heart.svg';
  }

  hlm = hlm;

  _computedClass = computed(() => {
    return hlm(
      'rounded-2xl border-2 w-full',
      this.variant() === 'points' && 'bg-orange-400 border-orange-400',
      this.variant() === 'hearts' && 'bg-rose-500 border-rose-500'
    );
  });
}
