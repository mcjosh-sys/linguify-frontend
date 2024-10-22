import { Course } from '@/app/models/course.models';
import { UserProgress } from '@/app/models/user.models';
import { CourseService } from '@/app/services/course.service';
import { UserProgressService } from '@/app/services/user-progress.service';
import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideLoader } from '@ng-icons/lucide';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { ListComponent } from './list/list.component';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [ListComponent, HlmIconComponent],
  providers: [provideIcons({ lucideLoader })],
  template: `
    @if(loading){
    <div class="h-full w-full flex items-center justify-center">
      <hlm-icon
        name="lucideLoader"
        class="text-muted-foreground animate-spin"
      />
    </div>
    }@else{
    <div class="h-full max-w-[912px] px-3 mx-auto">
      <h1 class="text-2xl font-bold text-neutral-700">Language Courses</h1>
      <app-list
        [courses]="courses"
        [activeCourseId]="userProgress?.activeCourseId!"
      />
    </div>
    }
  `,
})
export class CoursesComponent {
  courses!: Course[];
  userProgress?: UserProgress;
  loading: boolean = true;

  constructor(
    private courseService: CourseService,
    private userProgressService: UserProgressService
  ) {}

  ngOnInit() {
    this.getCourses();
    this.getUserProgress();
  }

  getUserProgress() {
    this.userProgressService.getUserProgress().subscribe({
      next: (data: any) => {
        this.userProgress = data;
      },
      error: (err: any) => console.log(err.message),
    });
  }

  getCourses() {
    this.courseService.getCourses().subscribe({
      next: (data: any) => {
        this.loading = false;
        this.courses = data;
      },
      error: (err: any) => console.log(err.message),
    });
  }
}
