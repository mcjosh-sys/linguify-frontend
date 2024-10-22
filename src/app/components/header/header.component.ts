import { NgIf } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Clerk } from '@clerk/clerk-js';
import { provideIcons } from '@ng-icons/core';
import { lucideLoader } from '@ng-icons/lucide';

import { ClerkService } from '@/app/services/clerk.service';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { UserButtonComponent } from '../clerk/user-button/user-button.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf, UserButtonComponent, HlmIconComponent, HlmButtonDirective],
  providers: [provideIcons({ lucideLoader })],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  user = signal<Clerk['user']>(null);
  loading = signal<boolean>(true);
  constructor(private clerkService: ClerkService, public router: Router) {}

  ngOnInit() {
    this.clerkService
      .auth()
      .subscribe((user) => {
        this.user.set(user);
        this.loading.set(false);
      });
  }
}
