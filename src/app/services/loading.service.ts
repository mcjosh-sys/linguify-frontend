import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private _loading$ = new BehaviorSubject<boolean>(false);

  get isLoading() {
    return this._loading$.asObservable();
  }

  start() {
    this._loading$.next(true);
  }

  stop() {
    this._loading$.next(false);
  }
}
