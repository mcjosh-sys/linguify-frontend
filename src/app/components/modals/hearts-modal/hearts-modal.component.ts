import { close } from '@/app/store/actions/hearts-modal.actions';
import { HeartsModalState } from '@/app/store/reducers/hearts-modal.reducer';
import { Component, Signal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import {
  BrnDialogContentDirective,
  BrnDialogState,
} from '@spartan-ng/ui-dialog-brain';
import {
  HlmDialogComponent,
  HlmDialogContentComponent,
  HlmDialogDescriptionDirective,
  HlmDialogFooterComponent,
  HlmDialogHeaderComponent,
  HlmDialogTitleDirective,
} from '@spartan-ng/ui-dialog-helm';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-hearts-modal',
  standalone: true,
  imports: [
    BrnDialogContentDirective,
    HlmDialogComponent,
    HlmDialogContentComponent,
    HlmDialogDescriptionDirective,
    HlmDialogFooterComponent,
    HlmDialogHeaderComponent,
    HlmDialogTitleDirective,
    HlmButtonDirective,
  ],
  templateUrl: './hearts-modal.component.html',
  host: {
    class: 'w-full',
  },
})
export class HeartsModalComponent {
  isOpen$!: Observable<BrnDialogState>;
  protected readonly state!: Signal<BrnDialogState | undefined>;

  constructor(
    protected store: Store<{ heartModal: HeartsModalState }>,
    protected router: Router
  ) {
    this.isOpen$ = this.store.select((state) => state.heartModal.state);
    this.state = toSignal(this.isOpen$!);
  }

  closeModal() {
    this.store.dispatch(close());
  }
}
