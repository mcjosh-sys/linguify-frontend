import { ThemeService } from '@/app/services/theme.service';
import { Component, computed, Input, signal } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideMoon, lucideSun } from '@ng-icons/lucide';
import { hlm } from '@spartan-ng/ui-core';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { ClassValue } from 'class-variance-authority/types';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [HlmIconComponent],
  providers: [provideIcons({ lucideSun, lucideMoon })],
  template: `
    <hlm-icon size="sm" [name]="theme() === 'dark' ? 'lucideMoon' : 'lucideSun'" />
  `,
  host: {
    '[class]': '_computedClass()',
    '(click)': 'handleClick()'
  },
})
export class ThemeSwitcherComponent {
  protected theme = signal<'light' | 'dark'>('light');
  private _userClass = signal<ClassValue>('')

  protected readonly _computedClass = computed(() => {
    return hlm('h-9 w-9 text-primary flex items-center justify-center rounded-md border border-border cursor-pointer transition-colors ease-in-out duration-500 hover:bg-secondary', this._userClass(),
      this.theme() === 'light' && 'hover:text-green-500'
    )
  })

  constructor(private themeSerice: ThemeService) {
    this.themeSerice.theme$.subscribe(value => this.theme.set(value))
  }

  handleClick() {
    this.themeSerice.toggleDarkMode()
  }

  @Input()
  set class(cls: ClassValue){
    this._userClass.set(cls)
  }
}
