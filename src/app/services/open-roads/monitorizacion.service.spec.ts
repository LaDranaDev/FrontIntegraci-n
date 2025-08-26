import { TestBed } from '@angular/core/testing';

import { MonitorizacionService } from './monitorizacion.service';

describe('MonitorizacionService', () => {
  let service: MonitorizacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonitorizacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
