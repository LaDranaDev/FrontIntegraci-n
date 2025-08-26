import { TestBed } from '@angular/core/testing';

import { ConsolidadoHistoricoLayoutsService } from './consolidado-historico-layouts.service';

describe('ConsolidadoHistoricoLayoutsService', () => {
  let service: ConsolidadoHistoricoLayoutsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsolidadoHistoricoLayoutsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
