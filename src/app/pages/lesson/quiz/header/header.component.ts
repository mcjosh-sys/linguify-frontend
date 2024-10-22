import { LinearProgressComponent } from '@/app/components/linear-progress/linear-progress.component';
import { open } from '@/app/store/actions/exit-modal.actions';
import { ExitModalState } from '@/app/store/reducers/exit-modal.reducer';
import { Component, input } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideInfinity, lucideX } from '@ng-icons/lucide';
import { Store } from '@ngrx/store';

import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';


@Component({
  selector: 'app-quiz-header',
  standalone: true,
  imports: [
    HlmIconComponent,
    LinearProgressComponent
  ],
  providers: [provideIcons({ lucideX, lucideInfinity })],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  hearts = input<number>();
  percentage = input<number>();
  hasActiveSubscription = input<boolean>();

  constructor(protected store: Store<ExitModalState>) { }
  
  openModal() {
    this.store.dispatch(open())
  }
  
}
