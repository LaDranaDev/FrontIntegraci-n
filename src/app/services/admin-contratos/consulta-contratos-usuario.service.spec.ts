import { TestBed } from '@angular/core/testing';

import { ConsultaContratosUsuarioService } from './consulta-contratos-usuario.service';

describe('ConsultaContratosUsuarioService', () => {
  let service: ConsultaContratosUsuarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsultaContratosUsuarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
