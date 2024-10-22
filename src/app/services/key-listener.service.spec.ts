import { TestBed } from '@angular/core/testing';

import { KeyListenerService } from './key-listener.service';

describe('KeyListenerService', () => {
  let service: KeyListenerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeyListenerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
