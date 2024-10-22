import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinearProgressComponent } from './linear-progress.component';

describe('LinearProgressComponent', () => {
  let component: LinearProgressComponent;
  let fixture: ComponentFixture<LinearProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinearProgressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinearProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
