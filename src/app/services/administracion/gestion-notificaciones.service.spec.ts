import { TestBed } from '@angular/core/testing';

import { GestionBackendsService } from './gestion-notificaciones.service';

describe('GestionBackendsService', () => {
  let service: GestionBackendsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionBackendsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
