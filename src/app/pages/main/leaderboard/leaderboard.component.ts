import { FeedWrapperComponent } from '@/app/components/feed-wrapper/feed-wrapper.component';
import { LoadingComponent } from '@/app/components/loading/loading.component';
import { PromoComponent } from '@/app/components/promo/promo.component';
import { QuestsComponent } from '@/app/components/quests/quests.component';
import { StickyWrapperComponent } from '@/app/components/sticky-wrapper/sticky-wrapper.component';
import { UserProgressComponent } from '@/app/components/user-progress/user-progress.component';
import { UserProgress, UserSubscription } from '@/app/models/user.models';
import { UserProgressService } from '@/app/services/user-progress.service';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import {
  HlmAvatarComponent,
  HlmAvatarFallbackDirective,
  HlmAvatarImageDirective,
} from '@spartan-ng/ui-avatar-helm';
import { hlm } from '@spartan-ng/ui-core';
import { BrnSeparatorComponent } from '@spartan-ng/ui-separator-brain';
import { HlmSeparatorDirective } from '@spartan-ng/ui-separator-helm';
import { finalize, forkJoin, Subscription } from 'rxjs';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [
    LoadingComponent,
    StickyWrapperComponent,
    UserProgressComponent,
    FeedWrapperComponent,
    HlmSeparatorDirective,
    BrnSeparatorComponent,
    HlmAvatarComponent,
    HlmAvatarImageDirective,
    PromoComponent,
    QuestsComponent,
  ],
  templateUrl: './leaderboard.component.html',
})
export class LeaderboardComponent {
  userProgress!: UserProgress;
  userSubscription?: UserSubscription;
  leaderboard!: Partial<UserProgress>[];
  loading = true;
  subscriptions = new Subscription();

  hlm = hlm;

  constructor(
    private readonly userProgressService: UserProgressService,
    private readonly router: Router,
    private readonly titleService: Title
  ) {
    this.titleService.setTitle('Leaderboard | Linguify');
  }

  ngOnInit() {
    this.fetchData();
  }

  isCurrentUser(userId: string) {
    return userId === this.userProgress.userId;
  }

  refresh() {
    this.fetchData();
  }

  fetchData() {
    forkJoin({
      userProgressData: this.userProgressService.getUserProgress(),
      userSubscriptionData: this.userProgressService.getUserSubscription(),
      topTenUsersData: this.userProgressService.getTopTenUsers(),
    })
      .pipe(
        finalize(() => {
          this.loading = false;
          if (!this.userProgress || !this.userProgress.activeCourse) {
            this.router.navigate(['/courses']);
          }
        })
      )
      .subscribe(
        ({ userProgressData, userSubscriptionData, topTenUsersData }) => {
          this.userProgress = userProgressData as any;
          this.userSubscription = userSubscriptionData as any;
          this.leaderboard = topTenUsersData as any;
        }
      );
  }
}
