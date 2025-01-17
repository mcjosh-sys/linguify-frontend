import {
  HttpClient,
  HttpContext,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { catchError, map, tap, throwError } from 'rxjs';
import { Media, Staff } from '../models/admin.models';
import { CACHING_ENABLED, PAGE_URL } from '../tokens/caching-enabled.token';
import { AdminUrlService } from './admin-url.service';
import { CacheService } from './cache.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(
    private urlService: AdminUrlService,
    private http: HttpClient,
    private cacheService: CacheService,
    private router: Router,
    private userService: UserService
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

  private get userId() {
    const userId = this.userService.currentUser?.id;
    if (userId) {
      return userId;
    }
    const navExtras: NavigationExtras = {
      state: {
        returnUrl: this.router.url,
      },
    };
    this.router.navigate(['/signin'], navExtras);
    return;
  }

  checkIfAdmin() {
    const userId = this.userId;
    return this.http.get(this.urlService.user.get.isAdmin(userId!), {
      ...this.cacheOptions,
    }).pipe(map((data: any) => data.isAdmin as boolean));
  }
  checkIfStaff() {
    const userId = this.userId;
    return this.http
      .get(this.urlService.user.get.isStaff(userId!), {
        ...this.cacheOptions,
      })
      .pipe(map((data: any) => data.isStaff as boolean));
  }

  checkPermission(courseId: any = '') {
    const userId = this.userId;
    return this.http.get(
      this.urlService.user.get.hasPermission(userId!, courseId)
    );
  }

  getCourses() {
    return this.http
      .get(this.urlService.course.get.allUrl(), {
        ...this.cacheOptions,
      })
      .pipe(catchError(this.handleError));
  }

  getCourseById(id: string) {
    return this.http
      .get(this.urlService.course.get.byIdUrl(id), {
        ...this.cacheOptions,
      })
      .pipe(catchError(this.handleError));
  }

  createCourse(payload: { title: string; imageSrc: string }) {
    const userId = this.userId;
    return this.http
      .post(this.urlService.course.post.url(userId!), payload)
      .pipe(
        tap(() =>
          this.cacheService.invalidateCache(this.urlService.course.get.allUrl())
        )
      );
  }

  updateCourse(courseId: any, payload: { title: string; imageSrc: string }) {
    const userId = this.userId;
    return this.http
      .patch(this.urlService.course.patch.url(userId!, courseId), payload)
      .pipe(
        tap(() => {
          this.cacheService.clearCache('courses');
        })
      );
  }

  deleteCourse(courseId: string) {
    const userId = this.userId;
    return this.http
      .delete(this.urlService.course.delete.url(userId!, courseId))
      .pipe(
        tap(() => {
          this.cacheService.clearCache('courses');
        })
      );
  }

  getUnits() {
    return this.http
      .get(this.urlService.unit.get.allUrl(), {
        ...this.cacheOptions,
      })
      .pipe(catchError(this.handleError));
  }

  getUnitById(unitId: any) {
    return this.http
      .get(this.urlService.unit.get.byIdUrl(unitId), {
        ...this.cacheOptions,
      })
      .pipe(catchError(this.handleError));
  }

  createUnit(payload: {
    title: string;
    description: string;
    courseId: number;
    order: number;
  }) {
    const userId = this.userId;
    return this.http
      .post(this.urlService.unit.post.url(userId!), payload)
      .pipe(
        tap(() =>
          this.cacheService.invalidateCache(this.urlService.unit.get.allUrl())
        )
      );
  }
  updateUnit(
    unitId: any,
    payload: {
      title: string;
      description: string;
      courseId: number;
      order: number;
    }
  ) {
    const userId = this.userId;
    return this.http
      .patch(this.urlService.unit.patch.url(userId!, unitId), payload)
      .pipe(
        tap(() => {
          this.cacheService.clearCache('units');
        })
      );
  }
  deleteUnit(unitId: any) {
    const userId = this.userId;
    return this.http
      .delete(this.urlService.unit.delete.url(userId!, unitId))
      .pipe(
        tap(() => {
          this.cacheService.clearCache('units');
          this.cacheService.invalidateCache(
            this.urlService.course.get.allUrl()
          );
        })
      );
  }
  getLessons() {
    return this.http
      .get(this.urlService.lesson.get.allUrl(), {
        ...this.cacheOptions,
      })
      .pipe(catchError(this.handleError));
  }

  getLessonById(lessonId: any) {
    return this.http
      .get(this.urlService.lesson.get.byIdUrl(lessonId), {
        ...this.cacheOptions,
      })
      .pipe(catchError(this.handleError));
  }

  createLesson(payload: { title: string; unitId: number; order: number }) {
    const userId = this.userId;
    return this.http
      .post(this.urlService.lesson.post.url(userId!), payload)
      .pipe(
        tap(() =>
          this.cacheService.invalidateCache(this.urlService.lesson.get.allUrl())
        )
      );
  }

  updateLesson(
    lessonId: any,
    payload: {
      title: string;
      unitId: number;
      order: number;
    }
  ) {
    const userId = this.userId;
    return this.http
      .patch(this.urlService.lesson.patch.url(userId!, lessonId), payload)
      .pipe(
        tap(() => {
          this.cacheService.clearCache('lessons');
        })
      );
  }

  deleteLesson(lessonId: any) {
    const userId = this.userId;
    return this.http
      .delete(this.urlService.lesson.delete.url(userId!, lessonId))
      .pipe(
        tap(() => {
          this.cacheService.clearCache('lessons');
          this.cacheService.invalidateCache(this.urlService.unit.get.allUrl());
        })
      );
  }

  getChallenges() {
    return this.http
      .get(this.urlService.challenge.get.allUrl(), {
        ...this.cacheOptions,
      })
      .pipe(catchError(this.handleError));
  }

  getChallengeById(challengeId: any) {
    return this.http
      .get(this.urlService.challenge.get.byIdUrl(challengeId), {
        ...this.cacheOptions,
      })
      .pipe(catchError(this.handleError));
  }

  createChallenge(payload: {
    question: string;
    type: 'SELECT' | 'ASSIST';
    lessonId: number;
    order: number;
  }) {
    const userId = this.userId;
    return this.http
      .post(this.urlService.challenge.post.url(userId!), payload)
      .pipe(
        tap(() =>
          this.cacheService.invalidateCache(
            this.urlService.challenge.get.allUrl()
          )
        )
      );
  }

  updateChallenge(
    challengeId: any,
    payload: {
      question: string;
      type: 'SELECT' | 'ASSIST';
      lessonId: number;
      order: number;
    }
  ) {
    const userId = this.userId;
    return this.http
      .patch(this.urlService.challenge.patch.url(userId!, challengeId), payload)
      .pipe(
        tap(() => {
          this.cacheService.clearCache('challenges');
        })
      );
  }

  deleteChallenge(challengeId: any) {
    const userId = this.userId;
    return this.http
      .delete(this.urlService.challenge.delete.url(userId!, challengeId))
      .pipe(
        tap(() => {
          this.cacheService.clearCache('challenges');
          this.cacheService.invalidateCache(
            this.urlService.lesson.get.allUrl()
          );
        })
      );
  }

  getChallengeOptions() {
    return this.http
      .get(this.urlService.challengeOption.get.allUrl(), {
        ...this.cacheOptions,
      })
      .pipe(catchError(this.handleError));
  }

  getChallengeByOptionId(challengeOptionId: any) {
    return this.http
      .get(this.urlService.challengeOption.get.byIdUrl(challengeOptionId), {
        ...this.cacheOptions,
      })
      .pipe(catchError(this.handleError));
  }

  createChallengeOption(payload: {
    text: string;
    correct: boolean;
    challengeId: number;
    imageSrc: string;
    audioSrc: string;
  }) {
    const userId = this.userId;
    return this.http
      .post(this.urlService.challengeOption.post.url(userId!), payload)
      .pipe(
        tap(() =>
          this.cacheService.invalidateCache([
            this.urlService.challengeOption.get.allUrl(),
            this.urlService.challenge.get.allUrl(),
          ])
        )
      );
  }

  updateChallengeOption(
    challengeOptionId: any,
    payload: {
      challengeId: number;
      text: string;
      correct: boolean;
      imageSrc: string;
      audioSrc: string;
    }
  ) {
    const userId = this.userId;
    return this.http
      .patch(
        this.urlService.challengeOption.patch.url(userId!, challengeOptionId),
        payload
      )
      .pipe(
        tap(() => {
          this.cacheService.invalidateCache([
            this.urlService.challengeOption.get.allUrl(),
            this.urlService.challengeOption.get.byIdUrl(challengeOptionId),
          ]);
        })
      );
  }

  deleteChallengeOption(challengeOptionId: any) {
    const userId = this.userId;
    return this.http
      .delete(
        this.urlService.challengeOption.delete.url(userId!, challengeOptionId)
      )
      .pipe(
        tap(() => {
          this.cacheService.invalidateCache([
            this.urlService.challengeOption.get.allUrl(),
            this.urlService.challenge.get.allUrl(),
          ]);
        })
      );
  }

  getMedia() {
    return this.http
      .get(this.urlService.media.get.url(), { ...this.cacheOptions })
      .pipe(catchError(this.handleError));
  }

  postMedia(payload: Omit<Media, 'id'>) {
    return this.http.post(this.urlService.media.post.url(), payload).pipe(
      tap(() => {
        this.cacheService.invalidateCache(this.urlService.media.get.url());
      })
    );
  }

  createInvitation(email: string) {
    return this.http.post(this.urlService.invitation.post(), { email });
  }

  getInvitations(page: number = 1, limit: number = 10) {
    return this.http.get(this.urlService.invitation.get(page, limit), {
      ...this.cacheOptions
    })
  }
  getTeam(page: number = 1, limit: number = 10) {
    return this.http.get(this.urlService.team.get(page, limit), {
      ...this.cacheOptions
    }).pipe(map((data: any) => {
      const team = (data as Staff[])
      let index: number = -1;
      const current = team.find((staff, i) => {
        if(staff.userId === this.userId){
          index = i
        }
        return staff.userId === this.userId
      })
      if (index > -1 && current) {
        team.splice(index, 1)
        team.unshift(current)
      }
      return team
    }))
  }



  private handleError(error: HttpErrorResponse) {
    if (error.status === 0)
      console.error(
        `There is an issue with the client or network: `,
        error.message
      );
    else console.error('There us an issue with the server: ', error.message);

    return throwError(() => error);
  }
}