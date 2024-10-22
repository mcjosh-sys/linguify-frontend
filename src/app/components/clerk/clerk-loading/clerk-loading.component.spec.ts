import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClerkLoadingComponent } from './clerk-loading.component';

describe('ClerkLoadingComponent', () => {
  let component: ClerkLoadingComponent;
  let fixture: ComponentFixture<ClerkLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClerkLoadingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClerkLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
