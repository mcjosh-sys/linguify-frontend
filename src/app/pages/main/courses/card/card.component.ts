import { Course } from '@/app/models/course.models';
import { cn } from '@/lib/utils';
import { Component, EventEmitter, Output, input } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideCheck } from '@ng-icons/lucide';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [HlmIconComponent],
  providers: [provideIcons({ lucideCheck })],
  template: `
    <div
      (click)="onClick.emit(course()?.id!)"
      [class]="
        cn(
          'h-full border-2 rounded-xl border-b-4 hover:bg-black/5 cursor-pointer active:border-b-2 flex flex-col items-center justify-between p-3 pb-6 min-h-[217px] min-w-[200px]',
          disabled() && 'pointer-events-none opacity-50'
        )
      "
    >
      <div class="min-[24px] w-full flex items-center justify-end">
        @if(active()){
        <div
          class="rounded-md bg-green-600 flex items-center justify-center p-1.5"
        >
          <hlm-icon
            size="sm"
            name="lucideCheck"
            class="text-white stroke-[4]"
          />
        </div>
        }
      </div>
      <img
        [src]="course()?.imageSrc"
        [alt]="course()?.title"
        height="70"
        width="93.33"
        class="rounded-lg drop-shadow-md border object-cover"
      />
      <p class="text-neutral-700 text-center font-bold mt-3">
        {{ course()?.title }}
      </p>
    </div>
  `,
})
export class CardComponent {
  course = input<Course>();
  disabled = input<boolean>();
  active = input<boolean>();
  @Output() onClick = new EventEmitter<number>();
  cn = cn;
}
