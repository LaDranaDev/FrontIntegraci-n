import { TestBed } from '@angular/core/testing';

import { ConsultaTrackingApiService } from './consulta-tracking-api.service';

describe('ConsultaTrackingApiService', () => {
  let service: ConsultaTrackingApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsultaTrackingApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
