import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideLoader } from '@ng-icons/lucide';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [HlmIconComponent],
  providers: [provideIcons({ lucideLoader })],
  template: ` <hlm-icon
    name="lucideLoader"
    class="text-muted-foreground animate-spin"
  />`,
  host: {
    class: 'h-full w-full flex items-center justify-center',
  },
})
export class LoadingComponent {}
