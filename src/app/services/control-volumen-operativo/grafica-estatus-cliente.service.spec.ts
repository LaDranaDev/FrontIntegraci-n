import { TestBed } from '@angular/core/testing';

import { GraficaEstatusClienteService } from './grafica-estatus-cliente.service';

describe('GraficaEstatusClienteService', () => {
  let service: GraficaEstatusClienteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GraficaEstatusClienteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
