import { TestBed } from '@angular/core/testing';

import { SolicitudCambioEstatusService } from './solicitud-cambio-estatus.service';

describe('SolicitudCambioEstatusService', () => {
  let service: SolicitudCambioEstatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolicitudCambioEstatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
