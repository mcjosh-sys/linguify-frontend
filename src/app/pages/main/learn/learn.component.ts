import { FeedWrapperComponent } from '@/app/components/feed-wrapper/feed-wrapper.component';
import { LoadingComponent } from '@/app/components/loading/loading.component';
import { MobileHeaderComponent } from '@/app/components/mobile-header/mobile-header.component';
import { PromoComponent } from '@/app/components/promo/promo.component';
import { QuestsComponent } from '@/app/components/quests/quests.component';
import { SidebarComponent } from '@/app/components/sidebar/sidebar.component';
import { StickyWrapperComponent } from '@/app/components/sticky-wrapper/sticky-wrapper.component';
import { UserProgressComponent } from '@/app/components/user-progress/user-progress.component';
import {
  CourseProgress,
  Unit,
  UserProgress,
  UserSubscription,
} from '@/app/models/user.models';
import { UserProgressService } from '@/app/services/user-progress.service';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { lucideLoader } from '@ng-icons/lucide';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { finalize, forkJoin, map, Subscription } from 'rxjs';
import { FeedHeaderComponent } from './feed-header/feed-header.component';
import { UnitComponent } from './unit/unit.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-learn',
  standalone: true,
  imports: [
    LoadingComponent,
    StickyWrapperComponent,
    FeedWrapperComponent,
    FeedHeaderComponent,
    UserProgressComponent,
    UnitComponent,
    PromoComponent,
    QuestsComponent,
  ],
  providers: [provideIcons({ lucideLoader })],
  templateUrl: './learn.component.html',
})
export class LearnComponent {
  userProgress!: UserProgress;
  userSubscription?: UserSubscription;
  courseProgress!: CourseProgress;
  lessonPercentage!: number;
  units!: Unit[];
  loading: boolean = true;

  subscriptions = new Subscription();

  constructor(
    private userProgressService: UserProgressService,
    private router: Router,
    private titleService: Title
  ) {
    this.titleService.setTitle('Learn | Linguify');
  }

  ngOnInit() {
    this.fetchData();
  }

  refreshData() {
    this.fetchData();
  }

  fetchData() {
    const subscription = forkJoin({
      userProgressData: this.userProgressService.getUserProgress(),
      userSubscriptionData: this.userProgressService.getUserSubscription(),
      unitsData: this.userProgressService.getUnits(),
      courseProgressData: this.userProgressService.getCourseProgress(),
      lessonPercentageData: this.userProgressService.getLessonPercentage(),
    })
      .pipe(
        finalize(() => {
          if (!this.userProgress || !this.userProgress.activeCourse)
            this.router.navigate(['/courses']);
          this.loading = false;
        })
      )
      .subscribe(
        ({
          unitsData,
          courseProgressData,
          lessonPercentageData,
          userProgressData,
          userSubscriptionData,
        }) => {
          this.courseProgress = courseProgressData;
          this.units = unitsData;
          this.lessonPercentage = lessonPercentageData;
          this.userProgress = userProgressData;
          this.userSubscription = userSubscriptionData;
        }
      );
    this.subscriptions.add(subscription);
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }
}
