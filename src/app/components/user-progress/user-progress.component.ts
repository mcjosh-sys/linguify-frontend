import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { lucideInfinity } from '@ng-icons/lucide';

import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';

@Component({
  selector: 'app-user-progress',
  standalone: true,
  imports: [RouterLink, HlmButtonDirective, HlmIconComponent],
  providers: [provideIcons({ lucideInfinity })],
  template: `
    <div class="flex items-center justify-between gap-x-2 w-full">
      <a routerLink="/courses" hlmBtn variant="ghost">
        <img
          [src]="activeCourse()?.imageSrc"
          [alt]="activeCourse()?.title"
          class="rounded-md border"
          width="32"
          height="32"
        />
      </a>
      <a routerLink="/shop" hlmBtn variant="ghost" class="text-orange-500">
        <img
          src="/images/points.svg"
          alt="Points"
          class="mr-2"
          width="28"
          height="28"
        />
        {{ points() }}
      </a>
      <a routerLink="/shop" hlmBtn variant="ghost" class="text-rose-500">
        <img
          src="/images/heart.svg"
          alt="Hearts"
          class="mr-2"
          width="28"
          height="28"
        />
        @if(hasActiveSubscription()){
        <hlm-icon size="xs" name="lucideInfinity" class="stroke-[3]" />
        }@else {
        {{ hearts() }}
        }
      </a>
    </div>
  `,
})
export class UserProgressComponent {
  activeCourse = input<{ title: string; imageSrc: string }>();
  hearts = input<number>(0);
  points = input<number>(0);
  hasActiveSubscription = input<boolean>(false);
}
