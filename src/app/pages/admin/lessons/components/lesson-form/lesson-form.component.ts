import { Lesson, Unit } from '@/app/models/admin.models';
import { AdminService } from '@/app/services/admin.service';
import { AsyncPipe, NgClass } from '@angular/common';
import { Component, input, signal } from '@angular/core';
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
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { BrnSelectImports } from '@spartan-ng/ui-select-brain';
import { HlmSelectImports } from '@spartan-ng/ui-select-helm';
import { toast } from 'ngx-sonner';
import { finalize, firstValueFrom, map, Observable } from 'rxjs';
import { errorHandler } from '../../../courses/components/course-form/course-form.component';

@Component({
  selector: 'app-admin-lesson-form',
  standalone: true,
  imports: [
    NgClass,
    ReactiveFormsModule,
    AsyncPipe,
    HlmInputDirective,
    HlmLabelDirective,
    HlmButtonDirective,
    HlmIconComponent,
    BrnSelectImports,
    HlmSelectImports,
  ],
  providers: [provideIcons({ lucideSave, lucideLoader2 })],
  template: ` <form
    [formGroup]="form"
    class="flex flex-col items-start gap-y-4"
  >
    <label hlmLabel>
      Title
      <input
        hlmInput
        type="text"
        formControlName="title"
        class="w-60"
        placeholder="Title"
      />
      @if(form.get('title')?.touched &&
      form.get('title')?.hasError('required')){
      <small class="text-rose-500">Title is required</small>
      }
    </label>
    <label hlmLabel>
      Unit
      <brn-select placeholder="Select a unit" formControlName="unitId">
        <hlm-select-trigger class="w-60">
          <hlm-select-value />
        </hlm-select-trigger>
        <hlm-select-content>
          @for(item of units$ | async; track item.id){
          <hlm-option [value]="item.id">{{ item.title }}</hlm-option>
          }
        </hlm-select-content>
      </brn-select>
      @if(form.get('unitId')?.touched &&
      form.get('unitId')?.hasError('required')){
      <small class="text-rose-500">Unit is required</small>
      }
    </label>
    <label hlmLabel>
      Order
      <input
        hlmInput
        type="text"
        formControlName="order"
        class="w-60"
        placeholder="e.g. 1"
      />
      @if(form.get('order')?.touched &&
      form.get('order')?.hasError('required')){
      <small class="text-rose-500">The lesson order is required</small>
      }
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
export class LessonFormComponent {
  data = input<Lesson | null>(null);
  protected form!: FormGroup;
  protected readonly pristine = signal<boolean>(true);
  protected readonly initialValues = signal(null);
  protected readonly units$: Observable<Unit[]> = this.adminService
    .getUnits()
    .pipe(map((res: any) => res.data));

  protected readonly pending = signal(false);

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly adminService: AdminService,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      title: [this.data() ? this.data()?.title : '', Validators.required],
      unitId: [
        this.data() ? this.data()?.unitId : '',
        [Validators.required, Validators.minLength(10)],
      ],
      order: [this.data() ? this.data()?.order : '', Validators.required],
    });
    this.initialValues.set(this.form.getRawValue());
    this.form.valueChanges.subscribe(() => {
      this.checkPristine();
    });
    this.form.get('order')?.valueChanges.subscribe((value) => {
      const numberValue = parseInt(value, 10);
      if (value !== numberValue) {
        this.form
          .get('order')
          ?.setValue(numberValue || '', { emitEvent: false });
      }
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
      title: this.form.value.title,
      unitId: this.form.value.unitId,
      order: this.form.value.order,
    };

    if (this.data()) {
      const updateLesson$ = this.adminService
        .updateLesson(this.data()?.id, payload)
        .pipe(
          map((data: any) => {
            if (data?.error && data.error === 'permission') {
              throw new Error(data.error);
            }
            this.router.navigateByUrl('/admin/lessons');
            return data;
          }),
          finalize(() => this.pending.set(false))
        );

      toast.promise(firstValueFrom(updateLesson$), {
        loading: 'Updating lesson...',
        success: (_data: any) => "Lesson updated successfully.",
        error: errorHandler('lesson', 'updating'),
      });
    } else {
      const createLesson$ = this.adminService.createLesson(payload).pipe(
        map((data: any) => {
          if (data?.error && data.error === 'permission') {
            throw new Error(data.error);
          }
          this.router.navigateByUrl('/admin/lessons');
          return data;
        }),
        finalize(() => this.pending.set(false))
      );

      toast.promise(firstValueFrom(createLesson$), {
        loading: 'Creating lesson...',
        success: (_data: any) => "Lesson created successfully.",
        error: errorHandler('lesson', 'updating'),
      });
    }
  }
}
