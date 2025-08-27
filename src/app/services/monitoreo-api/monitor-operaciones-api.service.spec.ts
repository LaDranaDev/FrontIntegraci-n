import { TestBed } from '@angular/core/testing';

import { MonitorOperacionesApiService } from './monitor-operaciones-api.service';

describe('MonitorOperacionesApiService', () => {
  let service: MonitorOperacionesApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonitorOperacionesApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
