import { Component } from '@angular/core';

@Component({
  selector: 'app-feed-wrapper',
  standalone: true,
  imports: [],
  template: `
    <div class="flex-1 relative top-0 pb-10">
      <ng-content />
    </div>
  `,
  host: {
    class: 'w-full',
  },
})
export class FeedWrapperComponent {}
