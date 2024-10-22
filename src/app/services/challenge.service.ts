import {
  HttpClient,
  HttpContext,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, forkJoin, of, switchMap, tap, throwError } from 'rxjs';
import { UserProgress, UserSubscription } from '../models/user.models';
import { CACHING_ENABLED, PAGE_URL } from '../tokens/caching-enabled.token';
import { CacheService } from './cache.service';
import { UrlService } from './url.service';
import { UserProgressService } from './user-progress.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class ChallengeService {
  constructor(
    private userService: UserService,
    private userProgressService: UserProgressService,
    private urlService: UrlService,
    private http: HttpClient,
    private cache: CacheService,
    private router: Router
  ) {}

  private get cacheOptions() {
    const maxAge = new Date(Date.now() + 5 * 60 * 1000);
    return {
      headers: new HttpHeaders().set('Cache-Control', `max-age=${maxAge}`),
      context: new HttpContext()
        .set(CACHING_ENABLED, true)
        .set(PAGE_URL, this.router.url),
    };
  }

  getChallengeProgress(challengeId: number) {
    this.userService.verifyAuth();
    return this.http
      .get(this.urlService.challenge.get.progressUrl(challengeId), {
        ...this.cacheOptions,
      })
      .pipe(catchError(this.handleError));
  }

  upsertChallengeProgress(challengeId: number, lessonId: number) {
    this.userService.verifyAuth();

    return forkJoin({
      userProgressData: this.userProgressService.getUserProgress(),
      userSubscriptionData: this.userProgressService.getUserSubscription(),
    })
      .pipe(
        switchMap(({ userProgressData, userSubscriptionData }) => {
          const userProgress = userProgressData as UserProgress;
          const userSubscription = userSubscriptionData as UserSubscription;
          return this.getChallengeProgress(challengeId).pipe(
            switchMap((data) => {
              const isPractice = !!data;
              // console.log({data, isPractice, userProgress})
              if (
                userProgress.hearts === 0 &&
                !isPractice &&
                !userSubscription.isActive
              ) {
                return of({ error: 'hearts' });
              }

              if (isPractice) {
                return this.http.patch(
                  this.urlService.challenge.patch.progressUrl(challengeId),
                  { userId: this.userService.currentUser?.id }
                );
              }

              return this.http.post(
                this.urlService.challenge.post.progressUrl(challengeId),
                { userId: this.userService.currentUser?.id }
              );
            })
          );
        })
      )
      .pipe(
        tap(() => {
          this.cache.invalidateCache(this.urlService.user.get.unitsUrl());
          this.cache.invalidateCache(this.urlService.user.get.lessonUrl());
          this.cache.invalidateCache(
            this.urlService.user.get.lessonUrl(lessonId)
          );
          this.cache.invalidateCache(
            this.urlService.user.get.courseProgressUrl()
          );
          this.cache.invalidateCache(
            this.urlService.user.get.lessonPercentageUrl()
          );
          this.cache.invalidateCache(this.urlService.user.get.progressUrl());
        })
      );
  }

  reduceHeart(challengeId: number) {
    this.userService.verifyAuth();

    return this.userProgressService
      .getUserProgress()
      .pipe(
        switchMap((userProgressData) => {
          const currentUserProgress = userProgressData as UserProgress;
          if (!currentUserProgress) {
            throw new Error('User progress not found');
          }
          return this.getChallengeProgress(challengeId).pipe(
            switchMap((data) => {
              const isPractice = !!data;
              if (currentUserProgress.hearts === 0 && !isPractice) {
                return of({ error: 'hearts' });
              }

              if (isPractice) {
                return of({ error: 'practice' });
              }

              return this.http.patch(
                this.urlService.user.patch.reduceHeartUrl(),
                null
              );
            })
          );
        })
      )
      .pipe(
        tap((data: any) => {
          if (!data.error)
            this.cache.invalidateCache(this.urlService.user.get.progressUrl());
        })
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0)
      console.error(
        `There is an issue with the client or network: `,
        error.message
      );
    else
      console.error('There is an issue with the server: ', error.error.message);

    return throwError(() => {
      if (error.error.status === 404) {
        return new Error('not found');
      }
      return new Error(
        'Cannot retrieve user from the server. Please try again.'
      );
    });
  }
}
