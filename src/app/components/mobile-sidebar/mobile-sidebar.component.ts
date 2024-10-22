import { Component } from '@angular/core';
import {
  BrnSheetContentDirective,
  BrnSheetTriggerDirective,
} from '@spartan-ng/ui-sheet-brain';
import {
  HlmSheetComponent,
  HlmSheetContentComponent,
  HlmSheetCloseDirective
} from '@spartan-ng/ui-sheet-helm';

import { provideIcons } from '@ng-icons/core';
import { lucideMenu } from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-mobile-sidebar',
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
        <hlm-icon size="lg" name="lucideMenu" class="text-white" />
      </button>
      <hlm-sheet-content
        *brnSheetContent="let ctx"
        class="p-0 z-[100]"
      >
        <app-sidebar />
      </hlm-sheet-content>
    </hlm-sheet>
  `,
})
export class MobileSidebarComponent {}
