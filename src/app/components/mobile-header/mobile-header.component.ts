import { Component } from '@angular/core';
import { MobileSidebarComponent } from '../mobile-sidebar/mobile-sidebar.component';

@Component({
  selector: 'app-mobile-header',
  standalone: true,
  imports: [MobileSidebarComponent],
  template: `
    <nav
      class="lg:hidden px-6 h-[50px] flex items-center border-b fixed top-0 w-full z-50 bg-green-500"
    >
      <app-mobile-sidebar />
    </nav>
  `,
})
export class MobileHeaderComponent {}
