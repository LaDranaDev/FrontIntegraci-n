import { TestBed } from '@angular/core/testing';

import { MonitorSaldosService } from './monitor-saldos.service';

describe('MonitorSaldosService', () => {
  let service: MonitorSaldosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonitorSaldosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
