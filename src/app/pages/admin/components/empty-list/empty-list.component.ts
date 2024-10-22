import { Component, computed, Input, signal } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideGhost } from '@ng-icons/lucide';
import { hlm } from '@spartan-ng/ui-core';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { ClassValue } from 'class-variance-authority/types';

@Component({
  selector: 'app-admin-empty-list',
  standalone: true,
  imports: [HlmIconComponent],
  providers: [provideIcons({ lucideGhost })],
  template: `
    <hlm-icon name="lucideGhost" class="h-16 w-16" strokeWidth="1" />
    <h1 class="capitalize text-xl mt-2">No {{ _title() }} yet.</h1>
    <p class="text-sm">Do you want to add one?</p>
  `,
  host: {
    '[class]': '_computedClass()',
  },
})
export class EmptyListComponent {
  protected readonly _title = signal<string>('');
  private readonly _userClass = signal<ClassValue>('');

  protected readonly _computedClass = computed(() =>
    hlm(
      'w-full flex flex-col items-center justify-center text-muted-foreground text-center mt-8'
    )
  );

  @Input()
  set title(value: string) {
    this._title.set(value);
  }

  @Input()
  set class(value: string) {
    this._userClass.set(value);
  }
}
