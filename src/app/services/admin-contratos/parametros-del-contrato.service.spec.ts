import { TestBed } from '@angular/core/testing';

import { ParametrosDelContratoService } from './parametros-del-contrato.service';

describe('ParametrosDelContratoService', () => {
  let service: ParametrosDelContratoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParametrosDelContratoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
