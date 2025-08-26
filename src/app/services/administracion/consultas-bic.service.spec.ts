import { TestBed } from '@angular/core/testing';

import { ConsultasBicService } from './consultas-bic.service';

describe('ConsultasBicService', () => {
  let service: ConsultasBicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsultasBicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
