import { Directive, Input, computed, input, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ClassValue } from 'clsx';

export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background uppercase tracking-wide',
  {
    variants: {
      variant: {
        locked:
          'bg-neutral-200 text-primary-foreground hover:bg-neutral-200/90 border-neutral-400 border-b-4 active:border-b-0',
        default:
          'bg-white text-black border-slate-200 border-2 border-b-4 active:border-b-2 hover:bg-slate-100 text-slate-500',
        primary:
          'bg-sky-400 text-primary-foreground hover:bg-sky-400/90 border-sky-500 border-b-4 active:border-b-0',
        primaryOutline: 'bg-white text-sky-500 hover:bg-slate-100',
      secondary:
          'bg-green-500 text-primary-foreground hover:bg-green-500/90 border-green-600 border-b-4 active:border-b-0',
        secondaryOutline: 'bg-white text-green-500 hover:bg-slate-100',
        danger:
          'bg-rose-500 text-primary-foreground hover:bg-rose-500/90 border-rose-600 border-b-4 active:border-b-0',
        dangerOutline: 'bg-white text-rose-500 hover:bg-slate-100',
        super:
          'bg-indigo-500 text-primary-foreground hover:bg-indigo-500/90 border-indigo-600 border-b-4 active:border-b-0',
        superOutline: 'bg-white text-indigo-500 hover:bg-slate-100',
        ghost:
          'bg-transparent text-slate-500 border-transparent border-0 hover:bg-slate-100',
        sidebar:
          'bg-transparent text-slate-500 border-2 border-transparent hover:bg-secondary transition-none',
        sidebarOutline: 'bg-sky-500/15 text-sky-500 border-sky-300 border-2 hover:bg-sky-500/20 transition-none',
        normal: 'capitalize rounded-md hover:bg-secondary',
        normalOutline: 'capitalize rounded-md border border-border hover:bg-secondary',
        none: ''
      },
      size: {
        default: 'h-11 py-2 px-4',
        sm: 'h-9 px-3',
        lg: 'h-12 px-8',
        icon: 'h-10 w-10',
        rounded: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
export type ButtonVariants = VariantProps<typeof buttonVariants>;

@Directive({
	selector: '[hlmBtn]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmButtonDirective {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	private readonly _settableClass = signal<ClassValue>('');

	protected _computedClass = computed(() =>
		hlm(buttonVariants({ variant: this._variant(), size: this._size() }), this._settableClass(), this.userClass()),
	);

	setClass(value: ClassValue) {
		this._settableClass.set(value);
	}

	private readonly _variant = signal<ButtonVariants['variant']>('default');
	@Input()
	set variant(variant: ButtonVariants['variant']) {
		this._variant.set(variant);
	}

	private readonly _size = signal<ButtonVariants['size']>('default');
	@Input()
	set size(size: ButtonVariants['size']) {
		this._size.set(size);
	}
}
