import { TestBed } from '@angular/core/testing';

import { EdoCuentaService } from './edo-cuenta.service';

describe('EdoCuentaService', () => {
  let service: EdoCuentaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EdoCuentaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
