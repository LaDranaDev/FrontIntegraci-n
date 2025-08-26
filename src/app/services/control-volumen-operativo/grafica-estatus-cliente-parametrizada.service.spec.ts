import { TestBed } from '@angular/core/testing';

import { GraficaEstatusClienteParametrizadaService } from './grafica-estatus-cliente-parametrizada.service';

describe('GraficaEstatusClienteParametrizadaService', () => {
  let service: GraficaEstatusClienteParametrizadaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GraficaEstatusClienteParametrizadaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
