import { TestBed } from '@angular/core/testing';

import { GestionBackendService } from './gestion-backend.service';

describe('GestionBackendService', () => {
  let service: GestionBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
