import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsolidadoHistoricoOperacionesComponent } from './consolidado-historico-operaciones.component';

describe('ConsolidadoHistoricoOperacionesComponent', () => {
  let component: ConsolidadoHistoricoOperacionesComponent;
  let fixture: ComponentFixture<ConsolidadoHistoricoOperacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsolidadoHistoricoOperacionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsolidadoHistoricoOperacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
