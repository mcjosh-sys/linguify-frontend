import { environment } from '@/environments/environment';
import { Injectable } from '@angular/core';
import { Clerk } from '@clerk/clerk-js';
import {
  SignInProps,
  SignUpProps,
  UserButtonProps,
} from '@clerk/clerk-js/dist/types/ui/types';
import {
  BehaviorSubject,
  catchError,
  filter,
  from,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';

@Injectable()
export class ClerkService {
  private _clerk!: Clerk;
  private loaded$ = new BehaviorSubject<boolean>(false);

  constructor() {}

  load(): Observable<boolean> {
    if (!this._clerk) {
      this._clerk = new Clerk(environment.clerkPubKey);
    }
    return from(
      this._clerk.load({
        signUpUrl: '/signup',
        signInUrl: '/signin',
        signUpForceRedirectUrl: '/learn?__auth=true',
        signInForceRedirectUrl: '/learn?__auth=true',
        signInFallbackRedirectUrl: '/learn?__auth=true',
        signUpFallbackRedirectUrl: '/learn?__auth=true',
        afterSignOutUrl: '/',
      })
    ).pipe(
      switchMap(() => of(true)),
      tap((loaded) => {
        this.loaded$.next(loaded);
      }),
      catchError((error: any) => {
        console.log('Clerk error: ', error);
        return of(error);
      })
    );
  }

  get loaded() {
    return this.loaded$.asObservable();
  }

  get user() {
    return this._clerk?.user;
  }

  get clerk() {
    return this._clerk;
  }

  auth() {
    return of(this._clerk.user);
  }

  mount<T extends 'signIn' | 'signUp' | 'userButton'>(
    ...args: T extends 'userButton'
      ? [type: T, node: HTMLDivElement, props?: UserButtonProps]
      : T extends 'signIn'
      ? [type: T, node: HTMLDivElement, props?: SignInProps]
      : [type: T, node: HTMLDivElement, props?: SignUpProps]
  ) {
    const [type, node, props] = args;
    return this.loaded$.pipe(
      filter((loaded) => loaded),
      tap((value) => {
        if (value) {
          switch (type) {
            case 'signIn':
              this._clerk.mountSignIn(node, props);
              break;
            case 'signUp':
              this._clerk.mountSignUp(node, props);
              break;
            case 'userButton':
              this._clerk.mountUserButton(node, props);
              break;
          }
        }
      })
    );
  }
}
