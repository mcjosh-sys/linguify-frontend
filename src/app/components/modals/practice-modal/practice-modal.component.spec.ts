import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeModalComponent } from './practice-modal.component';

describe('PracticeModalComponent', () => {
  let component: PracticeModalComponent;
  let fixture: ComponentFixture<PracticeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PracticeModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PracticeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
