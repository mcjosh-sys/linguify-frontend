import { EventService } from '@/app/services/event.service';
import { Component, input, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { BrnSheetCloseDirective } from '@spartan-ng/ui-sheet-brain';
import { HlmSheetCloseDirective } from '@spartan-ng/ui-sheet-helm';

@Component({
  selector: 'app-sidebar-item',
  standalone: true,
  imports: [
    HlmButtonDirective,
    HlmSheetCloseDirective,
    BrnSheetCloseDirective,
    RouterLink,
    RouterLinkActive,
  ],
  template: `
    <a
      hlmBtn
      class="justify-start h-[52px] w-full"
      variant="sidebar"
      [routerLink]="link()"
      routerLinkActive="active-sidebar-item-link"
      (click)="close()"
      #sidebarLink
      brnSheetClose
    >
      <img [src]="iconSrc()" alt="label" class="mr-5" height="32" width="32" />
      {{ label() }}
    </a>
  `,
  styleUrl: './sidebar-item.component.css'
})
export class SidebarItemComponent {
  public readonly label = input<string>('');
  public readonly iconSrc = input<string>('');
  public readonly link = input<string>('');
  active = signal<boolean>(false);

  constructor(private eventService: EventService) {}
  close() {
    this.eventService.emit({ name: 'close-sheet' });
  }
}
