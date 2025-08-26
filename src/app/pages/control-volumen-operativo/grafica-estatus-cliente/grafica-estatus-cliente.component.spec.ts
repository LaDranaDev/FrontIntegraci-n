import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficaEstatusClienteComponent } from './grafica-estatus-cliente.component';

describe('GraficaEstatusClienteComponent', () => {
  let component: GraficaEstatusClienteComponent;
  let fixture: ComponentFixture<GraficaEstatusClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraficaEstatusClienteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraficaEstatusClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
