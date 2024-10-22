import { Component, computed, EventEmitter, Input, Output, signal } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideListPlus, lucidePlus } from '@ng-icons/lucide';
import { ButtonVariants, HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { hlm } from '@spartan-ng/ui-core';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { cva, VariantProps } from 'class-variance-authority';
import { ClassValue } from 'class-variance-authority/types';

export const createButtonVariants = cva('', {
  variants: {
    variant: {
      default: '',
      rounded: 'rounded-full w-[3.5rem] h-[3.5rem]',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export type CreateButtonVariants = VariantProps<typeof createButtonVariants>;

@Component({
  selector: 'app-admin-create-button',
  standalone: true,
  imports: [HlmButtonDirective, HlmIconComponent],
  providers: [provideIcons({ lucidePlus, lucideListPlus })],
  template: `
    <button hlmBtn variant="primary" [class]="_computedClass()" (click)="handleClick()">
      <hlm-icon name="lucidePlus" size="xs"  />
      {{ _text() }}
    </button>
  `,
})
export class CreateButtonComponent {
  protected readonly _text = signal<string>('');
  private readonly _userClass = signal<ClassValue>('');
  private readonly _variant =
    signal<CreateButtonVariants['variant']>('default');
  protected readonly _size = signal<ButtonVariants['size']>('default');

  protected readonly _computedClass = computed(() =>
    hlm(
      'flex items-center justify-center gap-1 rounded-md capitalize',
      this._userClass(),
      createButtonVariants({ variant: this._variant() })
    )
  );

  @Input()
  set text(value: string) {
    this._text.set(value);
  }
  @Input()
  set variant(value: CreateButtonVariants['variant']) {
    this._variant.set(value);
  }

  @Input()
  set class(value: ClassValue) {
    this._userClass.set(value);
  }

  @Output() onClick = new EventEmitter<void>()

  handleClick() {
    this.onClick.emit()
  }
}
