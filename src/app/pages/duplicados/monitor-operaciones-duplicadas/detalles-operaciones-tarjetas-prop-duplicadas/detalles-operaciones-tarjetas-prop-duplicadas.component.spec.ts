import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesOperacionesTarjetasPropDuplicadasComponent } from './detalles-operaciones-tarjetas-prop-duplicadas.component';

describe('DetallesOperacionesTarjetasPropDuplicadasComponent', () => {
  let component: DetallesOperacionesTarjetasPropDuplicadasComponent;
  let fixture: ComponentFixture<DetallesOperacionesTarjetasPropDuplicadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallesOperacionesTarjetasPropDuplicadasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesOperacionesTarjetasPropDuplicadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
