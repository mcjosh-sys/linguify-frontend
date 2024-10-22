import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengeOptionsComponent } from './challenge-options.component';

describe('ChallengeOptionsComponent', () => {
  let component: ChallengeOptionsComponent;
  let fixture: ComponentFixture<ChallengeOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChallengeOptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChallengeOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
