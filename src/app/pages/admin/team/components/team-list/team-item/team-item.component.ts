import { DatePipe, NgIf } from '@angular/common';
import { booleanAttribute, Component, input, Input } from '@angular/core';
import {
  HlmAvatarComponent,
  HlmAvatarImageDirective,
  HlmAvatarFallbackDirective,
} from '@spartan-ng/ui-avatar-helm';

@Component({
  selector: 'app-team-item',
  standalone: true,
  imports: [
    NgIf,
    DatePipe,

    HlmAvatarFallbackDirective,
    HlmAvatarComponent,
    HlmAvatarImageDirective,
  ],
  template: `
    <div>
      <hlm-avatar variant="large">
        <img [src]="avatarUrl()" alt="user image" hlmAvatarImage />
        <img src="/images/man.svg" alt="user image" hlmAvatarFallback />
      </hlm-avatar>
      <div class="ml-3 flex flex-col">
        <h2 class="text-lg font-semibold">{{ name() }}</h2>
        <p class="text-sm text-gray-500">{{ role() }}</p>
      </div>
      <div class="flex-1"></div>
      <div class="flex flex-col items-end">
        <p class="text-sm text-gray-500">{{ email() }}</p>
        <p class="text-sm text-gray-500">{{ username() }}</p>
      </div>
      <div class="flex-1"></div>
      <div class="flex flex-col items-end">
        <p class="text-sm text-gray-500">
          {{ joined() | date: 'dd/MM/yyyy' }}
        </p>
        <p class="text-sm text-gray-500" *ngIf="isCurrentUser">You</p>
      </div>
    </div>
  `,
})
export class TeamItemComponent {
  avatarUrl = input<string>('');
  name = input<string>('');
  username = input<string>('');
  email = input<string>('');
  role = input<string>('');
  joined = input<Date>();
  isCurrentUser = input<boolean>(false);
}
