import { TestBed } from '@angular/core/testing';

import { AdministracionCertificadosService } from './administracion-certificados.service';

describe('AdministracionCertificadosService', () => {
  let service: AdministracionCertificadosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdministracionCertificadosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
