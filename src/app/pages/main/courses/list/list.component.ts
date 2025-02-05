import { Course } from '@/app/models/user.models';
import { UserProgressService } from '@/app/services/user-progress.service';
import { Component, Input, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CardComponent],
  template: `
    <div
      class="pt-6 grid grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-4"
    >
      @for(course of _courses(); track course.id){
      <app-card
        [course]="course"
        [disabled]="false"
        [active]="course.id === activeCourseId()"
        (onClick)="handleClick($event)"
      />
      }
    </div>
  `,
})
export class ListComponent {
  protected readonly _courses = signal<Course[]>([]);
  activeCourseId = input<number>();
  protected readonly pending = signal<boolean>(false);
  protected readonly loading = signal<boolean>(true);

  constructor(
    private readonly router: Router,
    private readonly userProgressService: UserProgressService,
  ) {}

  ngOnInit() {
    const filteredCourses = this._courses()?.filter(
      (c) => c.units?.length && c.units[0].lessons.length
    );
    this._courses.set(filteredCourses);
  }

  handleClick(id: number): any {
    if (this.pending()) return;

    if (id === this.activeCourseId()) return this.router.navigate(['/learn']);
    this.pending.set(true);

    this.userProgressService.upsertUserProgress(id).subscribe({
      next: () => {
        this.pending.set(false);
        this.router.navigate(['/learn']);
      },
      error: (err: any) => {
        this.pending.set(false);
        toast.error('Something went wrong!');
        console.log(err.message);
      },
    });
  }

  @Input()
  set courses(val: Course[]) {
    this._courses.set(val);
  }
}
