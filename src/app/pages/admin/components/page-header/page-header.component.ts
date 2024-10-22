import { booleanAttribute, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { BrnSeparatorComponent } from '@spartan-ng/ui-separator-brain';
import { HlmSeparatorDirective } from '@spartan-ng/ui-separator-helm';
import { CreateButtonComponent } from '../create-button/create-button.component';

@Component({
  selector: 'app-admin-page-header',
  standalone: true,
  imports: [
    HlmSeparatorDirective,
    BrnSeparatorComponent,
    CreateButtonComponent,
  ],
  template: `
    <div
      class="flex items-center justify-between"
      (click)="$event.stopPropagation()"
    >
      <div class="flex flex-col gap-2">
        @if(_super()){
        <span>{{ _super() }}</span>
        }
        <h1 class="font-bold text-2xl capitalize">
          {{ _title() }}@if(_listLength()){({{ _listLength() }})}
        </h1>
        @if(_desc()){
        <p class="text-muted-foreground">{{ _desc() }}</p>
        }
      </div>
      @if(_showBtn()){<app-admin-create-button
        text="Add New"
        class="hidden md:flex"
        (click)="(click.emit())"
      />}
    </div>
    @if(showSeparator){
    <brn-separator hlmSeparator class="my-4" />
    }
  `,
})
export class PageHeaderComponent {
  protected readonly _title = signal<string>('');
  protected readonly _listLength = signal<number>(0);
  protected readonly _super = signal<string>('');
  protected readonly _desc = signal<string>('');
  protected readonly _showBtn = signal<boolean>(false);

  @Input()
  set title(value: string) {
    this._title.set(value);
  }

  @Input()
  set listLength(value: number) {
    this._listLength.set(value);
  }

  @Input()
  set super(value: string) {
    this._super.set(value);
  }

  @Input()
  set description(value: string) {
    this._desc.set(value);
  }

  @Input({ transform: booleanAttribute })
  set showCreateButton(value: boolean) {
    this._showBtn.set(value);
  }

  @Input({transform: booleanAttribute}) showSeparator = true

  @Output() click = new EventEmitter<void>();
}
