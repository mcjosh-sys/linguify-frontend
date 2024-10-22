import { ClerkService } from '@/app/services/clerk.service';
import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-clerk-loading',
  standalone: true,
  imports: [],
  template: `
    @if(!loaded()){
    <ng-content />
    }
  `,
  host: {
    '[class]': 'className()',
  },
})
export class ClerkLoadingComponent {
  public readonly className = input<string>('', { alias: 'class' });
  loaded = signal<boolean>(false);

  constructor(private clerkService: ClerkService) {}

  ngOnInit() {
    this.clerkService.loaded.subscribe((value) => this.loaded.set(value));
  }
}
