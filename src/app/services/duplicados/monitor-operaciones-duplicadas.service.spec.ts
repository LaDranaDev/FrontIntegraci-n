import { TestBed } from '@angular/core/testing';

import { MonitorOperacionesDuplicadasService } from './monitor-operaciones-duplicadas.service';

describe('MonitorOperacionesDuplicadasService', () => {
  let service: MonitorOperacionesDuplicadasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonitorOperacionesDuplicadasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
