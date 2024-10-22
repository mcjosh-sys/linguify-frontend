import { Injectable } from '@angular/core';
import { urlBuilder } from './url.service';
import { UserService } from './user.service';

type UrlGroup = {
  get: {
    allUrl: () => string;
    byIdUrl: (id: string) => string;
  };
  post: {
    url: (userId: string) => string;
  };
  patch: {
    url: (userId: string, id: string) => string;
  };
  delete: {
    url: (userId: string, id: string) => string;
  };
};

@Injectable({
  providedIn: 'root',
})
export class AdminUrlService {
  private readonly _userId = this.userService.currentUser?.id;
  constructor(private userService: UserService) {}

  get user() {
    return {
      get: {
        isAdmin: (userId: string) => urlBuilder(['admin', userId, 'is-admin']),
        isStaff: (userId: string) => urlBuilder(['admin', userId, 'is-staff']),
        hasPermission: (userId: string, courseId: any) =>
          urlBuilder(['admin', 'permission', 'has-permission'], {
            userId,
            courseId,
          }),
      },
      post: {},
      patch: {},
    };
  }

  get team() {
    return {
      get: (page: number, limit: number) => urlBuilder(['admin', 'team'], {page, limit})
    }
  }

  get invitation() {
    return {
      get: (page: number, limit: number) => urlBuilder(['invitations'], {page, limit}),
      post: () => urlBuilder(['invitations']),
      delete: (invitationId: number) =>
        urlBuilder(['invitations', invitationId]),
    };
  }

  get course(): UrlGroup {
    return {
      get: {
        byIdUrl: (courseId) => urlBuilder(['courses', courseId]),
        allUrl: () => urlBuilder(['courses']),
      },
      post: {
        url: (userId) => urlBuilder(['courses', userId]),
      },
      patch: {
        url: (userId, courseId) => urlBuilder(['courses', userId, courseId]),
      },
      delete: {
        url: (userId, courseId) =>
          urlBuilder(['courses', userId, courseId]),
      },
    };
  }

  get unit(): UrlGroup {
    return {
      get: {
        byIdUrl: (unitId) => urlBuilder(['units', unitId]),
        allUrl: () => urlBuilder(['units']),
      },
      post: {
        url: (userId) => urlBuilder(['units', userId]),
      },
      patch: {
        url: (userId, unitId) => urlBuilder(['units', userId, unitId]),
      },
      delete: {
        url: (userId, unitId) => urlBuilder(['units', userId, unitId]),
      },
    };
  }

  get lesson(): UrlGroup {
    return {
      get: {
        byIdUrl: (lessonId) => urlBuilder(['lessons', lessonId]),
        allUrl: () => urlBuilder(['lessons']),
      },
      post: {
        url: (userId) => urlBuilder(['lessons', userId]),
      },
      patch: {
        url: (userId, lessonId) => urlBuilder(['lessons', userId, lessonId]),
      },
      delete: {
        url: (userId, lessonId) =>
          urlBuilder(['lessons', userId, lessonId]),
      },
    };
  }

  get challenge(): UrlGroup {
    return {
      get: {
        byIdUrl: (challengeId) => urlBuilder(['challenges', challengeId]),
        allUrl: () => urlBuilder(['challenges']),
      },
      post: {
        url: (userId) => urlBuilder(['challenges', userId]),
      },
      patch: {
        url: (userId, challengeId) => urlBuilder(['challenges', userId, challengeId]),
      },
      delete: {
        url: (userId, challengeId) =>
          urlBuilder(['challenges', userId, challengeId]),
      },
    };
  }
  get challengeOption(): UrlGroup {
    return {
      get: {
        byIdUrl: (challengeOptionId) =>
          urlBuilder(['challenge-options', challengeOptionId]),
        allUrl: () => urlBuilder(['challenge-options']),
      },
      post: {
        url: (userId) => urlBuilder(['challenge-options', userId]),
      },
      patch: {
        url: (userId, challengeOptionId) => urlBuilder(['challenge-options', userId, challengeOptionId]),
      },
      delete: {
        url: (userId, challengeOptionId) =>
          urlBuilder(['challenge-options', userId, challengeOptionId]),
      },
    };
  }

  get media() {
    return {
      get: {
        url: () => urlBuilder(['media']),
      },
      post: {
        url: () => urlBuilder(['media']),
      },
      patch: {
        url: (id: string) => urlBuilder(['media', id]),
      },
    };
  }
}
