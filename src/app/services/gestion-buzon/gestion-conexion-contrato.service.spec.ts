import { TestBed } from '@angular/core/testing';

import { GestionConexionContratoService } from './gestion-conexion-contrato.service';

describe('GestionConexionContratoService', () => {
  let service: GestionConexionContratoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionConexionContratoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
