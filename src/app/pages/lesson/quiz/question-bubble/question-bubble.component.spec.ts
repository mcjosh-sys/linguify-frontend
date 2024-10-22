import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionBubbleComponent } from './question-bubble.component';

describe('QuestionBubbleComponent', () => {
  let component: QuestionBubbleComponent;
  let fixture: ComponentFixture<QuestionBubbleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionBubbleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionBubbleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
