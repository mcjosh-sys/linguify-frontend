import { Course } from '@/app/models/admin.models';
import { AdminService } from '@/app/services/admin.service';
import { NgClass } from '@angular/common';
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
import { toast } from 'ngx-sonner';
import { finalize, firstValueFrom, map } from 'rxjs';
import { MediaUploadComponent } from '../../../components/form-controls/media/media.component';

export const errorHandler = (title: string, action: 'creating' | 'updating' | 'deleting') => {
  return (error: any) => {
    if (error.message === 'permission') {
      return 'You do not have the permission to perform this action.';
    }
    return `Oopsy!, An error occured while ${action} ${title}.`;
  };
};

@Component({
  selector: 'app-admin-course-form',
  standalone: true,
  imports: [
    NgClass,
    ReactiveFormsModule,
    HlmInputDirective,
    HlmLabelDirective,
    HlmButtonDirective,
    HlmIconComponent,
    MediaUploadComponent,
  ],
  providers: [provideIcons({ lucideSave, lucideLoader2 })],
  template: `
    <form [formGroup]="form" class="flex flex-col items-start gap-y-4">
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
      <div>
        <app-media-upload
          label="image"
          type="image"
          formControlName="imageSrc"
        />
        @if(form.get('imageSrc')?.touched &&
        form.get('imageSrc')?.hasError('required')){
        <small class="text-rose-500">Image is required</small>
        }
      </div>
      <button
        hlmBtn
        type="submit"
        variant="primary"
        class="flex items-center justify-center gap-2 mt-2 w-24"
        [disabled]="!form.valid || pristine() || pending()"
        (click)="onSubmit()"
      >
        <hlm-icon [name]="pending() ? 'lucideLoader2':'lucideSave'" size="sm" [ngClass]="{'animate-spin': pending()}" />
        @if(!pending()){Save}
      </button>
    </form>
  `,
})
export class CourseFormComponent {
  course = input<Course | null>(null);

  protected form!: FormGroup;
  protected readonly pristine = signal<boolean>(true);
  protected readonly initialValues = signal(null);
  protected readonly pending = signal(false)

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly adminService: AdminService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      title: [this.course() ? this.course()?.title : '', Validators.required],
      imageSrc: [
        this.course() ? this.course()?.imageSrc : '',
        Validators.required,
      ],
    });
    this.initialValues.set(this.form.getRawValue());
    this.form.valueChanges.subscribe(() => this.checkPristine());
  }

  checkPristine() {
    const formValue = this.form.getRawValue();
    const isPristine =
      JSON.stringify(this.initialValues()) === JSON.stringify(formValue);
    this.pristine.set(isPristine);
  }

  onSubmit() {

    this.pending.set(true)

    const payload = {
      title: this.form.value.title,
      imageSrc: this.form.value.imageSrc,
    };

    if (this.course()) {
      const updateCourse = this.adminService
        .updateCourse(this.course()?.id, payload)
        .pipe(
          map((data: any) => {
            if (data?.error && data.error === 'permission') {
              throw new Error(data.error);
            }
            this.router.navigateByUrl('/admin/courses');
            return data
          }),
          finalize(() => this.pending.set(false))
        );

      toast.promise(firstValueFrom(updateCourse), {
        loading: 'Updating course...',
        success: (_data: any) => "Course updated successfully.",
        error: errorHandler('course', 'updating'),
      });
    } else {
      const createCourse = this.adminService
        .createCourse(payload)
        .pipe(map((data: any) => {
          if (data?.error && data.error === "permission") {
            throw new Error(
              data.error
            );
          }
          this.router.navigateByUrl('/admin/courses')
          return data
          }), finalize(() => this.pending.set(false)));

      toast.promise(firstValueFrom(createCourse), {
        loading: 'Creating course...',
        success: (_data: any) => "Course created successfully.",
        error: errorHandler('course', 'creating'),
      });
    }

  }
}
