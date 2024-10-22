import { ConfirmModalService } from '@/app/services/confirm-modal.service';
import { Component } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { BrnDialogContentDirective } from '@spartan-ng/ui-dialog-brain';
import {
  HlmDialogComponent,
  HlmDialogContentComponent,
  HlmDialogDescriptionDirective,
  HlmDialogFooterComponent,
  HlmDialogHeaderComponent,
  HlmDialogTitleDirective,
} from '@spartan-ng/ui-dialog-helm';

@Component({
  selector: 'app-confirm-modal',
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
  templateUrl: './confirm-modal.component.html',
})
export class ConfirmModalComponent {
  protected readonly state = this.cmService.state;
  protected readonly title = this.cmService.title
  protected readonly message = this.cmService.message

  constructor(private cmService: ConfirmModalService) {}

  perfomAction() {
    const action = this.cmService.action()
    if (action) {
      action()
    }
  }
  closeModal() {
    this.cmService.title$.next('');
    this.cmService.message$.next('');
    this.cmService.state$.next('closed');
  }
}
