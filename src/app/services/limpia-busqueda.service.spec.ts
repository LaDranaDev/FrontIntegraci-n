import { TestBed } from '@angular/core/testing';

import { LimpiaBusquedaService } from './limpia-busqueda.service';

describe('LimpiaBusquedaService', () => {
  let service: LimpiaBusquedaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LimpiaBusquedaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
