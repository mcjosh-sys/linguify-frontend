import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-challenges',
  standalone: true,
  imports: [RouterOutlet],
  template:`<router-outlet />`
})
export class ChallengesComponent {

}
