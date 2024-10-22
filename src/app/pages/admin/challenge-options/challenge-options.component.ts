import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-challenge-options',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class ChallengeOptionsComponent {}
