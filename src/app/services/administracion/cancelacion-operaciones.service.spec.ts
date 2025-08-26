import { TestBed } from '@angular/core/testing';

import { CancelacionOperacionesService } from './cancelacion-operaciones.service';

describe('CancelacionOperacionesService', () => {
  let service: CancelacionOperacionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CancelacionOperacionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
