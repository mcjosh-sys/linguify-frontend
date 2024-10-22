import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StickyWrapperComponent } from './sticky-wrapper.component';

describe('StickyWrapperComponent', () => {
  let component: StickyWrapperComponent;
  let fixture: ComponentFixture<StickyWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StickyWrapperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StickyWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
