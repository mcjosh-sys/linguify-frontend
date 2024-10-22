import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { lucideArrowLeft } from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm'
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';

@Component({
  selector: 'app-feed-header',
  standalone: true,
  imports: [RouterLink, HlmButtonDirective, HlmIconComponent],
  providers: [provideIcons({lucideArrowLeft})],
  templateUrl: './feed-header.component.html',
  styleUrl: './feed-header.component.css'
})
export class FeedHeaderComponent {
  title = input<string>('')

}
