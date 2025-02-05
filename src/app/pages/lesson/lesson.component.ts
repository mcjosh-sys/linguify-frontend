import { LoadingComponent } from '@/app/components/loading/loading.component';
import {
  Lesson,
  UserProgress,
  UserSubscription,
} from '@/app/models/user.models';
import { UserProgressService } from '@/app/services/user-progress.service';
import { Component, signal } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  ParamMap,
  Router,
} from '@angular/router';
import { finalize, forkJoin, map, Subscription, switchMap } from 'rxjs';
import { QuizComponent } from './quiz/quiz.component';

@Component({
  selector: 'app-lesson',
  standalone: true,
  imports: [LoadingComponent, QuizComponent],
  templateUrl: './lesson.component.html',
  host: {
    class: 'flex flex-col h-full w-full',
  },
})
export class LessonComponent {
  lesson!: Lesson;
  userProgress!: UserProgress;
  userSubscription!: UserSubscription;
  initialPercentage = signal<number>(0);
  loading: boolean = true;

  subscriptions = new Subscription();

  constructor(
    private readonly userProgressService: UserProgressService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.fetchData();
    const subscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url === this.router.url) {
          this.fetchData();
        }
      }
    });

    this.subscriptions.add(subscription);
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }

  fetchData() {
    const subscription = this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          const id = params.get('id');
          return forkJoin({
            lessonData: this.userProgressService
              .getLesson(id ? parseInt(id) : undefined)
              .pipe(map((res: any) => res.data)),
            userProgressData: this.userProgressService
              .getUserProgress()
              .pipe(map((res: any) => res.data)),
            userSubscriptionData: this.userProgressService
              .getUserSubscription()
              .pipe(map((res: any) => res.data)),
          }).pipe(
            finalize(() => {
              this.loading = false;
              if (!this.lesson || !this.userProgress) {
                this.router.navigate(['/learn']);
              }

              this.initialPercentage.set(
                Math.round(
                  (this.lesson.challenges.filter(
                    (challenge) => challenge?.completed
                  ).length /
                    this.lesson.challenges.length) *
                    100
                )
              );
            })
          );
        })
      )
      .subscribe(({ lessonData, userProgressData, userSubscriptionData }) => {
        this.lesson = lessonData as Lesson;
        this.userProgress = userProgressData as UserProgress;
        this.userSubscription = userSubscriptionData as UserSubscription;

        this.initialPercentage.set(
          Math.round(
            (this.lesson.challenges.filter((challenge) => challenge?.completed)
              .length /
              this.lesson.challenges.length) *
              100
          )
        );
      });

    this.subscriptions.add(subscription);
  }
}
