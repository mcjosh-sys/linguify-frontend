import { Component, input } from '@angular/core';

@Component({
  selector: 'app-circular-progress',
  standalone: true,
  imports: [],
  template: `
    <div class="progress-container">
      <svg viewBox="0 0 36 36" class="circular-chart">
        <path
          class="circle-bg"
          d="M18 2.0845
             a 15.9155 15.9155 0 0 1 0 31.831
             a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path
          class="circle"
          [attr.stroke-dasharray]="progress + ', 100'"
          d="M18 2.0845
             a 15.9155 15.9155 0 0 1 0 31.831
             a 15.9155 15.9155 0 0 1 0 -31.831"
        />
      </svg>
      <div class="progress-content">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styleUrl: './circular-progress.component.css',
})
export class CircularProgressComponent {
  percent = input<number>();

  get progress() {
    return Number.isNaN(this.percent()) ? 0 : this.percent();
  }
}
