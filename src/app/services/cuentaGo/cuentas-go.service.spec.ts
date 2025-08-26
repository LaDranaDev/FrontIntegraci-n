import { TestBed } from '@angular/core/testing';

import { CuentasGoService } from './cuentas-go.service';

describe('CuentasGoService', () => {
  let service: CuentasGoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CuentasGoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
