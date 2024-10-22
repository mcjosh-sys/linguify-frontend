import { TestBed } from '@angular/core/testing';

import { MediaBucketService } from './media-bucket.service';

describe('MediaBucketService', () => {
  let service: MediaBucketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MediaBucketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
