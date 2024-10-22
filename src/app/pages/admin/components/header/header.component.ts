import { UserButtonComponent } from '@/app/components/clerk/user-button/user-button.component';
import { ThemeSwitcherComponent } from '@/app/components/theme-switcher/theme-switcher.component';
import { Component } from '@angular/core';
import { MobileSidebarComponent } from '../mobile-sidebar/mobile-sidebar.component';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [UserButtonComponent, ThemeSwitcherComponent, MobileSidebarComponent],
  templateUrl: './header.component.html',
  host: {
    class:
      'border-b z-[20] fixed top-0 right-0 left-0 md:left-[256px] flex items-center p-4 bg-background border-border',
  },
})
export class HeaderComponent {}
