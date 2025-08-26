import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsolidadoHistoricoClientesComponent } from './consolidado-historico-clientes.component';

describe('ConsolidadoHistoricoClientesComponent', () => {
  let component: ConsolidadoHistoricoClientesComponent;
  let fixture: ComponentFixture<ConsolidadoHistoricoClientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsolidadoHistoricoClientesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsolidadoHistoricoClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
