import {
  Injectable,
  OnDestroy,
  Renderer2,
  RendererFactory2,
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class KeyListenerService implements OnDestroy {
  private renderer!: Renderer2;
  private keydownSubject = new Subject<KeyboardEvent>();
  private keydownSubscription!: Subscription;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.keydownSubscription = this.keydownSubject.subscribe();
    this.renderer.listen('window', 'keydown', (event: KeyboardEvent) =>
      this.keydownSubject.next(event)
    );
  }

  listen(keys: string[], callback: () => void): Subscription {
    const subscription = this.keydownSubject.subscribe(
      (event: KeyboardEvent) => {
        if (keys.includes(event.key)) {
          callback()
        }
      }
    );
    return subscription
  }

  ngOnDestroy(): void {
    this.keydownSubscription.unsubscribe()
  }
}
