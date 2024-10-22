import {
  HttpClient,
  HttpContext,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CACHING_ENABLED, PAGE_URL } from '@tokens/caching-enabled.token';
import { catchError, throwError } from 'rxjs';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root',
})
export class CourseService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private urlService: UrlService
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

  getCourses() {
    return this.http
      .get(this.urlService.course.get.coursesUrl(), {
        ...this.cacheOptions,
      })
      .pipe(catchError(this.handleError));
  }

  getCourseById(id: number) {
    return this.http
      .get(this.urlService.course.get.courseByIdUrl(id), { ...this.cacheOptions })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0)
      console.error(
        `There is an issue with the client or network: `,
        error.message
      );
    else console.error('There us an issue with the server: ', error.message);

    return throwError(
      () =>
        new Error('Cannot retrieve courses from the server. Please try again.')
    );
  }
}
