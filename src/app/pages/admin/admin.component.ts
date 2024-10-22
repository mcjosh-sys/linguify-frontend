import { LoaderComponent } from '@/app/components/loader/loader.component';
import { GenericModalComponent } from '@/app/components/modals/generic-modal/generic-modal.component';
import { AdminService } from '@/app/services/admin.service';
import { ThemeService } from '@/app/services/theme.service';
import { Component, signal } from '@angular/core';
import { NavigationExtras, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    LoaderComponent,
    GenericModalComponent,
  ],
  template: `
    @if(loading()){
    <main class="w-full h-full bg-background/95">
      <app-loader />
    </main>
    }@else {
    <app-generic-modal />
    <app-admin-sidebar class="hidden md:flex" />
    <div class="md:pl-[256px] h-full">
      <app-admin-header />
      <main class="pt-24 px-4 h-full bg-background/95 relative">
        <router-outlet></router-outlet>
      </main>
    </div>
    }
  `,
  host: {
    class: 'text-primary',
  },
})
export class AdminComponent {
  theme = signal('');
  loading = signal(false);
  private readonly _navigationExtras: NavigationExtras = {
    skipLocationChange: true,
    state: {
      error: {
        message: {
          title: '403 Unauthorized',
          description: 'You are not authorized to access this page.',
        },
        redirect: {
          text: 'Learn Page',
          url: '/learn',
        },
      },
    },
  };

  constructor(
    private themeService: ThemeService,
    private adminService: AdminService,
    private router: Router
  ) {
    this.themeService.theme$.subscribe((value) => this.theme.set(value));
    this.loading.set(true);
    this.adminService.checkIfStaff().subscribe({
      next: (isStaff) => {
        if (!isStaff) {
          this.router.navigateByUrl('/error', this._navigationExtras);
        }
        this.loading.set(false);
      },
    });
  }
}
