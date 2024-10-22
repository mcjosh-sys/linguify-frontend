import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengeOptionsListComponent } from './challenge-options-list.component';

describe('ChallengeOptionsListComponent', () => {
  let component: ChallengeOptionsListComponent;
  let fixture: ComponentFixture<ChallengeOptionsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChallengeOptionsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChallengeOptionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
