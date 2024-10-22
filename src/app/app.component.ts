import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HlmToasterComponent } from '@spartan-ng/ui-sonner-helm';
import { ExitModalComponent } from './components/modals/exit-modal/exit-modal.component';
import { HeartsModalComponent } from './components/modals/hearts-modal/hearts-modal.component';
import { PracticeModalComponent } from './components/modals/practice-modal/practice-modal.component';
import { ConfirmModalComponent } from './components/modals/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HlmToasterComponent,
    ExitModalComponent,
    HeartsModalComponent,
    PracticeModalComponent,
    ConfirmModalComponent,
  ],
  template: `
    <hlm-toaster position="top-right" />
    <app-exit-modal />
    <app-hearts-modal />
    <app-practice-modal />
    <app-confirm-modal />
    <router-outlet />
  `,
  styleUrl: './app.component.css',
  host: {
    class: 'w-full',
  },
})
export class AppComponent {
  constructor() {}

  async ngOnInit() {}
}
