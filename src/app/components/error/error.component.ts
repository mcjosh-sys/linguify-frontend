import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [RouterLink, HlmButtonDirective],
  template: `
    <div
      class="w-full h-full flex flex-col items-center justify-center text-muted-foreground px-6 text-center"
    >
      <h1 class="text-lg font-bold">{{ title }}</h1>
      <p>{{ description }}</p>
      <span>
        Go to
        <a
          [routerLink]="redirectLinkUrl"
          class="mt-4 lowercase text-sky-600 hover:border-b border-sky-600"
        >
          {{ redirectLinkText }}.
        </a>
      </span>
    </div>
  `,
})
export class ErrorComponent {
  protected title = '';
  protected description = '';
  protected redirectLinkText = '';
  protected redirectLinkUrl = '';
  constructor(private router: Router) {
    const navExtras = this.router.getCurrentNavigation()?.extras;
    this.title = navExtras?.state?.['error']?.message.title;
    this.description = navExtras?.state?.['error']?.message.description;
    this.redirectLinkText = navExtras?.state?.['error']?.redirect.text;
    this.redirectLinkUrl = navExtras?.state?.['error']?.redirect.url;
  }
}
