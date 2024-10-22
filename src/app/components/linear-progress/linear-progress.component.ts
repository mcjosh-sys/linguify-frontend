import { Component, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

const baseClass = 'relative h-4 w-full overflow-hidden rounded-full bg-secondary';

@Component({
  selector: 'app-linear-progress',
  standalone: true,
  imports: [],
  template: `
    <div
      class="h-full w-full flex-1 bg-green-500 transition-all"
      [style.transform]="'translateX(-'+(100-(value() || 0))+'%)'"
    ></div>
  `,
  host: {
    '[class]': '_computedClass()',
  },
})
export class LinearProgressComponent {
  className = input<ClassValue>('', { alias: 'class' });
  value = input<number>();

  protected _computedClass = computed(() => {
    return hlm(baseClass, this.className());
  });
}
