import { Injectable } from '@angular/core';
import { filter, Subject, Subscription } from 'rxjs';

type EventObj<T> = {
  name: string;
  payload?: T;
};

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private subject = new Subject();
  private subscriptions = new Subscription();

  emit<T>(event: EventObj<T>) {
    this.subject.next(event);
  }

  listen<T>(eventName: string[] | string, callback: (payload: T) => void) {
    const subscription = this.subject
      .asObservable()
      .pipe(
        filter((event: any) =>
          Array.isArray(eventName)
            ? eventName.includes(event.name)
            : event.name === eventName
        )
      )
      .subscribe((event) => {
        callback(event.payload as T);
      });

    return subscription
    // this.subject.asObservable().subscribe((value) => {
    //   const nextObj = value as EventObj;
    //   if (eventName === nextObj.name) callback(nextObj.payload);
    // });
  }
}
