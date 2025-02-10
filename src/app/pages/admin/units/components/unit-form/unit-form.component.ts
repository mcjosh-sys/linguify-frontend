import { Course, Unit } from '@/app/models/admin.models';
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
import {
  HlmInputDirective
} from '@spartan-ng/ui-input-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { BrnSelectImports } from '@spartan-ng/ui-select-brain';
import { HlmSelectImports } from '@spartan-ng/ui-select-helm';
import { toast } from 'ngx-sonner';
import { finalize, firstValueFrom, map, Observable } from 'rxjs';
import { errorHandler } from '../../../courses/components/course-form/course-form.component';

@Component({
  selector: 'app-admin-unit-form',
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
      Description
      <textarea
        hlmInput
        type="text"
        formControlName="description"
        placeholder="Enter unit description here"
        class="w-60 min-h-20"
      ></textarea>
      @if(form.get('description')?.touched){
      @if(form.get('description')?.hasError('required')){
      <small class="text-rose-500">Description is required</small>
      } @if(form.get('description')?.hasError('minlength')){
      <small class="text-rose-500"
        >The description must be at least 10 characters</small
      >
      } }
    </label>
    <label hlmLabel>
      Course
      <brn-select placeholder="Select a course" formControlName="courseId">
        <hlm-select-trigger class="w-60">
          <hlm-select-value />
        </hlm-select-trigger>
        <hlm-select-content>
          @for(item of courses$ | async; track item.id){
          <hlm-option [value]="item.id">{{ item.title }}</hlm-option>
          }
        </hlm-select-content>
      </brn-select>
      @if(form.get('courseId')?.touched &&
      form.get('courseId')?.hasError('required')){
      <small class="text-rose-500">Course is required</small>
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
      <small class="text-rose-500">The unit order is required</small>
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
export class UnitFormComponent {
  data = input<Unit | null>(null);
  protected form!: FormGroup;
  protected readonly pristine = signal<boolean>(true);
  protected readonly initialValues = signal(null);
  protected readonly courses$: Observable<Course[]> = this.adminService
    .getCourses()

  protected readonly pending = signal(false);

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly adminService: AdminService,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      title: [this.data() ? this.data()?.title : '', Validators.required],
      description: [
        this.data() ? this.data()?.description : '',
        [Validators.required, Validators.minLength(10)],
      ],
      courseId: [this.data() ? this.data()?.courseId : '', Validators.required],
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
      description: this.form.value.description,
      courseId: this.form.value.courseId,
      order: this.form.value.order,
    };

    if (this.data()) {
      const updateUnit$ = this.adminService
        .updateUnit(this.data()?.id, payload)
        .pipe(
          map((data: any) => {
            if (data?.error && data.error === 'permission') {
              throw new Error(data.error);
            }
            this.router.navigateByUrl('/admin/units');
            return data;
          }),
          finalize(() => this.pending.set(false))
        );

      toast.promise(firstValueFrom(updateUnit$), {
        loading: 'Updating unit...',
        success: (_data: any) => "Unit updated successfully.",
        error: errorHandler('unit', 'updating'),
      });
    } else {
      const createUnit$ = this.adminService.createUnit(payload).pipe(
        map((data: any) => {
          if (data?.error && data.error === 'permission') {
            throw new Error(data.error);
          }
          this.router.navigateByUrl('/admin/units');
          return data;
        }),
        finalize(() => this.pending.set(false))
      );

      toast.promise(firstValueFrom(createUnit$), {
        loading: 'Creating unit...',
        success: (_data: any) => "Unit created successfully.",
        error: errorHandler('unit', 'creating'),
      });
    }
  }
}
