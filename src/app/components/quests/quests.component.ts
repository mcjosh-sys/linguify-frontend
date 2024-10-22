import { quests } from '@/app/constants';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { LinearProgressComponent } from '../linear-progress/linear-progress.component';

@Component({
  selector: 'app-quests-component',
  standalone: true,
  imports: [HlmButtonDirective, RouterLink, LinearProgressComponent],
  template: `
    <div class="flex items-center justify-between w-full space-y-2">
      <h3 class="font-bold text-lg">Quests</h3>
      <a routerLink="/quests" hlmBtn variant="primaryOutline" size="sm">
        View all
      </a>
    </div>
    <ul class="w-full space-y-4">
      @for(quest of quests.slice(0,3); track quest.title;){
      <div class="flex items-center w-full pb-4 gap-x-2">
        <img src="/images/points.svg" alt="Points" width="40" height="40" />
        <div class="flex flex-col gap-y-2 w-full">
          <p class="text-neutral-700 text-sm font-bold">
            {{ quest.title }}
          </p>
          <app-linear-progress
            [value]="questProgress(quest.value)"
            class="h-2"
          />
        </div>
      </div>
      }
    </ul>
  `,
  host: {
    class: 'border-2 rounded-xl p-4 space-y-4',
  },
})
export class QuestsComponent {
  points = input<number>(0);

  quests = quests;

  questProgress(value: number) {
    return (this.points() / value) * 100;
  }
}
