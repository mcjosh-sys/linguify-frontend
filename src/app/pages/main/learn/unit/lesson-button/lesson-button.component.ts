import { cn } from '@/lib/utils';
import { Component, InjectionToken, input } from '@angular/core';


const CN = new InjectionToken('');

@Component({
  selector: 'app-lesson-button',
  templateUrl: './lesson-button.component.html',
})
export class LessonButtonComponent {
  id = input<number>();
  index = input<number>();
  totalCount = input<number>();
  locked = input<boolean>();
  current = input<boolean>();
  readonly percentage = input<number>();

  get cn() {
    return cn;
  }

  get percent() {
    return Number.isNaN(this.percentage) ? 0 : this.percentage();
  }

  get isFirst() {
    return this.index() === 0;
  }
  get isLast() {
    return this.index() === this.totalCount();
  }
  get isCompleted() {
    return !this.current() && !this.locked();
  }
  get href() {
    return this.isCompleted ? `/lesson/${this.id()}` : '/lesson';
  }

  get icon() {
    return this.isCompleted
      ? 'check'
      : this.isLast
      ? 'crown'
      : 'star';
  }

  get position() {
    const cycleLength = 8;
    const cycleIndex = this.index()! % cycleLength;
    let indentationLevel;

    if (cycleIndex <= 2) {
      indentationLevel = cycleIndex;
    } else if (cycleIndex <= 4) {
      indentationLevel = 4 - cycleIndex;
    } else if (cycleIndex <= 6) {
      indentationLevel = 4 - cycleIndex;
    } else {
      indentationLevel = cycleIndex - 8;
    }

    return indentationLevel * 40;
  }
}
