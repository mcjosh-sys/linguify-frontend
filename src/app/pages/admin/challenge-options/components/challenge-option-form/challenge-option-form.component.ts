import { Challenge, ChallengeOption } from '@/app/models/admin.models';
import { AdminService } from '@/app/services/admin.service';
import { AsyncPipe, NgClass } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { lucideLoader2, lucideSave } from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmCheckboxComponent } from '@spartan-ng/ui-checkbox-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import {
  HlmInputDirective
} from '@spartan-ng/ui-input-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { BrnSelectImports } from '@spartan-ng/ui-select-brain';
import { HlmSelectImports } from '@spartan-ng/ui-select-helm';
import { toast } from 'ngx-sonner';
import { finalize, firstValueFrom, map, Observable } from 'rxjs';
import { MediaUploadComponent } from '../../../components/form-controls/media/media.component';
import { errorHandler } from '../../../courses/components/course-form/course-form.component';

@Component({
  selector: 'app-admin-challenge-option-form',
  standalone: true,
  imports: [
    NgClass,
    ReactiveFormsModule,
    AsyncPipe,
    HlmInputDirective,
    HlmLabelDirective,
    HlmButtonDirective,
    HlmIconComponent,
    MediaUploadComponent,
    HlmLabelDirective,
    HlmCheckboxComponent,
    BrnSelectImports,
    HlmSelectImports,
  ],
  providers: [provideIcons({ lucideSave, lucideLoader2 })],
  template: ` <form
    [formGroup]="form"
    class="flex flex-col items-start gap-y-4"
  >
    <label hlmLabel>
      Text
      <input
        hlmInput
        type="text"
        formControlName="text"
        class="w-60"
        placeholder="Text"
      />
      @if(form.get('text')?.touched && form.get('text')?.hasError('required')){
      <small class="text-rose-500">Text is required</small>
      }
    </label>
    <label hlmLabel>
      Challenge
      <brn-select
        placeholder="Select a challenge"
        formControlName="challengeId"
      >
        <hlm-select-trigger class="w-60">
          <hlm-select-value />
        </hlm-select-trigger>
        <hlm-select-content>
          @for(item of challenges$ | async; track item.id){
          <hlm-option [value]="item.id">{{ item.question }}</hlm-option>
          }
        </hlm-select-content>
      </brn-select>
      @if(form.get('challengeId')?.touched &&
      form.get('challengeId')?.hasError('required')){
      <small class="text-rose-500">Challenge is required</small>
      }
    </label>
    <div>
      <app-media-upload label="image" type="image" formControlName="imageSrc" />
      @if(form.get('imageSrc')?.touched &&
      form.get('imageSrc')?.hasError('required')){
      <small class="text-rose-500">Image is required</small>
      }
    </div>
    <div>
      <app-media-upload label="audio" type="audio" formControlName="audioSrc" />
      @if(form.get('audioSrc')?.touched &&
      form.get('audioSrc')?.hasError('required')){
      <small class="text-rose-500">Audio is required</small>
      }
    </div>
    <label class="flex items-center" hlmLabel>
      <hlm-checkbox class="mr-2" formControlName="correct" />
      Correct
    </label>
    <button
      hlmBtn
      type="submit"
      variant="primary"
      class="flex items-center justify-center gap-2 mt-2 w-24"
      (click)="onSubmit()"
      [disabled]="!form.valid || pristine() || pending()"
    >
      <hlm-icon
        [name]="pending() ? 'lucideLoader2' : 'lucideSave'"
        size="sm"
        [ngClass]="{ 'animate-spin': pending() }"
      />
      @if(!pending()){Save}
    </button>
  </form>`,
})
export class ChallengeOptionFormComponent {
  data = input<ChallengeOption | null>(null);
  protected form!: FormGroup;
  protected readonly pristine = signal<boolean>(true);
  protected readonly initialValues = signal(null);
  protected readonly challenges$: Observable<Challenge[]> = this.adminService
    .getChallenges()
  protected readonly chanllenges = toSignal(this.challenges$);
  protected readonly pending = signal(false);

  protected readonly selectedChallenge = signal<Challenge | null>(null);

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly adminService: AdminService,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      text: [this.data() ? this.data()?.text : '', Validators.required],
      imageSrc: [this.data() ? this.data()?.imageSrc : ''],
      audioSrc: [this.data() ? this.data()?.audioSrc : '', Validators.required],
      challengeId: [
        this.data() ? this.data()?.challengeId : '',
        Validators.required,
      ],
      correct: [this.data() ? this.data()?.correct : false],
    });
    this.initialValues.set(this.form.getRawValue());
    this.form.valueChanges.subscribe(() => {
      this.checkPristine();
    });
    this.form.get('challengeId')?.valueChanges.subscribe((value) => {
      const selectedChallenge = this.chanllenges()?.find(
        (challenge) => challenge.id === value
      );
      const imageControl = this.form.get('imageSrc');
      if (selectedChallenge?.type === 'SELECT') {
        imageControl?.setValidators([Validators.required]);
      } else {
        imageControl?.clearValidators();
      }
      imageControl?.updateValueAndValidity();
    });
  }

  checkPristine() {
    const formValue = this.form.getRawValue();
    const isPristine =
      JSON.stringify(this.initialValues()) === JSON.stringify(formValue);
    this.pristine.set(isPristine);
  }

  onSubmit() {
    this.pending.set(true);

    const payload = {
      text: this.form.value.text,
      challengeId: this.form.value.challengeId,
      correct: this.form.value.correct,
      imageSrc: this.form.value.imageSrc,
      audioSrc: this.form.value.audioSrc,
    };

    if (this.data()) {
      const updateChallengeOption$ = this.adminService
        .updateChallengeOption(this.data()?.id, payload)
        .pipe(
          map((data: any) => {
            if (data?.error && data.error === 'permission') {
              throw new Error(data.error);
            }
            this.router.navigateByUrl('/admin/challenge-options');
            return data;
          }),
          finalize(() => this.pending.set(false))
        );

      toast.promise(firstValueFrom(updateChallengeOption$), {
        loading: 'Updating challenge option...',
        success: (_data: any) => "Challenge option updated.",
        error: errorHandler('challenge option', 'updating'),
      });
    } else {
      const createChallengeOption$ = this.adminService.createChallengeOption(payload).pipe(
        map((data: any) => {
          if (data?.error && data.error === 'permission') {
            throw new Error(data.error);
          }
          this.router.navigateByUrl('/admin/challenge-options');
          return data;
        }),
        finalize(() => this.pending.set(false))
      );

      toast.promise(firstValueFrom(createChallengeOption$), {
        loading: 'Creating challenge option...',
        success: (_data: any) => "Challenge option created.",
        error: errorHandler('challenge option', 'creating'),
      });
    }
  }
}
