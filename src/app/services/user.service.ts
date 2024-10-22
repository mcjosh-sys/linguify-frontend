import { environment } from '@/environments/environment';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of, Subscription } from 'rxjs';
import { ClerkService } from './clerk.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  subscriptions = new Subscription();
  constructor(private clerkService: ClerkService, private router: Router) {}

  get isAuthenticated() {
    return of(!!this.currentUser?.id);
  }

  get currentUser() {
    return this.clerkService.user;
  }

  verifyAuth() {
    if (!this.currentUser?.id) {
      this.router.navigate(['/signin']);
    }
  }

  get isAdmin() {
    if (this.currentUser?.id) {
      if (this.currentUser.organizationMemberships.length > 0) {
        return of(
          this.currentUser.organizationMemberships.some(
            (org) => org.organization.id === environment.clerkOrgId
          )
        );
      }
    }
    return of(false);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
