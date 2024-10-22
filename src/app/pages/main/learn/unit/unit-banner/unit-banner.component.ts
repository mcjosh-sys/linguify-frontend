import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

@Component({
  selector: 'app-unit-banner',
  standalone: true,
  imports: [RouterLink, HlmButtonDirective],
  templateUrl: './unit-banner.component.html',
})
export class UnitBannerComponent {
  title = input<string>()
  description = input<string>()

}
