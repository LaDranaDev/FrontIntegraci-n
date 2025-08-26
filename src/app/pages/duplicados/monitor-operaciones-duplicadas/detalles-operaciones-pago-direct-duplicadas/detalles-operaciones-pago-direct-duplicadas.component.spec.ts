import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesOperacionesPagoDirectDuplicadasComponent } from './detalles-operaciones-pago-direct-duplicadas.component';

describe('DetallesOperacionesPagoDirectDuplicadasComponent', () => {
  let component: DetallesOperacionesPagoDirectDuplicadasComponent;
  let fixture: ComponentFixture<DetallesOperacionesPagoDirectDuplicadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallesOperacionesPagoDirectDuplicadasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesOperacionesPagoDirectDuplicadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
