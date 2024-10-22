import { ClerkService } from '@/app/services/clerk.service';
import {
  Component,
  DestroyRef,
  ElementRef,
  signal,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

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
  private _signInUrl = signal<string>('/learn?__auth=true');

  constructor(
    private clerkService: ClerkService,
    private router: Router,
    private destroyRef: DestroyRef
  ) {
    const navigation = this.router.getCurrentNavigation()
    if (
      navigation?.extras &&
      navigation.extras.state &&
      navigation.extras.state['returnUrl']
    ) {
      this._signInUrl.set(navigation.extras.state['returnUrl']);
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
