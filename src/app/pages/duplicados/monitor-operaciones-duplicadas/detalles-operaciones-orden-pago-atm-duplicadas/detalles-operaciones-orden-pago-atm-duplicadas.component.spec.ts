import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesOperacionesOrdenPagoAtmDuplicadasComponent } from './detalles-operaciones-orden-pago-atm-duplicadas.component';

describe('DetallesOperacionesOrdenPagoAtmDuplicadasComponent', () => {
  let component: DetallesOperacionesOrdenPagoAtmDuplicadasComponent;
  let fixture: ComponentFixture<DetallesOperacionesOrdenPagoAtmDuplicadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallesOperacionesOrdenPagoAtmDuplicadasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesOperacionesOrdenPagoAtmDuplicadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
