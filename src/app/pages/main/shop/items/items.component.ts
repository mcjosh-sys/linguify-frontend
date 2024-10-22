import { FULL_HEART, POINTS_TO_REFILL } from '@/app/constants';
import { StripeService } from '@/app/services/stripe.service';
import { UserProgressService } from '@/app/services/user-progress.service';
import { Component, EventEmitter, input, Output } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { toast } from 'ngx-sonner';
import { finalize, Subscription } from 'rxjs';

@Component({
  selector: 'app-shop-items',
  standalone: true,
  imports: [HlmButtonDirective],
  templateUrl: './items.component.html',
  host: {
    class: 'w-full',
  },
})
export class ItemsComponent {
  hearts = input<number>(0);
  points = input<number>(0);
  hasActiveSubscription = input<boolean>(false);

  pending = false;
  private subscriptions = new Subscription();

  FULL_HEART!: number;
  POINTS_TO_REFILL!: number;

  constructor(
    private userProgressService: UserProgressService,
    private stripeService: StripeService
  ) {
    this.FULL_HEART = FULL_HEART;
    this.POINTS_TO_REFILL = POINTS_TO_REFILL;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  onRefillHearts() {
    if (
      this.pending ||
      this.hearts() === this.FULL_HEART ||
      this.points() < this.POINTS_TO_REFILL
    ) {
      return;
    }

    this.pending = true;
    const subscription = this.userProgressService
      .refillHeart()
      .pipe(finalize(() => (this.pending = false)))
      .subscribe({
        next: () => this.refresh.emit(),
        error: (err: any) => {
          toast.error('Something went wrong. Please try again.');
          console.log(err.message);
        },
      });

    this.subscriptions.add(subscription);
  }

  onUpgrade() {
    this.pending = true;
    const subscription = this.stripeService.createStripeUrl().subscribe({
      next: (res: any) => (window.location.href = res.data),
      error: (err: any) => {
        toast.error('Something went wrong. Please try again.');
        console.log(err.message);
      },
    });

    this.subscriptions.add(subscription);
  }

  @Output() refresh = new EventEmitter();
}
