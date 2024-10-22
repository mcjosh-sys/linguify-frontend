import { ClerkService } from '@/app/services/clerk.service';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [],
  template: `<div #container></div> `,
  host: {
    class: 'h-full flex flex-col items-center justify-center',
  },
})
export class SignUpComponent {
  private _signUpSub?: Subscription;
  constructor(private clerkService: ClerkService) {}

  @ViewChild('container') containerRef!: ElementRef<HTMLDivElement>;
  ngAfterViewInit() {
    this._signUpSub = this.clerkService
      .mount('signUp', this.containerRef.nativeElement)
      .subscribe();
  }

  ngOnDestroy() {
    this._signUpSub && this._signUpSub.unsubscribe()
  }
}
