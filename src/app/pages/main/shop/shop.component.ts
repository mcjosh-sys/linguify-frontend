import { FeedWrapperComponent } from '@/app/components/feed-wrapper/feed-wrapper.component';
import { LoadingComponent } from '@/app/components/loading/loading.component';
import { PromoComponent } from '@/app/components/promo/promo.component';
import { QuestsComponent } from '@/app/components/quests/quests.component';
import { StickyWrapperComponent } from '@/app/components/sticky-wrapper/sticky-wrapper.component';
import { UserProgressComponent } from '@/app/components/user-progress/user-progress.component';
import { UserProgress, UserSubscription } from '@/app/models/user.models';
import { UserProgressService } from '@/app/services/user-progress.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, forkJoin, Subscription } from 'rxjs';
import { ItemsComponent } from './items/items.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    LoadingComponent,
    StickyWrapperComponent,
    UserProgressComponent,
    FeedWrapperComponent,
    ItemsComponent,
    PromoComponent,
    QuestsComponent,
  ],
  templateUrl: './shop.component.html',
})
export class ShopComponent {
  userProgress!: UserProgress;
  userSubscription?: UserSubscription;
  loading = true;
  subscriptions = new Subscription();

  constructor(
    private userProgressService: UserProgressService,
    private router: Router,
    private titleService: Title
  ) {
    this.titleService.setTitle('Shop | Linguify')
  }

  ngOnInit() {
    this.fetchData();
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
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
        this.userProgress = userProgressData as UserProgress;
        this.userSubscription = userSubscriptionData as UserSubscription;
      });

    this.subscriptions.add(subscription);
  }
}
