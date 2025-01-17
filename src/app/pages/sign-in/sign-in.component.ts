import { ClerkService } from '@/app/services/clerk.service';
import { RouterStateService } from '@/app/services/router-state.service';
import {
  Component,
  DestroyRef,
  ElementRef,
  signal,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [],
  template: `<div #containerRef></div>`,
  host: {
    class: 'w-full h-full flex flex-col items-center justify-center',
  },
})
export class SignInComponent {
  @ViewChild('containerRef') containerRef!: ElementRef<HTMLDivElement>;
  private readonly _signInUrl = signal<string>('/learn?__auth=true');

  constructor(
    private readonly clerkService: ClerkService,
    private readonly routerState: RouterStateService,
    private readonly destroyRef: DestroyRef
  ) {
    if (
      this.routerState.afterAuthUrl
    ) {
      this._signInUrl.set(this.routerState.afterAuthUrl);
    }
  }

  ngAfterViewInit() {
    this.clerkService
      .mount('signIn', this.containerRef.nativeElement, {
        forceRedirectUrl: this._signInUrl(),
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ error: (err: any) => console.log(err.message) });
  }
}
