import { ClerkService } from '@/app/services/clerk.service';
import { Component, ElementRef, ViewContainerRef, input } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-button',
  standalone: true,
  imports: [],
  template: ``,
})
export class UserButtonComponent {
  public readonly userClass = input<string>('', { alias: 'class' });
  private _userButtonSub?: Subscription;

  constructor(
    private container: ElementRef,
    private clerkService: ClerkService
  ) {}

  ngOnInit() {
    this.clerkService
      .mount('userButton', this.container.nativeElement, {
        appearance: {
          elements: {
            userButtonAvatarBox: this.userClass(),
          },
        },
      })
      .subscribe({ error: (err: any) => console.log(err.message) });
  }
}
