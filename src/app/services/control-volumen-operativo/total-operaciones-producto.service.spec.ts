import { TestBed } from '@angular/core/testing';

import { TotalOperacionesProductoService } from './total-operaciones-producto.service';

describe('TotalOperacionesProductoService', () => {
  let service: TotalOperacionesProductoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TotalOperacionesProductoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
