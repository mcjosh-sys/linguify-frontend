import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengeOptionComponent } from './challenge-option.component';

describe('ChallengeOptionComponent', () => {
  let component: ChallengeOptionComponent;
  let fixture: ComponentFixture<ChallengeOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChallengeOptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChallengeOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
