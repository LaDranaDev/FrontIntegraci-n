import { TestBed } from '@angular/core/testing';

import { CierreProductosService } from './cierre-productos.service';

describe('CierreProductosService', () => {
  let service: CierreProductosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CierreProductosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
