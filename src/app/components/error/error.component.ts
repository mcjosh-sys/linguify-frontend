import { RouterStateService } from '@/app/services/router-state.service';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div
      class="w-full h-full flex flex-col items-center justify-center text-muted-foreground px-6 text-center"
    >
      <h1 class="text-lg font-bold">{{ title }}</h1>
      <p>{{ description }}</p>
      <span>
        Go back to
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
  protected title = 'Aww, Snap!';
  protected description = 'An unexpected error occurred';
  protected redirectLinkText = 'Learn Page';
  protected redirectLinkUrl = '/learn';

  constructor(private readonly routerState: RouterStateService) {
    if (this.routerState.hasError) {
      this.title = routerState.error!.message.title;
      this.description = routerState.error!.message.description;
      this.redirectLinkText = routerState.error!.redirect.label;
      this.redirectLinkUrl = routerState.error!.redirect.url;
    }
  }

  ngOnDestroy() {
    this.routerState.clearError();
  }
}
