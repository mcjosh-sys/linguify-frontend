import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitBannerComponent } from './unit-banner.component';

describe('UnitBannerComponent', () => {
  let component: UnitBannerComponent;
  let fixture: ComponentFixture<UnitBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitBannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
