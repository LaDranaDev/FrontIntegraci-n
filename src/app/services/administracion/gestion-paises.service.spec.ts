import { TestBed } from '@angular/core/testing';

import { GestionPaisesService } from './gestion-paises.service';

describe('GestionPaisesService', () => {
  let service: GestionPaisesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionPaisesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
