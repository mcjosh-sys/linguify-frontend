import { Component, input } from '@angular/core';
import {
  BrnSheetContentDirective,
  BrnSheetTriggerDirective,
} from '@spartan-ng/ui-sheet-brain';
import {
  HlmSheetComponent,
  HlmSheetContentComponent,
  HlmSheetCloseDirective,
} from '@spartan-ng/ui-sheet-helm';

import { provideIcons } from '@ng-icons/core';
import { lucideMenu } from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ClassValue } from 'class-variance-authority/types';

@Component({
  selector: 'app-mobile-admin-sidebar',
  standalone: true,
  imports: [
    SidebarComponent,
    BrnSheetContentDirective,
    BrnSheetTriggerDirective,
    HlmSheetComponent,
    HlmSheetContentComponent,
    HlmSheetCloseDirective,
    HlmIconComponent,
    HlmButtonDirective,
  ],
  providers: [provideIcons({ lucideMenu })],
  template: `
    <hlm-sheet side="left">
      <button brnSheetTrigger>
        <hlm-icon size="lg" name="lucideMenu" />
      </button>
      <hlm-sheet-content
        *brnSheetContent="let ctx"
        class="p-0 z-[100]"
      >
        <app-admin-sidebar />
      </hlm-sheet-content>
    </hlm-sheet>
  `,
  host: {
    '[class]':'userClass()'
  }
})
export class MobileSidebarComponent {
  userClass = input<ClassValue>('',{alias: 'class'})
}
