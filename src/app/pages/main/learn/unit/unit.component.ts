import { Lesson } from '@/app/models/user.models';
import { Component, input } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideCrown, lucideStar } from '@ng-icons/lucide';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { LessonButtonModule } from './lesson-button/lesson-button.module';
import { UnitBannerComponent } from './unit-banner/unit-banner.component';

@Component({
  selector: 'app-unit',
  standalone: true,
  imports: [UnitBannerComponent, LessonButtonModule, HlmIconComponent],
  providers: [provideIcons({ lucideCrown, lucideStar, lucideCheck })],
  template: `
    <app-unit-banner [title]="title()" [description]="description()" />
    <div class="flex items-center flex-col relative">
      @for(lesson of lessons(); track lesson.id; let index = $index){
      <app-lesson-button
        [id]="lesson.id"
        [index]="index"
        [totalCount]="lessons()!.length - 1"
        [current]="lesson.id === activeLesson()?.id"
        [locked]="!lesson.completed && !(lesson.id === activeLesson()?.id)"
        [percentage]="activeLessonPercentage()"
      />
      }
    </div>
  `,
})
export class UnitComponent {
  id = input<number>(0);
  order = input<number>(0);
  title = input<string>('');
  description = input<string>('');
  lessons = input<Lesson[]>();
  activeLesson = input<Lesson>();
  activeLessonPercentage = input<number>(0);

  ngOnInit() {
    // this.lessons()?.map((lesson) =>
    //   console.log('totalCount: ', this.lessons()?.length! - 1)
    // );
  }
}
