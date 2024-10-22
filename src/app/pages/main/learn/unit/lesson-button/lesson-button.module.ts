import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LessonButtonComponent } from './lesson-button.component';
import { CircularProgressComponent } from '@/app/components/circular-progress/circular-progress.component';
import { RouterLink } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideCrown, lucideStar } from '@ng-icons/lucide';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { LucideAngularModule, Star, Crown, Check, Loader } from 'lucide-angular';

@NgModule({
  declarations: [LessonButtonComponent],
  imports: [
    RouterLink,
    CommonModule,
    CircularProgressComponent,
    HlmButtonDirective,
    HlmIconComponent,
    LucideAngularModule.pick({ Star, Crown, Check, Loader }),
  ],
  providers: [provideIcons({ lucideCrown, lucideStar, lucideCheck })],
  exports: [LessonButtonComponent],
})
export class LessonButtonModule {}
