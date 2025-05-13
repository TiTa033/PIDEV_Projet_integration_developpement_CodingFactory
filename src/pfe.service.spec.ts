import { TestBed } from '@angular/core/testing';

import { PfeService } from './pfe.service';

describe('PfeService', () => {
  let service: PfeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PfeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
