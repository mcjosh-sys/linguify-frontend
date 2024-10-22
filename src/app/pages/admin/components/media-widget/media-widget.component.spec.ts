import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaWidgetComponent } from './media-widget.component';

describe('MediaWidgetComponent', () => {
  let component: MediaWidgetComponent;
  let fixture: ComponentFixture<MediaWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
