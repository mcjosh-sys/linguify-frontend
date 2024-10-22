import { LoaderComponent } from '@/app/components/loader/loader.component';
import { MobileHeaderComponent } from '@/app/components/mobile-header/mobile-header.component';
import { SidebarComponent } from '@/app/components/sidebar/sidebar.component';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { lucideLoader } from '@ng-icons/lucide';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';

@Component({
  selector: 'app-learn-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarComponent,
    MobileHeaderComponent,
    LoaderComponent,
    HlmIconComponent
  ],
  providers: [provideIcons({lucideLoader})],
  template: `
    <app-mobile-header />
    <app-sidebar class="hidden lg:flex" />
    <main class="lg:pl-[256px] h-full pt-[50px] lg:pt-0">
      <div class="max-w-[1056px] mx-auto pt-6 h-full">
        <router-outlet></router-outlet>
      </div>
    </main>
  `,
})
export class MainComponent {
  
}
