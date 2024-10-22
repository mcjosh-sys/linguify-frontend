import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonButtonComponent } from './lesson-button.component';

describe('LessonButtonComponent', () => {
  let component: LessonButtonComponent;
  let fixture: ComponentFixture<LessonButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
