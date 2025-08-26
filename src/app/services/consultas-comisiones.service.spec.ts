import { TestBed } from '@angular/core/testing';

import { ConsultasComisionesService } from './consultas-comisiones.service';

describe('ConsultasComisionesService', () => {
  let service: ConsultasComisionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsultasComisionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
