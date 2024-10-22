import { UserService } from '@/app/services/user.service';
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { lucideLoader } from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { Subscription, zip } from 'rxjs';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [HlmButtonDirective, RouterLink, HlmIconComponent],
  providers: [provideIcons({ lucideLoader })],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css',
})
export class NotFoundComponent {
  isAuth!: boolean;
  isAdmin!: boolean;
  href!: string;

  loading = signal<boolean>(true);

  subscriptions = new Subscription();

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.subscriptions.add(
      zip([
        this.userService.isAdmin,
        this.userService.isAuthenticated,
      ]).subscribe(([isAdminData, isAuthData]) => {
        this.isAuth = isAuthData;
        this.isAdmin = isAdminData;
        this.loading.set(false);
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
