import { NgClass } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { provideIcons } from '@ng-icons/core';
import { lucideLoader2 } from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { HlmInputDirective, HlmInputErrorDirective } from '@spartan-ng/ui-input-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';

@Component({
  selector: 'app-invitation',
  standalone: true,
  imports: [
    NgClass,
    ReactiveFormsModule,
    HlmInputDirective,
    HlmLabelDirective,
    HlmInputErrorDirective,
    HlmButtonDirective,
    HlmIconComponent,
  ],
  providers: [provideIcons({ lucideLoader2 })],
  template: `
    <form [formGroup]="form" class="flex flex-col ">
      <label hlmLabel>
        Email
        <input hlmInput type="email" formControlName="email" class="w-full" />
        @if(form.get('email')?.touched){
        @if(form.get('email')?.hasError('required')){
        <p hlmInputError class="text-rose-500">email is required</p>
        }@else if(form.get('email')?.hasError('email')){
        <p hlmInputError class="text-rose-500">invalid email</p>
        } }
      </label>
      <button
        hlmBtn
        type="submit"
        variant="primary"
        class="flex items-center justify-center gap-2 mt-4 w-40 self-end"
        [disabled]="!form.valid || pending()"
        (click)="onSubmit()"
      >
        Send invite @if(pending()){
          <hlm-icon
            name="lucideLoader2"
            size="sm"
            class="animate-spin"
          />
        }
      </button>
    </form>
  `,
  host: {
    class: 'w-80 md:w-96 text-primary',
  },
})
export class InvitationComponent {
  protected form!: FormGroup;
  protected readonly pending = signal<boolean>(false);

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  onSubmit() {}
}
