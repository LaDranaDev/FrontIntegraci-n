import { TestBed } from '@angular/core/testing';

import { CpService } from './cp.service';

describe('CpService', () => {
  let service: CpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
