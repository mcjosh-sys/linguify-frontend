import { Component } from '@angular/core';

@Component({
  selector: 'app-sticky-wrapper',
  standalone: true,
  imports: [],
  template: `
    <div class="hidden lg:block w-[368px] sticky self-end top-6">
      <div class="min-h-[calc(100vh-48px)] sticky top-6 flex flex-col gap-y-4">
        <ng-content />
      </div>
    </div>
  `,
})
export class StickyWrapperComponent {}
