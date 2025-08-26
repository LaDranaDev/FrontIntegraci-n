import { TestBed } from '@angular/core/testing';

import { ReportesConfirmingService } from './reportes-confirming.service';

describe('ReportesConfirmingService', () => {
  let service: ReportesConfirmingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportesConfirmingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
