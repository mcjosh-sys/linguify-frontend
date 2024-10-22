import { FeedWrapperComponent } from '@/app/components/feed-wrapper/feed-wrapper.component';
import { LinearProgressComponent } from '@/app/components/linear-progress/linear-progress.component';
import { PromoComponent } from '@/app/components/promo/promo.component';
import { StickyWrapperComponent } from '@/app/components/sticky-wrapper/sticky-wrapper.component';
import { UserProgressComponent } from '@/app/components/user-progress/user-progress.component';
import { quests } from '@/app/constants';
import { UserProgress, UserSubscription } from '@/app/models/user.models';
import { UserProgressService } from '@/app/services/user-progress.service';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { finalize, forkJoin, Subscription } from 'rxjs';

@Component({
  selector: 'app-quests',
  standalone: true,
  imports: [
    StickyWrapperComponent,
    UserProgressComponent,
    FeedWrapperComponent,
    LinearProgressComponent,
    PromoComponent,
  ],
  templateUrl: './quests.component.html',
})
export class QuestsComponent {
  userProgress!: UserProgress;
  userSubscription?: UserSubscription;
  loading = true;
  subscriptions = new Subscription();

  quests = quests;

  constructor(
    private userProgressService: UserProgressService,
    private router: Router,
    private titleService: Title
  ) {
    this.titleService.setTitle('Quests | Linguify')
  }

  ngOnInit() {
    this.fetchData();
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }

  questProgress(value: number) {
    return (this.userProgress.points / value) * 100;
  }

  refresh() {
    // if (this.subscriptions) this.subscriptions.unsubscribe();
    this.fetchData();
  }

  fetchData() {
    const subscription = forkJoin({
      userProgressData: this.userProgressService.getUserProgress(),
      userSubscriptionData: this.userProgressService.getUserSubscription(),
    })
      .pipe(
        finalize(() => {
          this.loading = false;
          if (!this.userProgress || !this.userProgress.activeCourse) {
            this.router.navigate(['/courses']);
          }
        })
      )
      .subscribe(({ userProgressData, userSubscriptionData }) => {
        this.userProgress = userProgressData as any;
        this.userSubscription = userSubscriptionData as any;
      });

    this.subscriptions.add(subscription);
  }
}
