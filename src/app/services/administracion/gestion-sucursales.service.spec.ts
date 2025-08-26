import { TestBed } from '@angular/core/testing';

import { GestionSucursalesService } from './gestion-sucursales.service';

describe('GestionSucursalesService', () => {
  let service: GestionSucursalesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionSucursalesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
