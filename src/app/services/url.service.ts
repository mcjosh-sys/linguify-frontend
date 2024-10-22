import { environment } from '@/environments/environment';
import { Injectable } from '@angular/core';
import { UserService } from './user.service';

type PathSegment = string | number | undefined;

export function urlBuilder(
  pathSegments: PathSegment[],
  queryParams?: { [key: string]: any }
): string {
  const BASE_URL = environment.apiUrl;
  const path = pathSegments.map((segment) => `${segment}`).join('/');

  let url = `${BASE_URL}/${path}`;

  if (queryParams) {
    const queryString = Object.keys(queryParams)
      .map(
        (key) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`
      )
      .join('&');
    url += `?${queryString}`;
  }

  return url;
}

@Injectable({
  providedIn: 'root',
})
export class UrlService {
  private readonly _userId = this.userService.currentUser?.id;
  constructor(private userService: UserService) {}

  get user() {
    return {
      get: {
        progressUrl: () => {
          return urlBuilder(['users', this._userId, 'progress']);
        },
        subscriptionUrl: () =>
          urlBuilder(['users', this._userId, 'subscription']),
        unitsUrl: () => urlBuilder(['users', this._userId, 'learn/units']),
        courseProgressUrl: () =>
          urlBuilder(['users', this._userId, 'learn/course/progress']),
        lessonUrl: (id?: number) => {
          if (id) {
            return urlBuilder(['users', this._userId, 'learn/lesson', id]);
          }
          return urlBuilder(['users', this._userId, 'learn/lesson']);
        },
        lessonPercentageUrl: () =>
          urlBuilder([
            'users',
            this._userId,
            'learn/lesson/progress/percentage',
          ]),
        topTenUsersUrl: () => urlBuilder(['users', 'top-ten-users']),
      },
      post: {
        progressUrl: () => urlBuilder(['users', this._userId, 'progress']),
      },
      patch: {
        progressUrl: () => urlBuilder(['users', this._userId, 'progress']),
        reduceHeartUrl: () =>
          urlBuilder(['users', this._userId, 'progress/hearts/reduce']),
        refillHeartUrl: () =>
          urlBuilder(['users', this._userId, 'progress/hearts/refill']),
      },
    };
  }

  get course() {
    return {
      get: {
        courseByIdUrl: (id: number) => urlBuilder(['courses', id]),
        coursesUrl: () => urlBuilder(['courses']),
      },
      post: {},
      patch: {},
    };
  }

  get challenge() {
    return {
      get: {
        progressUrl: (challengeId: number) =>
          urlBuilder([
            'challenges',
            challengeId,
            'users',
            this._userId,
            'progress',
          ]),
      },
      post: {
        progressUrl: (challengeId: number) =>
          urlBuilder(['challenges', challengeId, 'progress']),
      },
      patch: {
        progressUrl: (challengeId: number) =>
          urlBuilder(['challenges', challengeId, 'progress']),
      },
    };
  }

  get stripe() {
    return {
      get: {},
      post: {
        createStripeUrl: () =>
          urlBuilder([
            'subscription',
            this._userId,
            'create-stripe-url',
          ]),
      },
      patch: {},
    };
  }
}
