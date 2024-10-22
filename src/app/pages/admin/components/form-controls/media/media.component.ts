import { Component, forwardRef, Input, signal } from '@angular/core';
import { FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { MediaWidgetComponent } from '../../media-widget/media-widget.component';

type Media = 'image' | 'audio';

@Component({
  selector: 'app-media-upload',
  standalone: true,
  imports: [HlmLabelDirective, MediaWidgetComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MediaUploadComponent),
      multi: true,
    },
  ],
  template: `
    <label hlmLabel class="capitalize">
      {{ _label() }}
      <app-media-widget
        [type]="_type()"
        [value]="_value()"
        (select)="onSelect($event)"
      />
    </label>
  `,
  host: {
    '(click)':'onTouched()'
  }
})
export class MediaUploadComponent {
  protected readonly _value = signal<string>('');
  protected readonly _type = signal<Media>('image');
  protected readonly _label = signal<string>('');

  onChange!: (val: any) => {};
  onTouched!: () => {};

  writeValue(val: any): void {
    this._value.set(val);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabled?(isDisbaled: boolean): void {}

  onSelect(val: string) {
    this.onChange(val);
    this._value.set(val);
  }

  onDelete() {
    this.onChange('');
    this._value.set('');
  }

  @Input()
  set type(val: Media) {
    this._type.set(val);
  }

  @Input()
  set label(val: string) {
    this._label.set(val);
  }
}
