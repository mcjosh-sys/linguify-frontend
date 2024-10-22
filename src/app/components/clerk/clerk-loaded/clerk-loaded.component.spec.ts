import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClerkLoadedComponent } from './clerk-loaded.component';

describe('ClerkLoadedComponent', () => {
  let component: ClerkLoadedComponent;
  let fixture: ComponentFixture<ClerkLoadedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClerkLoadedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClerkLoadedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
