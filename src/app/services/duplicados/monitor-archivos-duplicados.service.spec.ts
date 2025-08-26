import { TestBed } from '@angular/core/testing';

import { MonitorArchivosDuplicadosService } from './monitor-archivos-duplicados.service';

describe('MonitorArchivosDuplicadosService', () => {
  let service: MonitorArchivosDuplicadosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonitorArchivosDuplicadosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
