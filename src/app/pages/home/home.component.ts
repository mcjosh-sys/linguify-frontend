import { ClerkLoadedComponent } from '@/app/components/clerk/clerk-loaded/clerk-loaded.component';
import { ClerkLoadingComponent } from '@/app/components/clerk/clerk-loading/clerk-loading.component';
import { UserButtonComponent } from '@/app/components/clerk/user-button/user-button.component';
import { FooterComponent } from '@/app/components/footer/footer.component';
import { HeaderComponent } from '@/app/components/header/header.component';
import { ClerkService } from '@/app/services/clerk.service';
import { NgIf } from '@angular/common';
import {
  Component,
  signal
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Clerk } from '@clerk/clerk-js';
import { provideIcons } from '@ng-icons/core';
import { lucideLoader } from '@ng-icons/lucide';

import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    HeaderComponent,
    FooterComponent,
    UserButtonComponent,
    HlmButtonDirective,
    HlmIconComponent,
    ClerkLoadedComponent,
    ClerkLoadingComponent
  ],
  providers: [provideIcons({ lucideLoader })],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  user = signal<Clerk['user']>(null);

  constructor(private clerkService: ClerkService) {
  }

  ngOnInit() {
    this.clerkService.auth().subscribe((user) => this.user.set(user) )
  }

}
