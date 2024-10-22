import { Component, input } from '@angular/core';

@Component({
  selector: 'app-question-bubble',
  standalone: true,
  imports: [],
  templateUrl: './question-bubble.component.html',
  host: {
    'class': 'flex items-center gap-x-4 mb-6'
  }
})
export class QuestionBubbleComponent {
  question = input<string>('');

}
