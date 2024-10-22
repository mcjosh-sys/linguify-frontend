import { Component, Signal, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ExitModalState } from '@/app/store/reducers/exit-modal.reducer';
import { BrnDialogContentDirective, BrnDialogState } from '@spartan-ng/ui-dialog-brain';
import {
  HlmDialogComponent,
  HlmDialogContentComponent,
  HlmDialogDescriptionDirective,
  HlmDialogFooterComponent,
  HlmDialogHeaderComponent,
  HlmDialogTitleDirective,
} from '@spartan-ng/ui-dialog-helm';
import {HlmButtonDirective } from '@spartan-ng/ui-button-helm'
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { close } from '@/app/store/actions/exit-modal.actions';

@Component({
  selector: 'app-exit-modal',
  standalone: true,
  imports: [
    BrnDialogContentDirective,
    HlmDialogComponent,
    HlmDialogContentComponent,
    HlmDialogDescriptionDirective,
    HlmDialogFooterComponent,
    HlmDialogHeaderComponent,
    HlmDialogTitleDirective,
    HlmButtonDirective
  ],
  templateUrl: './exit-modal.component.html',
  host: {
    'class':'w-full'
  }
})
export class ExitModalComponent {

  isOpen$!: Observable<BrnDialogState>
  protected readonly state!: Signal<BrnDialogState | undefined>

  isClient = signal<boolean>(false)

  constructor(protected store: Store<{ exitModal: ExitModalState }>, protected router: Router) {
    this.isOpen$ = this.store.select(state => state.exitModal.state)
    this.state = toSignal(this.isOpen$!)
   }
  
  closeModal() {
    this.store.dispatch(close())
  }

}
