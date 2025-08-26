import { TestBed } from '@angular/core/testing';

import { ConsultaTrackingArchivoService } from './consulta-tracking-archivo.service';

describe('ConsultaTrackingArchivoService', () => {
  let service: ConsultaTrackingArchivoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsultaTrackingArchivoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
