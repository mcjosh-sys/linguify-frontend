import { Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BrnDialogState } from '@spartan-ng/ui-dialog-brain';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfirmModalService {
  state$ = new Subject<BrnDialogState>();
  state = toSignal(this.state$);

  action$ = new Subject<() => void>();
  action = toSignal(this.action$);

  title$ = new Subject<string>();
  title = toSignal(this.title$);

  message$ = new Subject<string>();
  message = toSignal(this.message$);

  constructor() {}
}
