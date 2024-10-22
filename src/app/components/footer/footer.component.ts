import { Component } from '@angular/core';

import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [HlmButtonDirective],
  templateUrl: './footer.component.html',
})
export class FooterComponent {

}
