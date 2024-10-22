import { cn } from '@/lib/utils';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClassValue } from 'clsx';
import { SidebarItemComponent } from '../sidebar-item/sidebar-item.component';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { provideIcons } from '@ng-icons/core';
import { lucideLoader } from '@ng-icons/lucide';
import { ClerkLoadedComponent } from '../clerk/clerk-loaded/clerk-loaded.component';
import { ClerkLoadingComponent } from '../clerk/clerk-loading/clerk-loading.component';
import { UserButtonComponent } from '../clerk/user-button/user-button.component';

const cls: ClassValue =
  'flex h-full lg:w-[256px] lg:fixed left-0 top-0 border-r-2 flex-col';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, SidebarItemComponent, HlmIconComponent, ClerkLoadedComponent, ClerkLoadingComponent, UserButtonComponent],
  providers: [provideIcons({lucideLoader})],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  public readonly className = input<ClassValue>('', { alias: 'class' });

  public _computedClass = computed<string>(() => {
    return cn(cls, this.className());
  });

}
