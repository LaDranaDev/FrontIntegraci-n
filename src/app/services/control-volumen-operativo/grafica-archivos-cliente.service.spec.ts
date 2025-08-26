import { TestBed } from '@angular/core/testing';

import { GraficaArchivosClienteService } from './grafica-archivos-cliente.service';

describe('GraficaArchivosClienteService', () => {
  let service: GraficaArchivosClienteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GraficaArchivosClienteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
