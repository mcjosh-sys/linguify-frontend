import { close } from '@/app/store/actions/practice-modal.actions';
import { PracticeModalState } from '@/app/store/reducers/practice-modal.reducer';
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
  selector: 'app-practice-modal',
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
  templateUrl: './practice-modal.component.html',
  host: {
    class: 'w-full',
  },
})
export class PracticeModalComponent {
  isOpen$!: Observable<BrnDialogState>;
  protected readonly state!: Signal<BrnDialogState | undefined>;

  isClient = signal<boolean>(false);

  constructor(
    protected store: Store<{ practiceModal: PracticeModalState }>,
    protected router: Router
  ) {
    this.isOpen$ = this.store.select((state) => state.practiceModal.state);
    this.state = toSignal(this.isOpen$!);
  }

  closeModal() {
    this.store.dispatch(close());
  }
}
