import { KeyListenerService } from '@/app/services/key-listener.service';
import { MediaService, MediaSubscription } from '@/app/services/media.service';
import { Component, EventEmitter, Output, input } from '@angular/core';
import { Router } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { lucideCheckCircle, lucideXCircle } from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { hlm } from '@spartan-ng/ui-core';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-quiz-footer',
  standalone: true,
  imports: [HlmButtonDirective, HlmIconComponent],
  providers: [provideIcons({ lucideCheckCircle, lucideXCircle })],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  disabled = input<boolean>(false);
  status = input<'correct' | 'wrong' | 'none' | 'completed'>();
  lessonId = input<number>();

  mediaSubscription!: MediaSubscription;
  isMobile!: boolean;
  keySubscription!: Subscription;

  hlm = hlm;

  @Output() onCheck = new EventEmitter();

  constructor(
    private mediaService: MediaService,
    private keyListenerService: KeyListenerService,
    protected router: Router
  ) {}

  ngOnInit() {
    this.isMobile = this.mediaService.init('(max-width: 1024px)');
    this.mediaSubscription = this.mediaService.subscribe((matches) => {
      this.isMobile = matches;
    });

    this.keySubscription = this.keyListenerService.listen(
      ['Enter'],
      this.handleCheck.bind(this)
    );
  }

  ngOnDestroy() {
    if (this.mediaSubscription) this.mediaSubscription.unsubscribe();
    if (this.keySubscription) this.keySubscription.unsubscribe();
  }

  handleCheck() {
    this.onCheck.emit();
  }

  onPracticeAgain() {
    const url = `${this.router.url.split('?')[0]}?${Date.now()}`;
    this.router.navigateByUrl(url, { skipLocationChange: true });
  }
}
