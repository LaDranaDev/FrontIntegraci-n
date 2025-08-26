import { TestBed } from '@angular/core/testing';

import { ConsolidadoHistoricoOperacionesService } from './consolidado-historico-operaciones.service';

describe('ConsolidadoHistoricoOperacionesService', () => {
  let service: ConsolidadoHistoricoOperacionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsolidadoHistoricoOperacionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
