import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengeOptionFormComponent } from './challenge-option-form.component';

describe('ChallengeOptionFormComponent', () => {
  let component: ChallengeOptionFormComponent;
  let fixture: ComponentFixture<ChallengeOptionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChallengeOptionFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChallengeOptionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
