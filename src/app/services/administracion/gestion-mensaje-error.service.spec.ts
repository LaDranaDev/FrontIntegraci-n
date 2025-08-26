import { TestBed } from '@angular/core/testing';

import { GestionMensajeErrorService } from './gestion-mensaje-error.service';

describe('GestionMensajeErrorService', () => {
  let service: GestionMensajeErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionMensajeErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
