import { SidebarItemComponent } from '@/app/components/sidebar-item/sidebar-item.component';
import { Component, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [SidebarItemComponent],
  templateUrl: './sidebar.component.html',
  host: {
    '[class]': '_computedClass()',
  },
})
export class SidebarComponent {
  userClass = input<string>('', { alias: 'class' });

  protected readonly _computedClass = computed(() => {
    return hlm(
      'flex h-full md:w-[256px] md:z-[50] md:fixed left-0 top-0 md:border-r-2 flex-col bg-background border-border',
      this.userClass()
    );
  });
}
