import { TestBed } from '@angular/core/testing';

import { ScrollBlockerService } from './scroll-blocker.service';

describe('ScrollBlockerService', () => {
  let service: ScrollBlockerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScrollBlockerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
