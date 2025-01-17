import { booleanAttribute, Component, Input } from '@angular/core';
import {
  HlmAvatarComponent,
  HlmAvatarImageDirective,
} from '@spartan-ng/ui-avatar-helm';

@Component({
  selector: 'app-team-item',
  standalone: true,
  imports: [
    HlmAvatarComponent,
    HlmAvatarImageDirective,
    HlmAvatarImageDirective,
  ],
  template: `
    <div>
      
    </div>
  `,
})
export class TeamItemComponent {
  @Input() avatarUrl: string = '';
  @Input() name: string = '';
  @Input() email: string = '';
  @Input({ transform: booleanAttribute }) isCurrent: boolean = false;
}
