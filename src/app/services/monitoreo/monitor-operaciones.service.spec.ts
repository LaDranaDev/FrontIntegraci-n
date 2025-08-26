import { TestBed } from '@angular/core/testing';

import { MonitorOperacionesService } from './monitor-operaciones.service';

describe('MonitorOperacionesService', () => {
  let service: MonitorOperacionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonitorOperacionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
