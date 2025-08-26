import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficaEstatusClienteParametrizadaComponent } from './grafica-estatus-cliente-parametrizada.component';

describe('GraficaEstatusClienteParametrizadaComponent', () => {
  let component: GraficaEstatusClienteParametrizadaComponent;
  let fixture: ComponentFixture<GraficaEstatusClienteParametrizadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraficaEstatusClienteParametrizadaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraficaEstatusClienteParametrizadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
