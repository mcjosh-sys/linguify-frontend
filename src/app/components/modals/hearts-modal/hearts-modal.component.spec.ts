import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeartModalComponent } from './hearts-modal.component';

describe('HeartModalComponent', () => {
  let component: HeartModalComponent;
  let fixture: ComponentFixture<HeartModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeartModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeartModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
