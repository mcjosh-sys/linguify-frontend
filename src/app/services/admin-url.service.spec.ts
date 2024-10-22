import { TestBed } from '@angular/core/testing';

import { AdminUrlService } from './admin-url.service';

describe('AdminUrlService', () => {
  let service: AdminUrlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminUrlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
