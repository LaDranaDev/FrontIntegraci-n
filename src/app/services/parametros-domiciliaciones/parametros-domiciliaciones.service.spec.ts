import { TestBed } from '@angular/core/testing';

import { ParametrosDomiciliacionesService } from './parametros-domiciliaciones.service';

describe('ParametrosDomiciliacionesService', () => {
  let service: ParametrosDomiciliacionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParametrosDomiciliacionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
