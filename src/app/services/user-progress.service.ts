import {
  HttpClient,
  HttpContext,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, switchMap, tap, throwError } from 'rxjs';
import { FULL_HEART, POINTS_TO_REFILL } from '../constants';
import {
  CourseProgress,
  Lesson,
  Unit,
  User,
  UserProgress,
  UserSubscription,
} from '../models/user.models';
import { CACHING_ENABLED, PAGE_URL } from '../tokens/caching-enabled.token';
import { CacheService } from './cache.service';
import { UrlService } from './url.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class UserProgressService {
  constructor(
    private http: HttpClient,
    private userService: UserService,

    private router: Router,
    private urlService: UrlService,
    private cache: CacheService,
  ) {}

  private get standardOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
  }
  private get cacheOptions() {
    const maxAge = new Date(Date.now() + 5 * 60 * 1000);
    return {
      headers: new HttpHeaders().set('Cache-Control', `max-age=${maxAge}`),
      context: new HttpContext()
        .set(CACHING_ENABLED, true)
        .set(PAGE_URL, this.router.url),
    };
  }

  verifyAuth() {
    if (!this.userService.currentUser || !this.userService.currentUser.id) {
      // this.router.navigate(['/signin']);
    }
  }

  getUserProgress() {
    this.verifyAuth();
    return this.http
      .get(this.urlService.user.get.progressUrl(), { ...this.cacheOptions })
      .pipe(
        map((res: any) => res.data as UserProgress),
        catchError(this.handleError),
      );
  }
  getUserSubscription() {
    this.verifyAuth();
    return this.http
      .get(this.urlService.user.get.subscriptionUrl(), { ...this.cacheOptions })
      .pipe(
        map((res: any) => res.data as UserSubscription),
        catchError(this.handleError),
      );
  }

  getTopTenUsers() {
    this.verifyAuth();
    return this.http.get(this.urlService.user.get.topTenUsersUrl()).pipe(
      map((res: any) => res.data as User[]),
      catchError(this.handleError),
    );
  }

  upsertUserProgress(courseId: number) {
    this.verifyAuth();
    const payload: Partial<UserProgress> = {
      activeCourseId: courseId,
    };

    return this.getUserProgress()
      .pipe(
        switchMap((data) => {
          if (data?.userId) {
            return this.http.patch(
              this.urlService.user.patch.progressUrl(),
              payload,
            );
          }
          return this.http.post(
            this.urlService.user.post.progressUrl(),
            payload,
          );
        }),
      )
      .pipe(
        tap(() => {
          this.cache.invalidateCache(this.urlService.user.get.progressUrl());
          this.cache.invalidateCache(this.urlService.user.get.unitsUrl());
          this.cache.invalidateCache(
            this.urlService.user.get.courseProgressUrl(),
          );
        }),
      );
  }

  getUnits() {
    this.verifyAuth();
    return this.http
      .get(this.urlService.user.get.unitsUrl(), {
        ...this.cacheOptions,
      })
      .pipe(
        map((res: any) => res.data as Unit[]),
        catchError(this.handleError),
      );
  }

  getCourseProgress() {
    this.verifyAuth();

    return this.http
      .get(this.urlService.user.get.courseProgressUrl(), {
        ...this.cacheOptions,
      })
      .pipe(
        map((res: any) => res.data as CourseProgress),
        catchError(this.handleError),
      );
  }

  getLesson(id?: number) {
    this.verifyAuth();
    return this.http
      .get(this.urlService.user.get.lessonUrl(id), { ...this.cacheOptions })
      .pipe(
        map((res: any) => res.data as Lesson),
        catchError(this.handleError),
      );
  }

  getLessonPercentage() {
    this.verifyAuth();

    return this.http
      .get(this.urlService.user.get.lessonPercentageUrl(), {
        ...this.cacheOptions,
      })
      .pipe(
        map((res: any) => res.data as number),
        catchError(this.handleError),
      );
  }

  refillHeart() {
    this.verifyAuth();

    return this.getUserProgress()
      .pipe(
        switchMap((userProgressData) => {
          const currentUserProgress = userProgressData as UserProgress;
          if (!currentUserProgress) {
            throw new Error('User progress not found');
          }

          if (currentUserProgress.hearts === FULL_HEART) {
            throw new Error('Hearts are already full');
          }

          if (currentUserProgress.points < POINTS_TO_REFILL) {
            throw new Error('Hearts are already full');
          }

          return this.http.patch(
            this.urlService.user.patch.refillHeartUrl(),
            {},
          );
        }),
      )
      .pipe(
        tap(() => {
          this.cache.invalidateCache(this.urlService.user.get.progressUrl());
        }),
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0)
      console.error(
        `There is an issue with the client or network: `,
        error.message,
      );
    else
      console.error('There is an issue with the server: ', error.error.message);

    return throwError(() => {
      if (error.error.status === 404) {
        return new Error('not found');
      }
      return new Error(
        'Cannot retrieve user from the server. Please try again.',
      );
    });
  }
}
